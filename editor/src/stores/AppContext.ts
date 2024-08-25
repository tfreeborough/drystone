import DrystoneStore from "./DrystoneStore.ts";
import ApplicationStore from "./ApplicationStore.ts";
import React from "react";
export const AppContext = React.createContext({
  DrystoneStore,
  ApplicationStore,
})
