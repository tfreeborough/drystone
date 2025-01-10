import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";
import { Application, FontStyles } from "@shared/types";
import {
  generateColourScale,
  setDocumentFontFamily,
  setDocumentProperty,
} from "@shared/functions";

class ApplicationStore {
  application: Application | null = null;

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
}

const singleton = new ApplicationStore();
export default singleton;
