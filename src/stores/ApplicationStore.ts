import {makeAutoObservable} from "mobx";
import {makePersistable} from "mobx-persist-store";
import {Application, Frame, Scene} from "../types/application.types.ts";

class ApplicationStore {
  public current: Application | null = null;
  public applications: Application[] = [];

  public editorContext: Frame | null = null;

  constructor() {
    makeAutoObservable(this);

    makePersistable(
      this,
      {
        name: 'ApplicationStore',
        properties: ['current','applications'],
        storage: window.localStorage,
        // expireIn: 86400000, // 1 day in MS
        removeOnExpiration: true,
      },
      { delay: 200, fireImmediately: false },
    );
  }

  /**
   * Saves an application to both this.applications and the current application if it happens to be the current one
   * @param application
   */
  saveApplication(application: Application){
    const index = this.applications.findIndex((a) => a.id === this.current?.id);
    if(index > -1){
      this.applications = [
        ...this.applications.slice(0, index),
        application,
        ...this.applications.slice(index+1),
      ]
    }
    /**
     * Also save to the current if its the same.
     */
    if(this.current?.id === application.id){
      this.current = application;
    }
  }

  getApplication(id: string): Application | null {
    return this.applications.find((a) => a.id === id) ?? null;
  }

  setCurrentApplication(application: Application | null){
    this.current = application;
  }

  addApplication(application: Application) {
    this.applications.push(application);
  }

  /**
   * Add a new scene to an application
   * @param id
   * @param scene
   */
  addScene(id: string, scene: Scene) {
    const application = this.getApplication(id);
    if(application){
      application.scenes.push(scene);
      this.saveApplication(application);
    }
  }

  /**
   * Removes a scene from an application (include all frames)
   * @param id
   * @param sceneId
   */
  removeScene(id: string, sceneId: string) {
    const application = this.getApplication(id);
    if(application){
      const sceneIndex = application.scenes.findIndex((s) => s.id === sceneId);
      if(sceneIndex > -1){
        application.scenes = [
          ...application.scenes.slice(0, sceneIndex),
          ...application.scenes.slice(sceneIndex+1)
        ]
        this.saveApplication(application);
      }
    }
  }

  /**
   * Takes a scene and pushes it back into the application stack.
   * @param id
   * @param scene
   */
  updateScene(id: string, scene: Scene) {
    const application = this.getApplication(id);
    if(application){
      const sceneIndex = application.scenes.findIndex((s) => s.id === scene.id);
      if(sceneIndex > -1){
        application.scenes = [
          ...application.scenes.slice(0, sceneIndex),
          scene,
          ...application.scenes.slice(sceneIndex+1)
        ]
        this.saveApplication(application);
      }
    }
 }

  /**
   * Find and return a scene from a given application
   * @param id
   * @param sceneId
   */
 getScene(id: string, sceneId: string){
    const application = this.getApplication(id);
    if(application){
      return application.scenes.find((s) => s.id === sceneId) ?? null;
    }
    return null;
 }

  /**
   * Adds a new frame to a scene
   * @param id
   * @param sceneId
   * @param frame
   */
  addFrame(id: string, sceneId: string, frame: Frame) {
    const application = this.getApplication(id);
    if(application){
      const scene = this.getScene(id, sceneId);
      if(scene){
        scene.frames.push(frame);
        this.updateScene(id, scene);
      }
    }
  }

  /**
   * Takes an updated frame and pushes it back into the application stack where it should go.
   * @param id
   * @param frame
   */
  updateFrame(id: string, frame: Frame) {
    const application = this.getApplication(id);
    if(application){
      const scenes = application.scenes;
      scenes.forEach((scene) => {
        const frameIndex = scene.frames.findIndex((f) => f.id === frame.id);
        if(frameIndex > -1){
          scene.frames = [
            ...scene.frames.slice(0,frameIndex),
            frame,
            ...scene.frames.slice(frameIndex+1)
          ]

          this.updateScene(id, scene);
        }
      })
    }
  }


  /**
   * Removes a frame and pushed it back into the application stack
   * @param id
   * @param frameId
   */
  removeFrame(id: string, frameId: string) {
    const application = this.getApplication(id);
    if(application){
      const scenes = application.scenes;
      scenes.forEach((scene) => {
        const frameIndex = scene.frames.findIndex((f) => {
          return f.id === frameId
        });
        if(frameIndex > -1){
          scene.frames = [
            ...scene.frames.slice(0,frameIndex),
            ...scene.frames.slice(frameIndex+1)
          ]
          this.updateScene(id, scene);
        }
      })
    }
  }

  getFrame(id: string, frameId: string) {
    const application = this.getApplication(id);
    let found = null;
    if(application){
      const scenes = application.scenes;
      scenes.forEach((scene) => {
        const frame = scene.frames.find((f) => {
          return f.id === frameId
        });
        if(frame){
          found = frame;
        }
      })
    }
    return found;
  }

  setEditorContext(context: Frame | null) {
    this.editorContext = context;
  }

}

const singleton = new ApplicationStore();
export default singleton;

