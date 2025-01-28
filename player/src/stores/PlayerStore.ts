import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";
import { SerializableProperty } from "mobx-persist-store/lib/esm2017/serializableProperty";
import {
  ApplicationVariable,
  ApplicationVariableVisibility,
  PlayerState,
  Trigger,
} from "@shared/types";
import { modifyVariableWithTrigger } from "@shared/functions";

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

  initializeGameState(
    entrypoint: string,
    variables: ApplicationVariable[] = [],
  ) {
    this.state = {
      started: false,
      position: entrypoint,
      history: [entrypoint],
      variables,
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

  public getVariable(id: string) {
    if (!this.state) return null;
    const found = this.state.variables.find((s) => s.id === id);
    return found ?? null;
  }

  public getPublicVariables() {
    if (!this.state) return [];
    return this.state.variables.filter(
      (v) => v.visibility === ApplicationVariableVisibility.PUBLIC,
    );
  }

  public getPrivateVariables() {
    if (!this.state) return [];
    return this.state.variables.filter(
      (v) => v.visibility === ApplicationVariableVisibility.PRIVATE,
    );
  }

  public setVariable(id: string, value: string | boolean | number) {
    if (!this.state) return;
    const index = this.state.variables.findIndex((s) => s.id === id);
    if (index > -1) {
      this.state.variables = [
        ...this.state.variables.slice(0, index),
        { ...this.state.variables[index], value },
        ...this.state.variables.slice(index + 1),
      ];
    }
    return;
  }

  public applyTriggers(triggers: Trigger[]) {
    if (!this.state) return;
    triggers.forEach((trigger) => {
      let variable = this.getVariable(trigger.variableId);
      if (!variable) {
        console.warn(
          `Attempted to apply trigger to non-existant variable ${trigger.variableId}`,
        );
        return;
      }
      variable = modifyVariableWithTrigger(variable, trigger);
      this.setVariable(variable.id, variable.value);
    });
  }

  public resetAllVariables() {}
}

const singleton = new PlayerStore();
export default singleton;
