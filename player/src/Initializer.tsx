import { observer } from "mobx-react-lite";
import {useContext} from "react";
import {AppContext} from "./stores/AppContext.ts";
import ApplicationLoader from "./components/organisms/ApplicationLoader/ApplicationLoader.tsx";
import Player from "./components/organisms/Player/Player.tsx";

function Initializer() {
  const {
    ApplicationStore,
  } = useContext(AppContext);


  return (
    <>
      {
        ApplicationStore.application !== null
        ?
          <Player application={ApplicationStore.application} />
        :
          <ApplicationLoader />
      }
    </>
  )
}

export default observer(Initializer)
