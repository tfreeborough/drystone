import { ReactElement, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import Topper from '../../atoms/Topper/Topper.tsx';
import css from './MetadataEditor.module.scss';
import Card from '../../atoms/Card/Card.tsx';
import { Flex } from '@shared/components';
import Heading from '../../atoms/Heading/Heading.tsx';
import { AppContext } from '../../../stores/AppContext.ts';
import TextInput from '../../atoms/TextInput/TextInput.tsx';
import { Align, FlexDirection, Gap, SelectOption } from '@shared/types';
import SelectInput from '../../atoms/SelectInput/SelectInput.tsx';
import { ApplicationStylingForm } from '../ApplicationStylingForm/ApplicationStylingForm.tsx';

function MetadataEditor(): ReactElement {
  const { ApplicationStore } = useContext(AppContext);

  const current = ApplicationStore.current;

  if (!current) {
    return <></>;
  }

  function handleUpdateAuthorName(value: string) {
    if (current) {
      ApplicationStore.updateAuthor(current.id, {
        ...current.author,
        name: value,
      });
    }
  }

  function handleUpdateAuthorLink(value: string) {
    if (current) {
      ApplicationStore.updateAuthor(current.id, {
        ...current.author,
        link: value,
      });
    }
  }

  function handleUpdateEntrypoint(value: SelectOption | null) {
    if (current && value) {
      ApplicationStore.updateEntrypoint(current.id, value.value);
    }
  }

  return (
    <div className={css.metadataEditor}>
      <Topper noNegativeMargin>Metadata</Topper>
      <div className={css.cardWrapper}>
        <Card className={css.card}>
          <Flex
            flexDirection={FlexDirection.COLUMN}
            gap={Gap.SM}
            alignItems={Align.STRETCH}
          >
            <Heading>Author Information</Heading>
            <div>
              <TextInput
                fullWidth
                label="Author Name"
                value={current.author.name}
                onChange={handleUpdateAuthorName}
              />
            </div>
            <div>
              <TextInput
                fullWidth
                label="Author Website"
                value={current.author.link}
                onChange={handleUpdateAuthorLink}
              />
            </div>
          </Flex>
        </Card>
        <Card className={css.card}>
          <Flex
            flexDirection={FlexDirection.COLUMN}
            gap={Gap.SM}
            alignItems={Align.STRETCH}
          >
            <Heading>Entrypoint</Heading>
            <div>
              <SelectInput
                fullWidth
                label="The first scene of your application"
                value={
                  current.entrypoint
                    ? current.entrypoint
                    : current.scenes[0]?.id
                }
                values={current.scenes.map(s => {
                  return { text: s.metadata.note ?? '', value: s.id };
                })}
                onSelect={option => {
                  handleUpdateEntrypoint(option);
                }}
              />
            </div>
          </Flex>
        </Card>
        <Card className={css.card}>
          <Flex
            flexDirection={FlexDirection.COLUMN}
            gap={Gap.SM}
            alignItems={Align.STRETCH}
          >
            <Heading>Styling</Heading>
            <ApplicationStylingForm application={current} />
          </Flex>
        </Card>
      </div>
    </div>
  );
}

export default observer(MetadataEditor);
