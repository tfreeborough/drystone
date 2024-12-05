import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";
import { SerializableProperty } from "mobx-persist-store/lib/esm2017/serializableProperty";
import { PlayerState } from "@shared/types";

class PlayerStore {
  state: PlayerState | null = null;
  savedStates: PlayerState[] = [];

  constructor() {
    makeAutoObservable(this);

    void makePersistable(
      this,
      {
        name: "PlayerStore",
        properties: [
          {
            key: "savedStates",
            serialize: (value) => value,
            deserialize: (value) => value,
          },
          {
            key: "state",
            serialize: (value) => JSON.stringify(value),
            deserialize: (value) => JSON.parse(value),
          },
        ] satisfies SerializableProperty<PlayerStore, keyof PlayerStore>[],
        storage: window.localStorage,
        removeOnExpiration: true,
      },
      { delay: 200, fireImmediately: false },
    );
  }

  startGame() {
    if (this.state) {
      this.state.started = true;
    }
  }

  initializeGameState(entrypoint: string) {
    this.state = {
      started: false,
      position: entrypoint,
      history: [],
    };
  }
}

const singleton = new PlayerStore();
export default singleton;
