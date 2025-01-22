import { observer } from 'mobx-react-lite';
import css from './Variables.module.scss';
import Topper from '../../atoms/Topper/Topper.tsx';
import { Button, Flex, ModalContext, ModalType } from '@shared/components';
import {
  Align,
  ApplicationVariableVisibility,
  FlexDirection,
  Gap,
} from '@shared/types';
import { useContext } from 'react';
import { AppContext } from '../../../stores/AppContext.ts';
import Muted from '../../atoms/Muted/Muted.tsx';
import { VariableDisplay } from '../../atoms/VariableDisplay/VariableDisplay.tsx';
import CreateVariableModal from '../CreateVariableModal/CreateVariableModal.tsx';

function Variables() {
  const { ApplicationStore } = useContext(AppContext);
  const { addModal } = useContext(ModalContext);

  const current = ApplicationStore.current;
  if (!current) {
    return null;
  }

  const publicVariables = current.variables.filter(
    v => v.visibility === ApplicationVariableVisibility.PUBLIC,
  );

  const privateVariables = current.variables.filter(
    v => v.visibility === ApplicationVariableVisibility.PRIVATE,
  );

  function handleAddPublicVariable(event: React.MouseEvent<HTMLButtonElement>) {
    if (current) {
      addModal({
        id: 'create-variable-modal',
        type: ModalType.NORMAL,
        content: <CreateVariableModal />,
        event,
        extra: {
          visibility: ApplicationVariableVisibility.PUBLIC,
          applicationId: current.id,
        },
      });
    }
  }

  function handleAddPrivateVariable(
    event: React.MouseEvent<HTMLButtonElement>,
  ) {
    if (current) {
      addModal({
        id: 'create-variable-modal',
        type: ModalType.NORMAL,
        content: <CreateVariableModal />,
        event,
        extra: {
          visibility: ApplicationVariableVisibility.PRIVATE,
          applicationId: current.id,
        },
      });
    }
  }

  // console.log(current);

  return (
    <Flex
      className={css.variables}
      flexDirection={FlexDirection.COLUMN}
      gap={Gap.MD}
      alignItems={Align.STRETCH}
    >
      <Topper>Variables</Topper>
      <div className={css.list}>
        <div className={css.public}>
          <Topper>Public Variables</Topper>
          {publicVariables.length === 0 && (
            <Flex
              className={css.noVariables}
              flexDirection={FlexDirection.COLUMN}
              gap={Gap.SM}
            >
              <Muted>This application currently has 0 public variables.</Muted>
            </Flex>
          )}
          <div className={css.table}>
            {publicVariables.map(variable => {
              return (
                <VariableDisplay
                  variable={variable}
                  applicationId={current.id}
                  key={variable.id}
                />
              );
            })}
          </div>
          <Button className={css.add} onClick={handleAddPublicVariable}>
            Add Public Variable
          </Button>
        </div>
        <div className={css.private}>
          <Topper>Private Variables</Topper>
          {privateVariables.length === 0 && (
            <Flex
              className={css.noVariables}
              flexDirection={FlexDirection.COLUMN}
              gap={Gap.SM}
            >
              <Muted>This application currently has 0 private variables.</Muted>
            </Flex>
          )}
          <div className={css.table}>
            {privateVariables.map(variable => {
              return (
                <VariableDisplay
                  variable={variable}
                  applicationId={current.id}
                  key={variable.id}
                />
              );
            })}
          </div>
          <Button className={css.add} onClick={handleAddPrivateVariable}>
            Add Private Variable
          </Button>
        </div>
      </div>
    </Flex>
  );
}

export default observer(Variables);
