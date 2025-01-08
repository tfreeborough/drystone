import { type FC, useContext } from 'react';
import {
  EdgeLabelRenderer,
  BaseEdge,
  type EdgeProps,
  type Edge,
  getSmoothStepPath,
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

    const offset = Math.min(Math.abs(targetX - sourceX) * 0.2, 65);

    const [edgePath] = getSmoothStepPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      borderRadius: 16,
      offset,
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
        <defs>
          <linearGradient
            id={`gradient-${id}`}
            gradientUnits="userSpaceOnUse"
            x1={sourceX}
            y1={sourceY}
            x2={targetX}
            y2={targetY}
          >
            <stop offset="0%" stopColor="#4a90e2" />
            <stop offset="100%" stopColor="#858f64" />
          </linearGradient>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="10"
            refY="5"
            markerWidth="4"
            markerHeight="4"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#858f64" />
          </marker>
        </defs>
        <BaseEdge
          path={edgePath}
          style={{
            stroke: 'rgba(0,0,0,0.2)',
            strokeWidth: 4,
          }}
          markerEnd="url(#arrow)"
        />
        <BaseEdge
          path={edgePath}
          style={{
            stroke: `url(#gradient-${id})`,
            strokeWidth: 3,
          }}
          markerEnd="url(#arrow)"
        />
        <EdgeLabelRenderer>
          <div
            className={css.choiceEdge}
            style={{
              position: 'absolute',
              left: targetX,
              top: targetY,
              transform: 'translate(-50%, calc(-100% - 5px))',
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
