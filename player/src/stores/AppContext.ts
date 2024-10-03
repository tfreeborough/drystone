import ApplicationStore from "./ApplicationStore.ts";
import PlayerStore from "./PlayerStore.ts";
import React from "react";
export const AppContext = React.createContext({
  ApplicationStore,
  PlayerStore,
})
