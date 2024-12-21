import css from "./Player.module.scss";
import { observer } from "mobx-react-lite";
import { useContext, useEffect } from "react";
import { Application } from "@shared/types";
import { AppContext } from "../../../stores/AppContext.ts";
import Splash from "../../molecules/Splash/Splash.tsx";
import { Flex, RenderingErrorBoundary } from "@shared/components";
import { Align, Justify } from "@shared/types";
import { SceneRenderer } from "../../molecules/SceneRenderer/SceneRenderer.tsx";
import { ErrorBoundary } from "react-error-boundary";
import { useTitle } from "@shared/hooks";

interface PlayerProps {
  application: Application;
}

function Player({ application }: PlayerProps) {
  const { PlayerStore } = useContext(AppContext);
  const { setTitle } = useTitle();

  function handleFatalError(error: Error) {
    console.log(error);
    // logCustomEvent('application:fatal-error', { error: error.message });
  }

  useEffect(() => {
    setTitle(application.name);
  }, []);

  return (
    <Flex
      className={css.player}
      alignItems={Align.CENTER}
      justifyContent={Justify.CENTER}
    >
      {PlayerStore.state?.started ? (
        <ErrorBoundary
          fallbackRender={RenderingErrorBoundary}
          onError={handleFatalError}
        >
          <SceneRenderer />
        </ErrorBoundary>
      ) : (
        <Splash application={application} />
      )}
    </Flex>
  );
}

export default observer(Player);
