import {
  Align,
  ApplicationVariable,
  FlexDirection,
  Gap,
  Justify,
} from '@shared/types';

import css from './VariableDisplay.module.scss';
import { Flex, ModalContext, ModalType } from '@shared/components';
import { VariableType } from '../VariableType/VariableType.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext } from 'react';
import EditVariableModal from '../../organisms/EditVariableModal/EditVariableModal.tsx';

interface VariableDisplayProps {
  variable: ApplicationVariable;
  applicationId: string;
}

export function VariableDisplay({
  variable,
  applicationId,
}: VariableDisplayProps) {
  const { addModal } = useContext(ModalContext);

  function handleOpenVariableModal(event: React.MouseEvent<SVGSVGElement>) {
    addModal({
      id: 'edit-variable-modal',
      type: ModalType.NORMAL,
      content: <EditVariableModal />,
      event,
      extra: { variable, applicationId },
    });
  }

  return (
    <Flex
      className={css.variableDisplay}
      alignItems={Align.CENTER}
      justifyContent={Justify.SPACE_BETWEEN}
      gap={Gap.XS}
    >
      <Flex alignItems={Align.CENTER} gap={Gap.XS}>
        <VariableType type={variable.type} />
        <Flex flexDirection={FlexDirection.COLUMN}>
          <span>{variable.name}</span>
          {variable.defaultValue !== undefined &&
            variable.defaultValue !== null && (
              <span className={css.defaultValue}>
                Default value: {variable.defaultValue?.toString()}
              </span>
            )}
        </Flex>
      </Flex>
      <FontAwesomeIcon
        className={css.edit}
        icon={['fas', 'pencil']}
        onClick={handleOpenVariableModal}
      />
    </Flex>
  );
}
