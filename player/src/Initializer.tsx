import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "./stores/AppContext.ts";
import ApplicationLoader from "./components/organisms/ApplicationLoader/ApplicationLoader.tsx";
import Player from "./components/organisms/Player/Player.tsx";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import RemoteLoader from "./components/organisms/RemoteLoader/RemoteLoader.tsx";

library.add(fas as any, fab as any, far as any);

function Initializer() {
  const { ApplicationStore } = useContext(AppContext);
  const [remote, setRemote] = useState<string | null>(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(queryParams.entries());
    if (params.remote) {
      setRemote(params.remote);
    }
  }, []);

  return (
    <>
      {ApplicationStore.application !== null ? (
        <Player application={ApplicationStore.application} />
      ) : (
        <>{remote ? <RemoteLoader remote={remote} /> : <ApplicationLoader />}</>
      )}
    </>
  );
}

export default observer(Initializer);
