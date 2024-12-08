import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { AppContext } from "../../../stores/AppContext.ts";
import { Scene } from "../../organisms/Scene/Scene.tsx";

export const SceneRenderer = observer(() => {
  const { PlayerStore, ApplicationStore } = useContext(AppContext);

  const position = PlayerStore.state?.position;
  //console.log(position);

  if (!position) {
    return null;
  }

  const scene = ApplicationStore.getScene(position);

  if (!scene) {
    throw new Error(`Scene not found ${position}`);
  }

  //console.log("Current scene", toJS(scene));

  return <Scene scene={scene} />;
});
