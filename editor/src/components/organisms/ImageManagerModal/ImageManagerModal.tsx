import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '../../../stores/AppContext.ts';
import { Align, Application, Asset, FlexDirection, Gap } from '@shared/types';
import { AssetDB } from '@shared/services';
import { v4 as uuidv4 } from 'uuid';
import { base64ToBlob, replaceExtensionWithJpeg } from '@shared/functions';
import { useClickOutsideRef } from '../../../hooks/useClickOutsideRef.ts';
import css from './ImageManagerModal.module.scss';
import { DeleteIcon, Flex } from '@shared/components';

interface ImageManagerModalProps {
  extra?: {
    onImageSelect: (storedImage: Asset) => void;
    application: Application;
  };
}

export const ImageManagerModal = ({ extra }: ImageManagerModalProps) => {
  const { DrystoneStore, ApplicationStore } = useContext(AppContext);

  const modalRef = useRef<HTMLDivElement>(null);

  const [images, setImages] = useState<Asset[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useClickOutsideRef(modalRef, (e: MouseEvent) => {
    e.stopPropagation();
    DrystoneStore.closeImageManager();
  });

  useEffect(() => {
    loadImages();
  }, []);

  if (!extra) {
    return null;
  }

  const loadImages = async () => {
    const allImages = await AssetDB.getAllAssetsForApplication(
      extra.application.id,
    );
    setImages(allImages);
  };

  const handleDeleteImage = async (e: React.MouseEvent, imageId: string) => {
    e.stopPropagation();
    await AssetDB.deleteAsset(extra.application.id, imageId);
    await loadImages();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    // Check if the file is a GIF
    if (file.type === 'image/gif') {
      // Handle GIF directly without compression
      const asset: Asset = {
        id: uuidv4(),
        type: 'image/gif',
        data: file, // Use the original file
        name: file.name,
        applicationId: extra.application.id,
      };
      await AssetDB.saveAsset(asset);
      loadImages();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = async event => {
      // Create an image element to get dimensions
      const img = new Image();
      img.src = event.target?.result as string;

      await new Promise(resolve => (img.onload = resolve));

      // Create canvas for resizing
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Set maximum dimensions (adjust these as needed)
      const MAX_WIDTH = 1200;
      const MAX_HEIGHT = 1200;

      // Calculate new dimensions
      if (width > height && width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width);
        width = MAX_WIDTH;
      } else if (height > MAX_HEIGHT) {
        width = Math.round((width * MAX_HEIGHT) / height);
        height = MAX_HEIGHT;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);

      // Convert to base64 with quality reduction (0.7 = 70% quality)
      const optimizedBase64 = canvas.toDataURL('image/jpeg', 0.7);

      const asset: Asset = {
        id: uuidv4(),
        type: 'image/jpeg',
        data: base64ToBlob(optimizedBase64),
        name: replaceExtensionWithJpeg(file.name),
        applicationId: extra.application.id,
      };
      await AssetDB.saveAsset(asset);
      // await ImageDBService.saveImage(optimizedFile, optimizedBase64);
      loadImages();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={css.imageManagerModal}>
      <Flex
        gap={Gap.SM}
        flexDirection={FlexDirection.COLUMN}
        alignItems={Align.STRETCH}
      >
        <div className={css.input}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>
        <div className={css.gallery}>
          {images.map(image => {
            const usages = ApplicationStore.calculateImageUsage(
              image.applicationId,
              image.id,
            );
            return (
              <div
                className={css.image}
                key={image.id}
                onClick={() => {
                  console.log('image selected');
                  extra.onImageSelect(image);
                }}
              >
                <img src={URL.createObjectURL(image.data)} alt={image.name} />
                <span className={css.name}>{image.name}</span>
                {usages === 0 && (
                  <DeleteIcon
                    className={css.delete}
                    onClick={e => handleDeleteImage(e, image.id)}
                  />
                )}
              </div>
            );
          })}
        </div>
      </Flex>
    </div>
  );
};
