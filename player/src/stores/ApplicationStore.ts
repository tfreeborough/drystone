import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";
import { Application, Asset, FontStyles } from "@shared/types";
import {
  generateColourScale,
  setDocumentFontFamily,
  setDocumentProperty,
} from "@shared/functions";

class ApplicationStore {
  application: Application | null = null;
  assets: Map<string, Asset> = new Map();
  packed: boolean = true;
  remote: string | null = null;

  constructor() {
    makeAutoObservable(this);

    void makePersistable(
      this,
      {
        name: "ApplicationStore",
        properties: [],
        storage: window.localStorage,
        removeOnExpiration: true,
      },
      { delay: 200, fireImmediately: false },
    );
  }

  public setApplication(app: Application | null) {
    this.application = app;
    setDocumentFontFamily(app?.theming?.fontStyle ?? FontStyles.SERIF);
    generateColourScale(app?.theming?.elementsColor ?? "#858f64", "elements");
    setDocumentProperty(
      "colour-background",
      app?.theming?.backgroundColor ?? "#f8f4f1",
    );
    setDocumentProperty("colour-text", app?.theming?.textColor ?? "#070708");
  }

  public getScene(id: string) {
    if (!this.application) return null;
    const found = this.application.scenes.find((s) => s.id === id);
    return found ?? null;
  }

  public addAsset(asset: Asset) {
    this.assets.set(asset.id, asset);
  }

  public removeAsset(asset: Asset) {
    this.assets.delete(asset.id);
  }

  /**
   * This setting is used to determine how the application should be loaded, if it is packed it will be pull down as a
   * single zip file and loaded into memory, if it is set to false then we'll try to stream information like you'd
   * use a file link in the browser. This can be used for applications that are very large and thus could use
   * quite a lot of memory if packed.
   * @param packed
   */
  public setPacked(packed: boolean) {
    this.packed = packed;
  }

  public setRemote(remote: string | null) {
    this.remote = remote;
  }
}

const singleton = new ApplicationStore();
export default singleton;
