import { Application, FontStyles, SelectOption } from '@shared/types';

import css from './ApplicationStylingForm.module.scss';
import { useContext } from 'react';
import { AppContext } from '../../../stores/AppContext.ts';
import SelectInput from '../../atoms/SelectInput/SelectInput.tsx';

interface ApplicationStylingFormProps {
  application: Application;
}

export const ApplicationStylingForm = ({
  application,
}: ApplicationStylingFormProps) => {
  const { ApplicationStore } = useContext(AppContext);

  function handleUpdateFontStyle(option: SelectOption<FontStyles> | null) {
    if (option) {
      ApplicationStore.updateThemeFont(application.id, option.value);
    } else {
      ApplicationStore.updateThemeFont(application.id, null);
    }
  }

  return (
    <div className={css.applicationStylingForm}>
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
  );
};
