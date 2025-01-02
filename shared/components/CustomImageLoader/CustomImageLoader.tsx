import { useEffect, useState } from "react";
import { CustomImage as CustomImageComponent } from "../CustomImage/CustomImage";
import Muted from "../../../editor/src/components/atoms/Muted/Muted";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import css from "./CustomImageLoader.module.scss";
import { AssetDB } from "@shared/services";
import { JSONContent } from "@tiptap/react";

interface CustomImageLoaderProps {
  node: JSONContent;
}

export const CustomImageLoader = ({ node }: CustomImageLoaderProps) => {
  const [imageData, setImageData] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  useEffect(() => {
    const attrs = node.attrs;
    if (attrs) {
      setImageError(null);
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
};
