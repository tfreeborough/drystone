import {makeAutoObservable} from "mobx";
import {makePersistable} from "mobx-persist-store";

class DrystoneStore {
  public test = 'foo';
  constructor() {
    makeAutoObservable(this);

    makePersistable(
      this,
      {
        name: 'DrystoneStore',
        properties: ['test'],
        storage: window.localStorage,
        // expireIn: 86400000, // 1 day in MS
        removeOnExpiration: true,
      },
      { delay: 200, fireImmediately: false },
    );
  }

}

const singleton = new DrystoneStore();
export default singleton;

