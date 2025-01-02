import css from './SceneContextMenu.module.scss';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { AppContext } from '../../../stores/AppContext.ts';
import { Button, Flex } from '@shared/components';
import { Gap } from '@shared/types';

interface SceneContextMenuProps {
  id: string;
  top: number;
  left: number;
  onClose: () => void;
}

function SceneContextMenu({ top, left, onClose, id }: SceneContextMenuProps) {
  const { ApplicationStore } = useContext(AppContext);
  function handleDelete() {
    const currentApplication = ApplicationStore.current;
    if (currentApplication) {
      ApplicationStore.removeScene(currentApplication.id, id);
      onClose();
    }
  }

  return (
    <div
      className={css.sceneContextMenu}
      style={{
        top,
        left,
      }}
    >
      <Flex gap={Gap.SM}>
        <Button onClick={handleDelete}>Delete Scene</Button>
        <Button onClick={onClose}>Close</Button>
      </Flex>
    </div>
  );
}

export default observer(SceneContextMenu);
