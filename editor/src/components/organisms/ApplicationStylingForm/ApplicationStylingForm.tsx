import {
  Application,
  FlexDirection,
  FontStyles,
  SelectOption,
} from '@shared/types';

import css from './ApplicationStylingForm.module.scss';
import { useContext } from 'react';
import { AppContext } from '../../../stores/AppContext.ts';
import SelectInput from '../../atoms/SelectInput/SelectInput.tsx';
import Label from '../../atoms/Label/Label.tsx';
import { Button, Flex } from '@shared/components';
import { observer } from 'mobx-react-lite';

interface ApplicationStylingFormProps {
  application: Application;
}

export const ApplicationStylingForm = observer(
  ({ application }: ApplicationStylingFormProps) => {
    const { ApplicationStore } = useContext(AppContext);

    function handleUpdateFontStyle(option: SelectOption<FontStyles> | null) {
      if (option) {
        ApplicationStore.updateThemeFont(application.id, option.value);
      } else {
        ApplicationStore.updateThemeFont(application.id, null);
      }
    }

    function handleChangeBackgroundColor(
      e: React.ChangeEvent<HTMLInputElement>,
    ) {
      console.log('change primary', e.target.value);
      ApplicationStore.updateThemeBackgroundColor(
        application.id,
        e.target.value,
      );
    }

    function handleChangeElementsColor(e: React.ChangeEvent<HTMLInputElement>) {
      ApplicationStore.updateThemeElementsColor(application.id, e.target.value);
    }

    function handleChangeTextColor(e: React.ChangeEvent<HTMLInputElement>) {
      ApplicationStore.updateThemeTextColor(application.id, e.target.value);
    }

    return (
      <div className={css.applicationStylingForm}>
        <div>
          <SelectInput<FontStyles>
            fullWidth
            label="Font style (applies to editor & application text)"
            value={
              application?.theming?.fontStyle
                ? application.theming.fontStyle
                : FontStyles.SERIF
            }
            values={[
              { text: 'Serif', value: FontStyles.SERIF },
              { text: 'Sans Serif', value: FontStyles.SANS_SERIF },
              { text: 'Monospaced', value: FontStyles.MONOSPACE },
              { text: 'Cursive', value: FontStyles.CURSIVE },
              { text: 'Fantasy', value: FontStyles.FANTASY },
            ]}
            onSelect={option => {
              handleUpdateFontStyle(option);
            }}
          />
        </div>
        <div className={css.colors}>
          <Flex flexDirection={FlexDirection.COLUMN}>
            <Label>Background</Label>
            <input
              type="color"
              value={
                application?.theming?.backgroundColor
                  ? application.theming.backgroundColor
                  : '#f8f4f1'
              }
              onInput={handleChangeBackgroundColor}
            />
          </Flex>
          <Flex flexDirection={FlexDirection.COLUMN}>
            <Label>Elements</Label>
            <input
              type="color"
              value={
                application?.theming?.elementsColor
                  ? application.theming.elementsColor
                  : '#858f64'
              }
              onInput={handleChangeElementsColor}
            />
          </Flex>
          <Flex flexDirection={FlexDirection.COLUMN}>
            <Label>Text</Label>
            <input
              type="color"
              value={
                application?.theming?.textColor
                  ? application.theming.textColor
                  : '#070708'
              }
              onInput={handleChangeTextColor}
            />
          </Flex>
        </div>
        <div className={css.preview}>
          <h1>This is a preview</h1>
          <p>
            Please don't make the readers eyes bleed! To ensure this doesn't
            happen, its probably best to not pick some wacky bright neon
            background color.
          </p>
          <p>
            You also need to remember to make sure your text and background
            compliment each other, as uncle ben once said: "With great power
            comes great responsibility".
          </p>
          <div className={css.choices}>
            <span className={css.choice}>
              This isn't actually a choice you can click on.
            </span>
            <span className={css.choice}>Neither is this.</span>
            <span className={css.choice}>One more for good luck!</span>
          </div>
          <Button className={css.button} onClick={() => {}}>
            I'm a button
          </Button>
        </div>
      </div>
    );
  },
);
