import {makeAutoObservable} from "mobx";
import {makePersistable} from "mobx-persist-store";
import {Application, Asset} from 'drystone';
import {blobToBase64} from "../utils/blobToBase64.ts";
import {base64toBlob} from "../utils/base64ToBlob.ts";

class ApplicationStore {
  application: Application | null = null;
  assets: Asset[] = [];

  constructor() {
    makeAutoObservable(this);

    makePersistable(
      this,
      {
        name: 'ApplicationStore',
        properties: [],
        storage: window.localStorage,
        removeOnExpiration: true,
      },
      { delay: 200, fireImmediately: false },
    );
  }

  public setApplication(app: Application | null){
    this.application = app;
  }

  public setAssets(assets: Asset[]){
    this.assets = assets;
  }

}

const singleton = new ApplicationStore();
export default singleton;

