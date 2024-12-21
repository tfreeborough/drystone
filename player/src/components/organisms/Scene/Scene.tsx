import {
  Choice,
  FlexDirection,
  Frame,
  Gap,
  Scene as SceneType,
} from "@shared/types";
import { useContext, useEffect, useState, Fragment } from "react";
import css from "./Scene.module.scss";
import { Flex, Tiptap2React } from "@shared/components";
import { ChoicesRender } from "@shared/components/ChoicesRender/ChoicesRender.tsx";
import { FadeIn } from "@shared/animations";
import { observer } from "mobx-react-lite";
import { AppContext } from "../../../stores/AppContext.ts";
import { AnimatePresence } from "framer-motion";
import { SceneUnderConstruction } from "../../molecules/SceneUnderConstruction/SceneUnderConstruction.tsx";
import { ApplicationEnding } from "../../molecules/ApplicationEnding/ApplicationEnding.tsx";

interface SceneProps {
  scene: SceneType;
}

export const Scene = observer(({ scene }: SceneProps) => {
  const { PlayerStore } = useContext(AppContext);
  const [renderedFrames, setRenderedFrames] = useState<Frame[]>([]);
  const [animationsCompleted, setAnimationsCompleted] = useState(false);
  const [noFrames, setNoFrames] = useState(false);

  function resetState() {
    setRenderedFrames([]);
    setNoFrames(false);
    setAnimationsCompleted(false);
  }

  /**
   * When the component mounts, attempt to get the first frame and set it. If there is no first frame, this is
   * a problem caused by the person who made the application and we need to show a special component, this will
   * likely allow the user to go back to the previous scene so it doesn't break their session.
   */
  useEffect(() => {
    resetState();

    const firstFrame = scene.frames[0];
    if (!firstFrame) {
      setNoFrames(true);
      return;
    }

    setRenderedFrames([firstFrame]);
  }, [scene.id]);

  /**
   * Adds a frame to the rendered frames, this will cause the new frame to be rendered into the screen.
   * @param frame
   */
  function addRenderedFrame(frame: Frame) {
    setRenderedFrames([...renderedFrames, frame]);
  }

  function resetAnimationsCompleted() {
    setAnimationsCompleted(false);
  }

  function handleNextFrame() {
    if (renderedFrames) {
      const latestFrame = renderedFrames[renderedFrames.length - 1];
      const currentIndex = scene.frames.findIndex(
        (f) => f.id === latestFrame.id,
      );
      if (currentIndex > -1) {
        const nextFrame = scene.frames[currentIndex + 1];
        if (nextFrame) {
          addRenderedFrame(nextFrame);
          resetAnimationsCompleted();
        }
      }
    }
  }

  function handleSelectChoice(choice: Choice) {
    PlayerStore.navigateToScene(choice.target);
  }

  function handleAnimationCompleted() {
    setAnimationsCompleted(true);
  }

  if (noFrames) {
    return <SceneUnderConstruction />;
  }

  if (renderedFrames.length === 0) {
    return null;
  }

  const isLastFrame = renderedFrames.length === scene.frames.length;
  const isEnd = scene.choices.length === 0;

  return (
    <div className={css.scene}>
      <AnimatePresence mode="wait">
        <FadeIn key={scene.id} duration={0.6} hasExitAnimation>
          <Flex flexDirection={FlexDirection.COLUMN} gap={Gap.MD}>
            {renderedFrames.map((frame) => (
              <Fragment key={frame.id}>
                <Tiptap2React
                  nodes={frame.nodes}
                  onAnimationComplete={handleAnimationCompleted}
                />
              </Fragment>
            ))}
            {animationsCompleted && (
              <>
                <FadeIn duration={2}>
                  {isLastFrame ? (
                    <ChoicesRender
                      choices={scene.choices}
                      onSelectChoice={handleSelectChoice}
                    />
                  ) : (
                    <span className={css.next} onClick={handleNextFrame}>
                      Next
                    </span>
                  )}
                </FadeIn>
              </>
            )}
            {isEnd && <ApplicationEnding />}
          </Flex>
        </FadeIn>
      </AnimatePresence>
    </div>
  );
});
