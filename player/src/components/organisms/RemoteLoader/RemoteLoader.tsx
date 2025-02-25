import css from "./RemoteLoader.module.scss";
import { BlobReader, BlobWriter, TextWriter, ZipReader } from "@zip.js/zip.js";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../stores/AppContext.ts";
import { observer } from "mobx-react-lite";
import { Align, Asset, FlexDirection, Gap } from "@shared/types";
import { getErrorMessage } from "@shared/functions";
import { AssetDB } from "@shared/services";
import { Flex, Loading, Notice, NoticeType } from "@shared/components";

/**
 * This is a list of origins that have been requested for a special integration.
 */
const PARENT_ORIGINS = ["https://kinkbase.com", "http://localhost:3000"];

interface RemoteLoaderProps {
  remote: string;
}

function RemoteLoader({ remote }: RemoteLoaderProps) {
  const { ApplicationStore, PlayerStore } = useContext(AppContext);

  const [extracting, setExtracting] = useState<boolean>(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  async function handleExtractZip(fileBlob: Blob) {
    setLoadingError(null);
    const reader = new ZipReader(new BlobReader(fileBlob));

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
              console.log("saving asset");
              ApplicationStore.addAsset(asset);
              //await AssetDB.saveAsset(asset);
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
      setExtracting(false);
      ApplicationStore.setApplication(appDataJson);
      PlayerStore.initializeGameState(
        appDataJson.entrypoint,
        appDataJson.variables,
      );

      /**
       * Send the app loaded message to every approved origin, we don't specify * because
       * that's bad security practice.
       */
      PARENT_ORIGINS.forEach((origin) => {
        window.parent.postMessage(
          {
            type: "APP_LOADED",
            data: {},
          },
          origin,
        );
      });
    } catch (error) {
      console.error("Error:", error);
      setLoadingError(getErrorMessage(error));
    } finally {
      await reader.close();
    }
  }

  const [progress, setProgress] = useState(0);

  const downloadFile = async () => {
    const response = await fetch(remote, { mode: "cors" });
    if (!response.ok) {
      throw new Error(
        "There was an error fetching this application from the remote URL provided.",
      );
    }
    const contentLength = response.headers.get("content-length")!;

    const total = parseInt(contentLength, 10);
    let loaded = 0;
    if (response.body) {
      const reader = response.body.getReader();
      const chunks = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        loaded += value.length;
        setProgress((loaded / total) * 100);
      }

      // Combine chunks into a single Uint8Array
      const allChunks = new Uint8Array(loaded);
      let position = 0;
      for (const chunk of chunks) {
        allChunks.set(chunk, position);
        position += chunk.length;
      }

      // Convert to blob and process as zip
      const blob = new Blob([allChunks]);
      setExtracting(true);
      await handleExtractZip(blob);
    }
  };

  useEffect(() => {
    const asyncDownload = async () => {
      try {
        await downloadFile();
      } catch (e) {
        console.log(e);
        setLoadingError(getErrorMessage(e));
      }
    };
    void asyncDownload();
  }, []);

  return (
    <Flex
      className={css.remoteLoader}
      flexDirection={FlexDirection.COLUMN}
      alignItems={Align.STRETCH}
      gap={Gap.MD}
    >
      {extracting && (
        <Loading>
          Hold tight while we extract assets into memory <br /> (this could take
          a while on slow devices and on large apps)
        </Loading>
      )}
      {!loadingError && !extracting && (
        <Flex
          flexDirection={FlexDirection.COLUMN}
          alignItems={Align.STRETCH}
          className={css.loading}
          gap={Gap.SM}
        >
          <progress value={progress} max="100" />
          <div>{Math.round(progress)}%</div>
        </Flex>
      )}
      {loadingError && (
        <Notice type={NoticeType.ERROR}>
          <Flex flexDirection={FlexDirection.COLUMN} gap={Gap.SM}>
            <h5>Error loading application</h5>
            <p>{loadingError}</p>
          </Flex>
        </Notice>
      )}
    </Flex>
  );
}

export default observer(RemoteLoader);
