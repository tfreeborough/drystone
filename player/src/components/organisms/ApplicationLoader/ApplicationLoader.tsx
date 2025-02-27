import css from "./ApplicationLoader.module.scss";
import { ZipReader, BlobReader, TextWriter, BlobWriter } from "@zip.js/zip.js";
import { useContext, useRef, useState } from "react";
import { AppContext } from "../../../stores/AppContext.ts";
import { observer } from "mobx-react-lite";
import { Asset } from "@shared/types";
import { getErrorMessage } from "@shared/functions";
// import { AssetDB } from "@shared/services";

function ApplicationLoader() {
  const { ApplicationStore, PlayerStore } = useContext(AppContext);

  const [loadingError, setLoadingError] = useState<string | null>(null);

  async function handleExtractZip(event: any) {
    setLoadingError(null);
    const file = event.target.files[0];
    const reader = new ZipReader(new BlobReader(file));

    try {
      const entries = (await reader.getEntries()).filter((e) => !e.directory);
      const applicationData = entries.find(
        (e) => e.filename === "app-data.json",
      );

      if (!applicationData || !applicationData.getData) {
        throw new Error("No app-data.json file found in uploaded .zip");
      }

      const textWriter = new TextWriter();
      const appDataRaw = await applicationData.getData(textWriter);
      const appDataJson = JSON.parse(appDataRaw);

      // Process assets directly here
      for (const entry of entries) {
        const path = entry.filename.split("/");
        if (path[0] === "assets" && entry.getData) {
          const name = path.pop();

          try {
            // Create new BlobWriter for each asset
            const blobWriter = new BlobWriter("application/octet-stream");
            const data = await entry.getData(blobWriter);

            if (name) {
              const asset: Asset = {
                id: name.replace(".jpeg", ""),
                name: name.replace(".jpeg", ""),
                type: `${name.split(".").pop()}`,
                data,
                applicationId: appDataJson.id,
              };
              ApplicationStore.addAsset(asset);
              // await AssetDB.saveAsset(asset);
            }
          } catch (error) {
            console.error("Error processing asset:", entry.filename, error);
            throw error;
          }
        }
      }

      if (!appDataJson.entrypoint) {
        throw new Error("This application has no entrypoint.");
      }
      ApplicationStore.setApplication(appDataJson);
      PlayerStore.initializeGameState(
        appDataJson.entrypoint,
        appDataJson.variables,
      );
    } catch (error) {
      console.error("Error:", error);
      setLoadingError(getErrorMessage(error));
    } finally {
      await reader.close();
    }
  }

  const fileInput = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInput.current?.click();
  };

  return (
    <div className={css.applicationLoader}>
      <div className={css.box} onClick={handleButtonClick}>
        Click here to select a zip file
        <input
          ref={fileInput}
          type="file"
          className={css.input}
          accept="application/zip"
          onChange={handleExtractZip}
        />
      </div>
      {loadingError && <h2>ERROR: {loadingError}</h2>}
    </div>
  );
}

export default observer(ApplicationLoader);
