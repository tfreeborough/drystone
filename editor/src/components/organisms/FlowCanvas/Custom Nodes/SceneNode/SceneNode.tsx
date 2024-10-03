import { useContext } from 'react';
import { Handle, Position } from '@xyflow/react';
import { observer } from 'mobx-react-lite';
import css from './SceneNode.module.scss';
import { Scene } from 'drystone';
import Muted from '../../../../atoms/Muted/Muted.tsx';
import { AppContext } from '../../../../../stores/AppContext.ts';

interface SceneNodePropsType {
  id: string;
  data: SceneDataType;
}
interface SceneDataType {
  label: string;
  scene: Scene;
}

function SceneNode({ data, id }: SceneNodePropsType) {
  const { ApplicationStore } = useContext(AppContext);

  const context = ApplicationStore.editorContext;
  const selected = context?.id === id;

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div className={`${css.sceneNode} ${selected ? css.selected : ''}`}>
        <div className={css.note}>{data.label}</div>
        <div className={css.metadata}>
          <Muted>{data.scene.frames.length} Pages</Muted>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </>
  );
}

export default observer(SceneNode);
