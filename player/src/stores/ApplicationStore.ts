import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";
import { Application } from "@shared/types";

class ApplicationStore {
  application: Application | null = null;

  constructor() {
    makeAutoObservable(this);

    void makePersistable(
      this,
      {
        name: "ApplicationStore",
        properties: [
          {
            key: "application",
            serialize: (value) => JSON.stringify(value),
            deserialize: (value) => JSON.parse(value),
          },
        ],
        storage: window.localStorage,
        removeOnExpiration: true,
      },
      { delay: 200, fireImmediately: false },
    );
  }

  public setApplication(app: Application | null) {
    console.log("setting application", app);
    this.application = app;
  }

  public getScene(id: string) {
    if (!this.application) return null;
    const found = this.application.scenes.find((s) => s.id === id);
    return found ?? null;
  }
}

const singleton = new ApplicationStore();
export default singleton;
