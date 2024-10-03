import css from './ApplicationLoader.module.scss';
import {ZipReader, BlobReader, TextWriter, BlobWriter} from '@zip.js/zip.js';
import {useContext, useState} from "react";
import {AppContext} from "../../../stores/AppContext.ts";
import { observer } from "mobx-react-lite";


function ApplicationLoader(){
  const {
    ApplicationStore,
    PlayerStore,
  } = useContext(AppContext);

  const [loadingError, setLoadingError] = useState<string | null>(null);

  async function handleExtractZip(event){
    setLoadingError(null);
    const file = event.target.files[0];
    const reader = new ZipReader(new BlobReader(file));

    try {
      const entries = (await reader.getEntries()).filter((e) => !e.directory);
      const applicationData = entries.find((e) => e.filename === 'app-data.json');
      if(!applicationData || !applicationData.getData){
        throw new Error("No app-data.json file found in uploaded .zip")
      }

      const textWriter = new TextWriter();
      const blobWriter = new BlobWriter();

      const appDataRaw = await applicationData.getData(textWriter);
      const appDataJson = JSON.parse(appDataRaw);

      const assets = [];
      for(const entry of entries){
        const path = entry.filename.split('/');
        if(path[0] === 'assets' && entry.getData){
          const name = path.pop();
          const data = await entry.getData(blobWriter)
          assets.push({ id: name, type:  `${name.split('.').pop()}`, data })
        }
      }

      console.log(assets)

      ApplicationStore.setApplication(appDataJson);
      ApplicationStore.setAssets(assets);
      PlayerStore.initializeGameState(appDataJson.entrypoint);
      document.title = appDataJson.name;


    } catch (error: Error) {
      console.error('Error processing zip file:', error);
      setLoadingError(error.message);
    } finally {
      await reader.close();
    }
  };

  return (
    <div className={css.applicationLoader}>
      <div className={css.box}>
        Click here to select a zip file
        <input type="file" className={css.input} accept="application/zip" onChange={handleExtractZip} />
      </div>
      {
        loadingError && (
          <h2>ERROR: {loadingError}</h2>
        )
      }
    </div>
  )
}

export default observer(ApplicationLoader);
