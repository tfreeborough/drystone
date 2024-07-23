import {makeAutoObservable} from "mobx";
import {makePersistable} from "mobx-persist-store";
import {Application} from "../types/application.types.ts";

class ApplicationStore {
  public current: Application | null = null;
  public applications: Application[] = [];
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

  setCurrentApplication(application: Application | null){
    this.current = application;
  }

  addApplication(application: Application) {
    this.applications.push(application);
  }

}

const singleton = new ApplicationStore();
export default singleton;

