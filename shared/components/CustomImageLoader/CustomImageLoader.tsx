import { useContext, useEffect, useState } from "react";
import { CustomImage as CustomImageComponent } from "../CustomImage/CustomImage";
import Muted from "../../../editor/src/components/atoms/Muted/Muted";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import css from "./CustomImageLoader.module.scss";
import { AssetDB } from "@shared/services";
import { JSONContent } from "@tiptap/react";
import { observer } from "mobx-react-lite";
import { AppContext } from "../../../player/src/stores/AppContext";

interface CustomImageLoaderProps {
  node: JSONContent;
  inEditor?: boolean;
}

export const CustomImageLoader = observer(
  ({ node, inEditor = true }: CustomImageLoaderProps) => {
    const [imageData, setImageData] = useState<string | null>(null);
    const [imageError, setImageError] = useState<string | null>(null);
    const { ApplicationStore } = useContext(AppContext);

    useEffect(() => {
      const attrs = node.attrs;
      if (attrs) {
        setImageError(null);
        console.log(inEditor);
        if (inEditor) {
          const loadImage = async () => {
            const image = await AssetDB.getAsset(
              attrs.applicationId,
              attrs.id,
            ).catch((err) => {
              console.log(err);
              setImageError(err);
            });
            if (image) {
              const url = URL.createObjectURL(image.data);
              setImageData(url);
            } else {
              setImageError("Image not found");
            }
          };
          void loadImage();
        } else {
          const asset = ApplicationStore.assets.get(attrs.id);
          if (asset) {
            const url = URL.createObjectURL(asset.data);
            setImageData(url);
          } else {
            setImageError("Image not found");
          }
        }
      }
    }, [node]);

    if (!imageData)
      return (
        <>
          {imageError ? (
            <div className={css.missingImage}>
              <FontAwesomeIcon icon={["fas", "question"]} />
              <Muted>
                Missing image, it may have been deleted from the image manager
              </Muted>
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </>
      );

    return <CustomImageComponent data={imageData} />;
  },
);
