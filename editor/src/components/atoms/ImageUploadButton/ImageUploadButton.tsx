import { IconButton } from '@shared/components';
import { useContext } from 'react';
import { AppContext } from '../../../stores/AppContext.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const ImageUploadButton = () => {
  const { DrystoneStore } = useContext(AppContext);

  function handleOpenImageManager() {
    DrystoneStore.openImageManager();
  }

  return (
    <IconButton onClick={handleOpenImageManager}>
      <FontAwesomeIcon icon={['fas', 'image']} />
    </IconButton>
  );
};
