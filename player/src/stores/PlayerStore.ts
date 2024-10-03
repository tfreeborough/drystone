import {makeAutoObservable} from "mobx";
import {makePersistable} from "mobx-persist-store";
import { PlayerState } from 'drystone';

class PlayerStore {
  state: PlayerState | null = null;
  savedStates: PlayerState[] = [];

  constructor() {
    makeAutoObservable(this);

    makePersistable(
      this,
      {
        name: 'PlayerStore',
        properties: ['savedStates'],
        storage: window.localStorage,
        removeOnExpiration: true,
      },
      { delay: 200, fireImmediately: false },
    );
  }

  startGame(){
    if(this.state){
      this.state.started = true;
    }
  }

  initializeGameState(entrypoint: string){
    this.state = {
      started: false,
      position: entrypoint,
      history: [],
    }
  }

}

const singleton = new PlayerStore();
export default singleton;

