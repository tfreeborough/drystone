import css from "./ApplicationEnding.module.scss";
import { FadeIn } from "@shared/animations";
import { Button, Flex } from "@shared/components";
import { Align, FlexDirection, Gap } from "@shared/types";
import { useContext } from "react";
import { AppContext } from "../../../stores/AppContext.ts";
import { observer } from "mobx-react-lite";

export const ApplicationEnding = observer(() => {
  const { PlayerStore, ApplicationStore } = useContext(AppContext);

  const application = ApplicationStore.application;

  function handleResetApplication() {
    if (application) {
      PlayerStore.initializeGameState(
        application.entrypoint,
        application.variables,
      );
    }
  }

  if (!application) {
    return null;
  }

  return (
    <FadeIn className={css.applicationEnding} delay={2}>
      <Flex
        flexDirection={FlexDirection.COLUMN}
        gap={Gap.MD}
        alignItems={Align.START}
      >
        <h3 className={css.heading}>The End</h3>
        <Button onClick={handleResetApplication}>Restart</Button>
      </Flex>
    </FadeIn>
  );
});
