import css from "./Splash.module.scss";
import { Container, Paragraph } from "react-effect-typewriter";
import { useContext, useState } from "react";
import { FadeIn } from "@shared/animations";
import { AppContext } from "../../../stores/AppContext.ts";
import { Align, Application, FlexDirection, Gap } from "@shared/types";
import { Flex, Button } from "@shared/components";

interface SplashProps {
  application: Application;
}

function Splash({ application }: SplashProps) {
  const [showButton, setShowButton] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [showAuthor, setShowAuthor] = useState(false);

  const { PlayerStore } = useContext(AppContext);

  function handleFinishType() {
    setShowButton(true);
    setShowAuthor(true);
  }

  function handleStart() {
    PlayerStore.startGame();
  }

  return (
    <Flex
      className={css.splash}
      flexDirection={FlexDirection.COLUMN}
      gap={Gap.LG}
      alignItems={Align.CENTER}
    >
      <Flex
        className={css.blurb}
        flexDirection={FlexDirection.COLUMN}
        gap={Gap.MD}
      >
        <FadeIn
          onAnimationComplete={() => setShowDescription(true)}
          duration={2}
        >
          <h1>{application.name}</h1>
        </FadeIn>
        {showDescription && (
          <FadeIn duration={1}>
            <div className={css.description}>
              <Container>
                <Paragraph typingSpeed={10} onEnd={handleFinishType}>
                  {application.description}
                </Paragraph>
              </Container>
            </div>
          </FadeIn>
        )}
        {showButton && (
          <FadeIn duration={1} delay={1}>
            <Button onClick={handleStart}>Begin</Button>
          </FadeIn>
        )}
      </Flex>
      {showAuthor && application.author.name.length > 0 && (
        <FadeIn className={css.author} duration={3} delay={2}>
          <span>Created by</span>&nbsp;
          {application.author.link.length > 0 ? (
            <a href={application.author.link} target="_blank">
              {application.author.name}
            </a>
          ) : (
            <>{application.author.name}</>
          )}
        </FadeIn>
      )}
    </Flex>
  );
}

export default Splash;
