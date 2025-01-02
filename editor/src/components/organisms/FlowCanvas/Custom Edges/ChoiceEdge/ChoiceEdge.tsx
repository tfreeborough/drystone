import { type FC, useContext } from 'react';
import {
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
  type EdgeProps,
  type Edge,
} from '@xyflow/react';
import css from './ChoiceEdge.module.scss';
import { AppContext } from '../../../../../stores/AppContext.ts';
import { observer } from 'mobx-react-lite';
import { DeleteIcon } from '@shared/components';

export const ChoiceEdge: FC<
  EdgeProps<Edge<{ label: string; scene: string; application: string }>>
> = observer(
  ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    label,
    data,
  }) => {
    const { ApplicationStore } = useContext(AppContext);

    const [edgePath, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });

    function handleDeleteChoice(
      evt: React.MouseEvent<HTMLDivElement>,
      id: string,
    ) {
      evt.stopPropagation();
      if (data) {
        ApplicationStore.removeChoice(data.application, data.scene, id);
      }
    }

    return (
      <>
        <BaseEdge id={id} path={edgePath} style={{ strokeWidth: 3 }} />
        <EdgeLabelRenderer>
          <div
            className={css.choiceEdge}
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            }}
          >
            {label}
            <DeleteIcon
              className={css.delete}
              onClick={(evt: any) => handleDeleteChoice(evt, id)}
            />
          </div>
        </EdgeLabelRenderer>
      </>
    );
  },
);
