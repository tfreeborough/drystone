import {Application} from 'drystone';
import Flex from "../../atoms/Flex/Flex.tsx";
import css from './Splash.module.scss';
import {FlexAlign, FlexDirection, FlexGap, FlexJustify} from "../../atoms/Flex/Flex.types.ts";
import {Container, Paragraph} from 'react-effect-typewriter';
import {useState} from "react";
import FadeIn from "../../animations/FadeIn/FadeIn.tsx";
import Button from "../../atoms/Button/Button.tsx";

interface SplashProps {
  application: Application,
}

function Splash({ application }: SplashProps){
  const [showButton, setShowButton] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [showAuthor, setShowAuthor] = useState(false);

  function handleFinishType(){
    setShowButton(true);
  }

  function handleShowAuthor(){
    setShowAuthor(true);
  }

  function handleStart(){

  }

  return (
    <Flex className={css.splash} flexDirection={FlexDirection.COLUMN} gap={FlexGap.LG} alignItems={FlexAlign.CENTER}>
      <div className={css.blurb}>
        <FadeIn onComplete={() => setShowDescription(true)} duration={3}>
          <h1>{application.name}</h1>
        </FadeIn>
        {
          showDescription && (
            <FadeIn duration={4}>
              <div className={css.description}>
                <Container>
                  <Paragraph typingSpeed={40} onEnd={handleFinishType}>{application.description}</Paragraph>
                </Container>
              </div>
            </FadeIn>
          )
        }
        {
          showButton && (
            <FadeIn duration={3} delay={2} onComplete={handleShowAuthor}>
              <Button onClick={handleStart}>Begin</Button>
            </FadeIn>
          )
        }
      </div>
      {
        showAuthor && (
          <FadeIn className={css.author} duration={2}>
            <span>Created by</span>&nbsp;
            <a href={application.author.link} target="_blank">{ application.author.name }</a>
          </FadeIn>
        )
      }
    </Flex>
  )
}

export default Splash;
