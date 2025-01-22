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
import Card from '../../atoms/Card/Card.tsx';

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
      <Card className={css.explainer}>
        <Topper noNegativeMargin>What are variables?</Topper>
        <div className={css.content}>
          <p>
            Variables are a way to add some interactivity and dynamicism to your
            applications! Variables can be Public or Private, the differences
            are explained below.
          </p>

          <div className={css.visibilityDefinitions}>
            <div className={css.block}>
              <strong>Public Variables</strong>
              <hr />
              <p>
                Public variables will always be visible to players whilst they
                use your application. These are useful for things you want the
                player to know about such as stats and locations. Public
                variables can be used as follows:
              </p>
              <ul>
                <li>
                  Used as conditional values in choices to determine if a choice
                  should be made available to a player.
                </li>
                <li>Modified when a player clicks on a choice.</li>
                <li>
                  Used inside of frame text using templates (i.e. I'm glad
                  you've returned back safe, &nbsp;
                  {'{{'}name{'}}'}!)
                </li>
                <li>Used to conditionally render text inside of a frame.</li>
              </ul>
            </div>
            <div className={css.block}>
              <strong>Private Variables</strong>
              <hr />
              <p>
                Private variables will never be shown to players whilst they use
                your application, and cannot be included using templates.
                Private variables should be used for things that are meant to be
                a secret such as if the player has performed a certain action.
                Private variables can be used as follows:
              </p>
              <ul>
                <li>
                  Used as conditional values in choices to determine if a choice
                  should be made available to a player.
                </li>
                <li>Modified when a player clicks on a choice.</li>
                <li>Used to conditionally render text inside of a frame.</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </Flex>
  );
}

export default observer(Variables);
