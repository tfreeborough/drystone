import css from "./SceneUnderConstruction.module.scss";
import { Button, Flex } from "@shared/components";
import { AppContext } from "../../../stores/AppContext.ts";
import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Align, FlexDirection, Gap } from "@shared/types";

export const SceneUnderConstruction = observer(() => {
  const { PlayerStore } = useContext(AppContext);

  function handleGoBack() {
    PlayerStore.goBackInHistory();
  }

  return (
    <Flex
      className={css.sceneUnderConstruction}
      flexDirection={FlexDirection.COLUMN}
      gap={Gap.MD}
      alignItems={Align.START}
    >
      <h1>🚧 Under Construction 🚧</h1>
      <p>
        Looks like you've made it to a part of this app that isn't quite
        finished off yet.
      </p>
      <Button onClick={handleGoBack}>Go back</Button>
    </Flex>
  );
});
