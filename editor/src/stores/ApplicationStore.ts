import { computed, makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import {
  Application,
  ApplicationAuthor,
  ApplicationVariable,
  Choice,
  Condition,
  FontStyles,
  Frame,
  Scene,
  Trigger,
} from '@shared/types';
import { v4 } from 'uuid';
import {
  generateColourScale,
  setDocumentFontFamily,
  setDocumentProperty,
} from '@shared/functions';

class ApplicationStore {
  public current: Application | null = null;
  public applications: Application[] = [];

  public editorContext: Scene | null = null;

  constructor() {
    makeAutoObservable(this, {
      totalChoicesForCurrent: computed,
    });

    makePersistable(
      this,
      {
        name: 'ApplicationStore',
        properties: ['current', 'applications'],
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
  saveApplication(application: Application) {
    const index = this.applications.findIndex(a => a.id === this.current?.id);
    if (index > -1) {
      this.applications = [
        ...this.applications.slice(0, index),
        application,
        ...this.applications.slice(index + 1),
      ];
    }
    /**
     * Also save to the current if its the same.
     */
    if (this.current?.id === application.id) {
      this.current = application;
    }
  }

  getApplication(id: string): Application | null {
    return this.applications.find(a => a.id === id) ?? null;
  }

  setCurrentApplication(application: Application | null) {
    if (application && !application?.variables) {
      application.variables = [];
    }

    this.current = application;

    setDocumentFontFamily(application?.theming?.fontStyle ?? FontStyles.SERIF);
    generateColourScale(
      application?.theming?.elementsColor ?? '#858f64',
      'elements',
    );
    setDocumentProperty(
      'colour-background',
      application?.theming?.backgroundColor ?? '#f8f4f1',
    );
    setDocumentProperty(
      'colour-text',
      application?.theming?.textColor ?? '#070708',
    );
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
    if (application) {
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
    if (application) {
      const sceneIndex = application.scenes.findIndex(s => s.id === sceneId);
      if (sceneIndex > -1) {
        application.scenes = [
          ...application.scenes.slice(0, sceneIndex),
          ...application.scenes.slice(sceneIndex + 1),
        ];
        this.cleanupDanglingChoices();
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
    if (application) {
      const sceneIndex = application.scenes.findIndex(s => s.id === scene.id);
      if (sceneIndex > -1) {
        application.scenes = [
          ...application.scenes.slice(0, sceneIndex),
          scene,
          ...application.scenes.slice(sceneIndex + 1),
        ];
        console.log('updating scene');
        this.saveApplication(application);
      }
    }
  }

  /**
   * Find and return a scene from a given application
   * @param id
   * @param sceneId
   */
  getScene(id: string, sceneId: string) {
    const application = this.getApplication(id);
    if (application) {
      return application.scenes.find(s => s.id === sceneId) ?? null;
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
    if (application) {
      const scene = this.getScene(id, sceneId);
      if (scene) {
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
    if (application) {
      const scenes = application.scenes;
      scenes.forEach(scene => {
        const frameIndex = scene.frames.findIndex(f => f.id === frame.id);
        if (frameIndex > -1) {
          scene.frames = [
            ...scene.frames.slice(0, frameIndex),
            frame,
            ...scene.frames.slice(frameIndex + 1),
          ];

          this.updateScene(id, scene);
        }
      });
    }
  }

  addChoice(id: string, source: string, destination: string, label: string) {
    const application = this.getApplication(id);
    if (application) {
      const scene = application.scenes.find(s => s.id === source);
      if (scene) {
        const updatedScene: Scene = {
          ...scene,
          choices: [
            ...scene.choices,
            {
              id: v4(),
              type: 'choice',
              label,
              target: destination,
              conditions: [],
              triggers: [],
            },
          ],
        };
        this.updateScene(application.id, updatedScene);
      }
    }
  }

  removeChoice(id: string, sceneId: string, choiceId: string) {
    const application = this.getApplication(id);
    if (application) {
      const scene = application.scenes.find(s => s.id === sceneId);
      if (scene) {
        const updatedScene: Scene = {
          ...scene,
          choices: scene.choices.filter(c => c.id !== choiceId),
        };
        this.updateScene(application.id, updatedScene);
      }
    }
  }

  /**
   * Removes a frame and pushed it back into the application stack
   * @param id
   * @param frameId
   */
  removeFrame(id: string, frameId: string) {
    const application = this.getApplication(id);
    if (application) {
      const scenes = application.scenes;
      scenes.forEach(scene => {
        const frameIndex = scene.frames.findIndex(f => {
          return f.id === frameId;
        });
        if (frameIndex > -1) {
          scene.frames = [
            ...scene.frames.slice(0, frameIndex),
            ...scene.frames.slice(frameIndex + 1),
          ];
          this.updateScene(id, scene);
        }
      });
    }
  }

  getFrame(id: string, frameId: string) {
    const application = this.getApplication(id);
    let found = null;
    if (application) {
      const scenes = application.scenes;
      scenes.forEach(scene => {
        const frame = scene.frames.find(f => {
          return f.id === frameId;
        });
        if (frame) {
          found = frame;
        }
      });
    }
    return found;
  }

  getChoice(id: string, choiceId: string): null | Choice {
    const application = this.getApplication(id);
    let found: null | Choice = null;
    if (application) {
      const scenes = application.scenes;
      scenes.forEach(scene => {
        const choice = scene.choices.find(c => c.id === choiceId);
        if (choice !== undefined) {
          found = choice;
        }
      });
    }
    return found;
  }

  updateChoice(id: string, sceneId: string, choice: Choice) {
    const application = this.getApplication(id);
    if (application) {
      const scene = application.scenes.find(s => s.id === sceneId);
      if (scene) {
        const choiceIndex = scene.choices.findIndex(c => c.id === choice.id);
        const updatedScene: Scene = {
          ...scene,
          choices: [
            ...scene.choices.slice(0, choiceIndex),
            choice,
            ...scene.choices.slice(choiceIndex + 1),
          ],
        };
        this.updateScene(application.id, updatedScene);
        this.saveApplication(application);
      }
    }
  }

  setEditorContext(context: Scene | null) {
    this.editorContext = context;
  }

  get totalChoicesForCurrent() {
    const current = this.current;
    if (current) {
      return current.scenes.reduce(
        (total, scene) => total + scene.choices.length,
        0,
      );
    }
    return 0;
  }

  /**
   * Loops over all scenes in the current application and finds all choices that no longer have a target and removes
   * them.
   */
  cleanupDanglingChoices() {
    const current = this.current;
    if (current) {
      current.scenes.forEach(scene => {
        scene.choices.forEach(choice => {
          const foundTarget = current.scenes.find(s => s.id === choice.target);
          if (!foundTarget) {
            this.removeChoice(current.id, scene.id, choice.id);
          }
        });
      });
    }
  }

  /**
   * Updates the author information in the application
   * @param id
   * @param author
   */
  updateAuthor(id: string, author: ApplicationAuthor) {
    const application = this.getApplication(id);
    if (application) {
      application.author = author;
      this.saveApplication(application);
    }
  }

  /**
   * Updates the entrypoint in the application, which is effectively the first page a player will land on.
   * @param id
   * @param sceneId
   */
  updateEntrypoint(id: string, sceneId: string) {
    const application = this.getApplication(id);
    if (application) {
      application.entrypoint = sceneId;
      this.saveApplication(application);
    }
  }

  updateThemeFont(id: string, fontStyle: FontStyles | null) {
    const application = this.getApplication(id);
    if (application) {
      if (!application.theming) {
        application.theming = {};
      }
      application.theming.fontStyle = fontStyle ?? undefined;
      this.saveApplication(application);
      setDocumentFontFamily(fontStyle ?? FontStyles.SERIF);
    }
  }

  updateThemeElementsColor(id: string, color: string) {
    const application = this.getApplication(id);
    if (application) {
      if (!application.theming) {
        application.theming = {};
      }
      application.theming.elementsColor = color ?? undefined;
      this.saveApplication(application);
      generateColourScale(color ?? '#b99470', 'elements');
    }
  }

  updateThemeBackgroundColor(id: string, color: string) {
    const application = this.getApplication(id);
    if (application) {
      if (!application.theming) {
        application.theming = {};
      }
      application.theming.backgroundColor = color ?? undefined;
      this.saveApplication(application);
      setDocumentProperty('colour-background', color ?? '#858f64');
    }
  }

  updateThemeTextColor(id: string, color: string) {
    const application = this.getApplication(id);
    if (application) {
      if (!application.theming) {
        application.theming = {};
      }
      application.theming.textColor = color ?? undefined;
      this.saveApplication(application);
      setDocumentProperty('colour-text', color ?? '#070708');
    }
  }

  addVariable(id: string, variable: ApplicationVariable) {
    const application = this.getApplication(id);
    if (application) {
      application.variables.push(variable);
      this.saveApplication(application);
    }
  }

  editVariable(id: string, variable: ApplicationVariable) {
    const application = this.getApplication(id);
    if (application) {
      const variableIndex = application.variables.findIndex(
        v => v.id === variable.id,
      );
      if (variableIndex > -1) {
        application.variables = [
          ...application.variables.slice(0, variableIndex),
          variable,
          ...application.variables.slice(variableIndex + 1),
        ];
        this.saveApplication(application);
      }
    }
  }

  deleteVariable(id: string, variableId: string) {
    const application = this.getApplication(id);
    if (application) {
      const variableIndex = application.variables.findIndex(
        v => v.id === variableId,
      );
      if (variableIndex > -1) {
        application.variables = [
          ...application.variables.slice(0, variableIndex),
          ...application.variables.slice(variableIndex + 1),
        ];
      }
      this.saveApplication(application);
    }
  }

  addChoiceCondition(
    id: string,
    sceneId: string,
    choiceId: string,
    condition: Condition,
  ) {
    const application = this.getApplication(id);
    if (application) {
      const choice = this.getChoice(id, choiceId);
      if (choice) {
        const conditions = choice.conditions ?? [];
        conditions.push(condition);
        const updatedChoice: Choice = {
          ...choice,
          conditions: [...conditions],
        };
        this.updateChoice(id, sceneId, updatedChoice);
      }
    }
  }

  removeCondition(
    id: string,
    sceneId: string,
    choiceId: string,
    conditionId: string,
  ) {
    const application = this.getApplication(id);
    if (application) {
      const choice = this.getChoice(id, choiceId);
      if (choice && choice.conditions) {
        const conditionIndex = choice.conditions.findIndex(
          c => c.id === conditionId,
        );
        if (conditionIndex > -1) {
          const updatedChoice = {
            ...choice,
            conditions: [
              ...choice.conditions.slice(0, conditionIndex),
              ...choice.conditions.slice(conditionIndex + 1),
            ],
          };
          this.updateChoice(id, sceneId, updatedChoice);
        }
      }
    }
  }

  addChoiceTrigger(
    id: string,
    sceneId: string,
    choiceId: string,
    trigger: Trigger,
  ) {
    const application = this.getApplication(id);
    if (application) {
      const choice = this.getChoice(id, choiceId);
      if (choice) {
        const triggers = choice.triggers ?? [];
        triggers.push(trigger);
        const updatedChoice: Choice = {
          ...choice,
          triggers: [...triggers],
        };
        this.updateChoice(id, sceneId, updatedChoice);
      }
    }
  }

  removeTrigger(
    id: string,
    sceneId: string,
    choiceId: string,
    triggerId: string,
  ) {
    const application = this.getApplication(id);
    if (application) {
      const choice = this.getChoice(id, choiceId);
      if (choice && choice.triggers) {
        const triggerIndex = choice.triggers.findIndex(c => c.id === triggerId);
        if (triggerIndex > -1) {
          const updatedChoice = {
            ...choice,
            triggers: [
              ...choice.triggers.slice(0, triggerIndex),
              ...choice.triggers.slice(triggerIndex + 1),
            ],
          };
          this.updateChoice(id, sceneId, updatedChoice);
        }
      }
    }
  }

  /**
   * Looks for all nodes that might be custom images with the same image id.
   * We use this to show the user if an image is being used in the
   * application.
   * @param id
   * @param imageId
   */
  calculateImageUsage(id: string, imageId: string) {
    const application = this.getApplication(id);
    let usages = 0;
    if (!application) {
      return usages;
    }
    application.scenes.forEach(scene => {
      scene.frames.forEach(frame => {
        frame.nodes.content?.forEach(content => {
          if (content.type === 'customImage' && content.attrs?.id === imageId) {
            usages += 1;
          }
        });
      });
    });
    return usages;
  }

  scrubImageFromContent(id: string, imageId: string) {
    const application = this.getApplication(id);
    if (!application) {
      return;
    }
    application.scenes.forEach(scene => {
      scene.frames.forEach(frame => {
        const content = frame.nodes.content?.filter(content => {
          return (
            content.type === 'customImage' && content.attrs?.id !== imageId
          );
        });
        console.log({
          ...frame,
          nodes: { ...frame.nodes, content },
        });
        this.updateFrame(id, {
          ...frame,
          nodes: { ...frame.nodes, content },
        });
      });
    });
  }
}

const singleton = new ApplicationStore();
export default singleton;
