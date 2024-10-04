import { ReactElement, useContext, useState } from 'react';
import { v4 } from 'uuid';
import { observer } from 'mobx-react-lite';
import css from './CreateApplication.module.scss';
import Card from '../../atoms/Card/Card.tsx';
import TextInput from '../../atoms/TextInput/TextInput.tsx';
import Flex from '../../atoms/Flex/Flex.tsx';
import {
  FlexDirection,
  FlexGap,
  FlexJustify,
} from '../../atoms/Flex/Flex.types.ts';
import Button from '../../atoms/Button/Button.tsx';
import { AppContext } from '../../../stores/AppContext.ts';
import { useLocation } from 'wouter';
import { Application } from 'drystone';

function CreateApplication(): ReactElement {
  const [applicationName, setApplicationName] = useState('');
  const [applicationDescription, setApplicationDescription] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorLink, setAuthorLink] = useState('');

  const [, setLocation] = useLocation();

  const { ApplicationStore } = useContext(AppContext);

  function handleCreateApplication() {
    const application: Application = {
      type: 'application',
      id: v4(),
      name: applicationName,
      description: applicationDescription,
      scenes: [],
      author: {
        name: authorName,
        link: authorLink,
      },
      entrypoint: '',
    };
    ApplicationStore.setCurrentApplication(application);
    ApplicationStore.addApplication(application);
    setLocation(`/a/${application.id}`);
  }

  return (
    <Card className={css.createApplication}>
      <Flex flexDirection={FlexDirection.COLUMN} gap={FlexGap.MD}>
        <div>
          My new application is called{' '}
          <TextInput
            inline
            value={applicationName}
            onChange={value => setApplicationName(value)}
          />
        </div>
        <div>
          When new readers/player first load up my application, they will see
          the following description: <br />
          <TextInput
            inline
            value={applicationDescription}
            onChange={value => setApplicationDescription(value)}
          />
        </div>
        <Flex
          className={css.author}
          gap={FlexGap.SM}
          justifyContent={FlexJustify.SPACE_BETWEEN}
        >
          <div>
            <TextInput
              fullWidth
              label="Author Name"
              value={authorName}
              onChange={value => setAuthorName(value)}
            />
          </div>
          <div>
            <TextInput
              fullWidth
              label="Author Website"
              value={authorLink}
              onChange={value => setAuthorLink(value)}
            />
          </div>
        </Flex>
        <Button
          disabled={
            applicationName.length === 0 || applicationDescription.length <= 10
          }
          onClick={handleCreateApplication}
        >
          Save
        </Button>
      </Flex>
    </Card>
  );
}

export default observer(CreateApplication);
