import { BlobReader, BlobWriter, ZipWriter } from '@zip.js/zip.js';
import { observer } from 'mobx-react-lite';

import Heading from '../../atoms/Heading/Heading.tsx';
import Topper from '../../atoms/Topper/Topper.tsx';
import Card from '../../atoms/Card/Card.tsx';
import css from './ExportManager.module.scss';
import Flex from '../../atoms/Flex/Flex.tsx';
import {
  FlexAlign,
  FlexGap,
  FlexJustify,
} from '../../atoms/Flex/Flex.types.ts';
import Button from '../../atoms/Button/Button.tsx';
import { AppContext } from '../../../stores/AppContext.ts';
import { useContext } from 'react';

function ExportManager() {
  const { ApplicationStore } = useContext(AppContext);

  async function handleExport() {
    const current = ApplicationStore.current;
    if (current) {
      const zipFileWriter = new BlobWriter('application/zip');
      const zip = new ZipWriter(zipFileWriter);

      // Add JSON data
      const jsonBlob = new Blob([JSON.stringify(current)], {
        type: 'application/json',
      });
      await zip.add('app-data.json', new BlobReader(jsonBlob));

      // Add image
      const imageResponse = await fetch('https://picsum.photos/536/354');
      const imageBlob = await imageResponse.blob();
      await zip.add('assets/logo.png', new BlobReader(imageBlob));

      // Close the writer and get the zip file as a blob
      await zip.close();
      const zipBlob = await zipFileWriter.getData();

      // Create download link
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(zipBlob);
      downloadLink.download = `${current.name.split(' ').join('-')}.zip`;
      downloadLink.click();

      // Clean up
      URL.revokeObjectURL(downloadLink.href);
    }
  }

  return (
    <div className={css.exportManager}>
      <Topper noNegativeMargin>Export Application</Topper>
      <Flex gap={FlexGap.NONE} alignItems={FlexAlign.STRETCH}>
        <Card className={css.wrapper}>
          <Heading>Export Information</Heading>
          <p>
            Exporting your application will allow others users to play it on
            their devices. Exporting will take everything you have created in
            this application so far and bundle it into a .zip file.
          </p>
          <p>
            A unique hash will be created from your application to help specify
            its version,&nbsp;
            <strong>
              users that have save files from a previous version of your
              application MAY run into compatability issues.
            </strong>
          </p>
        </Card>
        <Card className={css.wrapper}>
          <Flex
            className={css.export}
            alignItems={FlexAlign.CENTER}
            justifyContent={FlexJustify.CENTER}
          >
            <Button onClick={handleExport}>Export to Zip</Button>
          </Flex>
        </Card>
      </Flex>
    </div>
  );
}

export default observer(ExportManager);
