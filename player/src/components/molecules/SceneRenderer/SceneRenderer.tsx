import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { AppContext } from "../../../stores/AppContext.ts";

export const SceneRenderer = observer(() => {
  const { PlayerStore } = useContext(AppContext);

  const position = PlayerStore.state?.position;
  console.log(position);
  if (!position) {
    return null;
  }

  return <>Scene Renderer</>;
});
