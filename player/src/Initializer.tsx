import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { AppContext } from "./stores/AppContext.ts";
import ApplicationLoader from "./components/organisms/ApplicationLoader/ApplicationLoader.tsx";
import Player from "./components/organisms/Player/Player.tsx";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

library.add(fas as any, fab as any, far as any);

function Initializer() {
  const { ApplicationStore } = useContext(AppContext);

  return (
    <>
      {ApplicationStore.application !== null ? (
        <Player application={ApplicationStore.application} />
      ) : (
        <ApplicationLoader />
      )}
    </>
  );
}

export default observer(Initializer);
