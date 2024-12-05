import { Frame, Scene as SceneType } from "@shared/types";
import { useEffect, useState } from "react";
import css from "./Scene.module.scss";
import { Tiptap2React } from "@shared/components";

interface SceneProps {
  scene: SceneType;
}

export function Scene({ scene }: SceneProps) {
  const [frame, setFrame] = useState<Frame | null>(null);

  useEffect(() => {
    const firstFrame = scene.frames[0];
    if (!firstFrame) {
      throw new Error(`Scene ${scene.id} does not contain any frames`);
    }
    setFrame(firstFrame);
  }, [scene]);

  if (!frame) {
    return null;
  }

  return (
    <div className={css.scene}>
      <Tiptap2React nodes={frame.nodes} />
    </div>
  );
}
