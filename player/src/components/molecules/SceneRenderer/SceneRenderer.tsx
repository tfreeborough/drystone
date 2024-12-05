import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { AppContext } from "../../../stores/AppContext.ts";

export const SceneRenderer = observer(() => {
  const { PlayerStore, ApplicationStore } = useContext(AppContext);

  const position = PlayerStore.state?.position;
  console.log(position);

  if (!position) {
    return null;
  }

  const scene = ApplicationStore.getScene(position);

  if (scene) {
    throw new Error(`Scene not found ${position}`);
  }

  return <></>;
});
