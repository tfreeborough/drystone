import {observer} from "mobx-react-lite";
import {v4} from 'uuid';
import {generateText} from "@tiptap/react";
import {Reorder} from "framer-motion"
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import HardBreak from '@tiptap/extension-hard-break'
import HeadingNode from '@tiptap/extension-heading'
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item'

import {Choice as ChoiceType, Frame, Scene} from "../../../types/application.types.ts";
import TextInput from "../../atoms/TextInput/TextInput.tsx";

import css from './SceneEditor.module.scss';
import Heading from "../../atoms/Heading/Heading.tsx";
import Flex from "../../atoms/Flex/Flex.tsx";
import {FlexAlign, FlexDirection, FlexGap} from "../../atoms/Flex/Flex.types.ts";
import Muted from "../../atoms/Muted/Muted.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Button from "../../atoms/Button/Button.tsx";
import Choice from "../../atoms/Choice/Choice.tsx";
import {useContext} from "react";
import {AppContext} from "../../../stores/AppContext.ts";

interface SceneEditorProps {
  scene: Scene,
  onUpdate: (scene: Scene) => void,
  onSelectFrame: (frame: Frame) => void,
}

function SceneEditor({ scene, onUpdate, onSelectFrame }: SceneEditorProps){
  const { ApplicationStore } = useContext(AppContext);

  function handleUpdateNote(value: string){
    onUpdate({
      ...scene,
      metadata: {
        ...scene.metadata,
        note: value,
      }
    })
  }

  function handleUpdateFrameOrder(frames: Frame[]){
    onUpdate({
      ...scene,
      frames,
    })
  }

  function handleSelectFrame(frame: Frame){
    onSelectFrame(frame);
  }

  function handleSelectChoice(choice: ChoiceType){
    const currentApplication = ApplicationStore.current;
    if(currentApplication){
      const scene = ApplicationStore.getScene(currentApplication.id, choice.target);
      if(scene){
        ApplicationStore.setEditorContext(scene);
      }
    }

  }

  function handleNewFrame(){
    onUpdate({
      ...scene,
      frames: [
        ...scene.frames,
        {
          id: v4(),
          type: 'frame',
          nodes: {
            content: [],
            type: "doc"
          },
        }
      ],
    })
  }

  return (
    <div className={css.sceneEditor}>
      <Heading>Scene Editor</Heading>
      <hr />
      <TextInput value={scene.metadata?.note ?? ""} onChange={handleUpdateNote} label="Note" fullWidth />
      <hr />
      <Heading>Frames</Heading>
      <div className={css.frames}>
        <Reorder.Group axis="y" values={scene.frames} onReorder={handleUpdateFrameOrder}>
          <Flex flexDirection={FlexDirection.COLUMN} gap={FlexGap.SM} alignItems={FlexAlign.STRETCH}>
            {
              scene.frames.map((frame, i) => {
                return (
                  <Reorder.Item className={css.frame} key={frame.id} value={frame} onClick={() => handleSelectFrame(frame)}>
                    <Muted>Frame {i+1}</Muted>
                    <div>
                      { frame.nodes && generateText(frame.nodes,[  Document,
                        Paragraph,
                        HeadingNode,
                        BulletList,
                        ListItem,
                        Text,
                        HardBreak,]) }
                    </div>
                  </Reorder.Item>
                )
              })
            }
            <Button className={css.addFrame} onClick={handleNewFrame}>
              <FontAwesomeIcon icon="plus" />
              <span>Add a new frame</span>
            </Button>
          </Flex>
        </Reorder.Group>
      </div>
      <hr />
      <div>
        {
          scene.choices.length === 0 && (
            <Heading>This scene is currently an "Ending" as it has no choices</Heading>
          )
        }
        {
          scene.choices.length > 0 && (
            <>
              <Heading>Choices</Heading>
              <Flex className={css.choices} flexDirection={FlexDirection.COLUMN}>

                {
                  scene.choices.map((choice) => {
                    return (
                      <Choice key={choice.id} onSelect={handleSelectChoice} choice={choice} />
                    )
                  })
                }
              </Flex>
            </>
          )
        }
      </div>
    </div>
  )
}

export default observer(SceneEditor);
