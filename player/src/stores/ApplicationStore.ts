import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";
import { Application, Asset } from "@shared/types";

class ApplicationStore {
  application: Application | null = null;
  assets: Asset[] = [];

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
    this.application = app;
  }

  public setAssets(assets: Asset[]) {
    this.assets = assets;
  }
}

const singleton = new ApplicationStore();
export default singleton;
