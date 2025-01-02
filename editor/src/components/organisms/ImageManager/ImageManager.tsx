import { useState, useEffect, useContext, useRef } from 'react';

import css from './ImageManager.module.scss';
import Card from '../../atoms/Card/Card.tsx';
import { FadeInWithScale } from '@shared/animations';
import { useClickOutsideRef } from '../../../hooks/useClickOutsideRef.ts';
import { AppContext } from '../../../stores/AppContext.ts';
import { Flex } from '@shared/components';
import { Align, Application, Asset, FlexDirection, Gap } from '@shared/types';
import { AssetDB } from '@shared/services';
import { v4 as uuidv4 } from 'uuid';
import { base64ToBlob } from '@shared/functions';

interface ImageManagerProps {
  onImageSelect: (storedImage: Asset) => void;
  application: Application;
}

export const ImageManager = ({
  onImageSelect,
  application,
}: ImageManagerProps) => {
  const { DrystoneStore } = useContext(AppContext);

  const modalRef = useRef<HTMLDivElement>(null);

  const [images, setImages] = useState<Asset[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    const allImages = await AssetDB.getAllAssetsForApplication(application.id);
    setImages(allImages);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
          applicationId: application.id,
        };
        await AssetDB.saveAsset(asset);
        // await ImageDBService.saveImage(optimizedFile, optimizedBase64);
        loadImages();
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useClickOutsideRef(modalRef, () => {
    DrystoneStore.closeImageManager();
  });

  return (
    <div className={css.imageManager}>
      <div className={css.modal} ref={modalRef}>
        <FadeInWithScale>
          <Card>
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
                  return (
                    <div
                      className={css.image}
                      key={image.id}
                      onClick={() => onImageSelect(image)}
                    >
                      <img src={URL.createObjectURL(image.data)} />
                    </div>
                  );
                })}
              </div>
            </Flex>
          </Card>
        </FadeInWithScale>
      </div>
    </div>
  );
};
