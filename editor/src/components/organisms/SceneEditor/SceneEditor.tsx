import { observer } from 'mobx-react-lite';
import { v4 } from 'uuid';
import { Reorder } from 'framer-motion';

import {
  Align,
  Choice as ChoiceType,
  FlexDirection,
  Frame,
  Gap,
  Justify,
  Scene,
} from '@shared/types';
import TextInput from '../../atoms/TextInput/TextInput.tsx';

import css from './SceneEditor.module.scss';
import Heading from '../../atoms/Heading/Heading.tsx';
import Muted from '../../atoms/Muted/Muted.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Choice from '../../atoms/Choice/Choice.tsx';
import { useContext } from 'react';
import { AppContext } from '../../../stores/AppContext.ts';
import { Button, Tiptap2React, Flex, DeleteIcon } from '@shared/components';

interface SceneEditorProps {
  scene: Scene;
  onUpdate: (scene: Scene) => void;
  onSelectFrame: (frame: Frame) => void;
}

function SceneEditor({ scene, onUpdate, onSelectFrame }: SceneEditorProps) {
  const { ApplicationStore } = useContext(AppContext);

  function handleUpdateNote(value: string) {
    onUpdate({
      ...scene,
      metadata: {
        ...scene.metadata,
        note: value,
      },
    });
  }

  function handleUpdateFrameOrder(frames: Frame[]) {
    onUpdate({
      ...scene,
      frames,
    });
  }

  function handleSelectFrame(frame: Frame) {
    onSelectFrame(frame);
  }

  function handleSelectChoice(choice: ChoiceType) {
    const currentApplication = ApplicationStore.current;
    if (currentApplication) {
      const scene = ApplicationStore.getScene(
        currentApplication.id,
        choice.target,
      );
      if (scene) {
        ApplicationStore.setEditorContext(scene);
      }
    }
  }

  function handleNewFrame() {
    onUpdate({
      ...scene,
      frames: [
        ...scene.frames,
        {
          id: v4(),
          type: 'frame',
          nodes: {
            content: [],
            type: 'doc',
          },
        },
      ],
    });
  }

  function handleDeleteFrame(frameId: string) {
    const frameIndex = scene.frames.findIndex(frame => frame.id === frameId);
    console.log(frameIndex);
    if (frameIndex > -1) {
      onUpdate({
        ...scene,
        frames: [
          ...scene.frames.slice(0, frameIndex),
          ...scene.frames.slice(frameIndex + 1),
        ],
      });
    }
  }

  return (
    <div className={css.sceneEditor}>
      <Heading>Scene Editor</Heading>
      <hr />
      <TextInput
        value={scene.metadata?.note ?? ''}
        onChange={handleUpdateNote}
        label="Note"
        fullWidth
      />
      <hr />
      <Heading>Frames</Heading>
      <div className={css.frames}>
        <Reorder.Group
          axis="y"
          values={scene.frames}
          onReorder={handleUpdateFrameOrder}
        >
          <Flex
            flexDirection={FlexDirection.COLUMN}
            gap={Gap.SM}
            alignItems={Align.STRETCH}
          >
            {scene.frames.map((frame, i) => {
              return (
                <Reorder.Item
                  className={css.frame}
                  key={frame.id}
                  value={frame}
                >
                  <Flex justifyContent={Justify.SPACE_BETWEEN}>
                    <Muted>Frame {i + 1}</Muted>
                    <DeleteIcon onClick={() => handleDeleteFrame(frame.id)} />
                  </Flex>

                  <div
                    className={css.nodes}
                    onClick={() => handleSelectFrame(frame)}
                  >
                    {frame.nodes && (
                      <Tiptap2React nodes={frame.nodes} fadeDelay={0.1} />
                    )}
                    <div className={css.whiteFade}></div>
                  </div>
                </Reorder.Item>
              );
            })}
            <Button className={css.addFrame} onClick={handleNewFrame}>
              <FontAwesomeIcon icon="plus" />
              <span>Add a new frame</span>
            </Button>
          </Flex>
        </Reorder.Group>
      </div>
      <hr />
      <div>
        {scene.choices.length === 0 && (
          <Heading>
            This scene is currently an "Ending" as it has no choices
          </Heading>
        )}
        {scene.choices.length > 0 && (
          <>
            <Heading>Choices</Heading>
            <Flex className={css.choices} flexDirection={FlexDirection.COLUMN}>
              {scene.choices.map(choice => {
                return (
                  <Choice
                    key={choice.id}
                    onSelect={handleSelectChoice}
                    choice={choice}
                  />
                );
              })}
            </Flex>
          </>
        )}
      </div>
    </div>
  );
}

export default observer(SceneEditor);
