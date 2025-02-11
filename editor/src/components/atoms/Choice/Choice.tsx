import { Choice as ChoiceType } from '@shared/types';
import css from './Choice.module.scss';
import { ModalContext, ModalType } from '@shared/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ConditionalLogicModal } from '../../organisms/ConditionalLogicModal/ConditionalLogicModal.tsx';
import { useContext } from 'react';
import { TriggerLogicModal } from '../../organisms/TriggerLogicModal/TriggerLogicModal.tsx';

interface ChoiceProps {
  onSelect: (choice: ChoiceType) => void;
  choice: ChoiceType;
  applicationId: string;
  sceneId: string;
}

function Choice({ onSelect, choice, applicationId, sceneId }: ChoiceProps) {
  const { addModal } = useContext(ModalContext);

  function handleClick() {
    onSelect(choice);
  }

  function handleOpenConditionalLogicModal(
    event: React.MouseEvent<SVGSVGElement>,
  ) {
    event.preventDefault();
    addModal({
      id: 'conditional-logic-modal',
      event,
      type: ModalType.NORMAL,
      content: <ConditionalLogicModal />,
      extra: {
        choiceId: choice.id,
        applicationId,
        sceneId,
      },
    });
  }

  function handleOpenTriggerLogicModal(event: React.MouseEvent<SVGSVGElement>) {
    event.preventDefault();
    addModal({
      id: 'trigger-logic-modal',
      event,
      type: ModalType.NORMAL,
      content: <TriggerLogicModal />,
      extra: {
        choiceId: choice.id,
        applicationId,
        sceneId,
      },
    });
  }

  const hasConditions = choice.conditions && choice.conditions.length > 0;
  const hasTriggers = choice.triggers && choice.triggers.length > 0;
  const isHidden = !choice.showAsDisabled;

  return (
    <div
      className={`${css.choice} ${hasConditions ? css.hasConditions : ''} ${isHidden ? css.hidden : ''} ${hasTriggers ? css.hasTriggers : ''}`}
    >
      {hasConditions && (
        <FontAwesomeIcon
          className={css.icon}
          title="This choice has conditions"
          icon={['fas', 'filter']}
          onClick={handleOpenConditionalLogicModal}
        />
      )}
      {hasTriggers && (
        <FontAwesomeIcon
          className={css.icon}
          title="This choice has triggers"
          icon={['fas', 'code']}
          onClick={handleOpenTriggerLogicModal}
        />
      )}
      <span className={css.text} onClick={handleClick}>
        {choice.label}{' '}
        {choice.showAsDisabled && <span>({choice.showAsDisabledText})</span>}
        {isHidden && <span>(HIDDEN)</span>}
      </span>
    </div>
  );
}

export default Choice;
