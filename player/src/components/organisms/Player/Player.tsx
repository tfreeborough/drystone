import css from "./Player.module.scss";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Application } from "@shared/types";
import { AppContext } from "../../../stores/AppContext.ts";
import Splash from "../../molecules/Splash/Splash.tsx";
import Flex from "../../atoms/Flex/Flex.tsx";
import { FlexAlign, FlexJustify } from "../../atoms/Flex/Flex.types.ts";
import { SceneRenderer } from "../../molecules/SceneRenderer/SceneRenderer.tsx";

interface PlayerProps {
  application: Application;
}

function Player({ application }: PlayerProps) {
  const { PlayerStore } = useContext(AppContext);

  return (
    <Flex
      className={css.player}
      alignItems={FlexAlign.CENTER}
      justifyContent={FlexJustify.CENTER}
    >
      {PlayerStore.state?.started ? (
        <SceneRenderer />
      ) : (
        <Splash application={application} />
      )}
    </Flex>
  );
}

export default observer(Player);
