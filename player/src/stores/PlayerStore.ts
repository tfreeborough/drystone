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
      history: [entrypoint],
    };
  }

  navigateToScene(sceneId: string) {
    if (this.state) {
      this.state.position = sceneId;
      this.state.history = [...this.state.history, sceneId];
    }
  }

  goBackInHistory(steps: number = 1) {
    if (this.state) {
      const newHistory = this.state.history.slice(0, -1 * steps);
      const lastElement = newHistory.at(-1);
      if (lastElement) {
        this.state.history = newHistory;
        this.state.position = lastElement;
      }
    }
  }
}

const singleton = new PlayerStore();
export default singleton;
