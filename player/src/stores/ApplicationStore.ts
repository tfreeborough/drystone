import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";
import { Application, FontStyles } from "@shared/types";
import { setDocumentFontFamily } from "@shared/functions";

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
  }

  public getScene(id: string) {
    if (!this.application) return null;
    const found = this.application.scenes.find((s) => s.id === id);
    return found ?? null;
  }
}

const singleton = new ApplicationStore();
export default singleton;
