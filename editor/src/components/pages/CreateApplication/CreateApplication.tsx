import { ReactElement, useContext, useState } from 'react';
import { v4 } from 'uuid';
import { observer } from 'mobx-react-lite';
import css from './CreateApplication.module.scss';
import Card from '../../atoms/Card/Card.tsx';
import TextInput from '../../atoms/TextInput/TextInput.tsx';
import { Flex } from '@shared/components';
import { AppContext } from '../../../stores/AppContext.ts';
import { useLocation } from 'wouter';
import { Align, Application, FlexDirection, Gap } from '@shared/types';
import { Button } from '@shared/components';
import Label from '../../atoms/Label/Label.tsx';

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
      variables: [],
    };
    ApplicationStore.setCurrentApplication(application);
    ApplicationStore.addApplication(application);
    setLocation(`/a/${application.id}`);
  }

  return (
    <Card className={css.createApplication}>
      <Flex flexDirection={FlexDirection.COLUMN} gap={Gap.MD}>
        <TextInput
          placeholder="Enter application name"
          label="Application Name (required)"
          value={applicationName}
          fullWidth
          onChange={value => setApplicationName(value)}
        />
        <div className={css.description}>
          <Label>Introduction Text (optional)</Label>
          <textarea
            placeholder="This is the text that will show before a user starts your application."
            className={css.input}
            rows={5}
            onChange={e => setApplicationDescription(e.target.value)}
          >
            {applicationDescription}
          </textarea>
        </div>

        <Flex
          className={css.author}
          gap={Gap.SM}
          alignItems={Align.STRETCH}
          flexDirection={FlexDirection.COLUMN}
        >
          <div>
            <TextInput
              fullWidth
              label="Author Name (optional)"
              placeholder="Enter an author name, if you wish"
              value={authorName}
              onChange={value => setAuthorName(value)}
            />
          </div>
          <div>
            <TextInput
              fullWidth
              label="Author Website (optional)"
              placeholder="Link users to where they can support you or learn more"
              value={authorLink}
              onChange={value => setAuthorLink(value)}
            />
          </div>
        </Flex>
        <Button
          disabled={applicationName.length === 0}
          onClick={handleCreateApplication}
        >
          Save
        </Button>
      </Flex>
    </Card>
  );
}

export default observer(CreateApplication);
