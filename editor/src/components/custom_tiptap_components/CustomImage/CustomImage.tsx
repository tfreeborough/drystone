import { Node } from '@tiptap/core';
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import { CustomImage as CustomImageComponent } from '@shared/components';
import { useEffect, useState } from 'react';
import { ImageDBService } from '../../../services/ImageDBService.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import css from './CustomImage.module.scss';
import Muted from '../../atoms/Muted/Muted.tsx';

const ImageComponent = ({ node }: any) => {
  const [imageData, setImageData] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  useEffect(() => {
    setImageError(null);
    const loadImage = async () => {
      const image = await ImageDBService.getImage(node.attrs.id).catch(err => {
        setImageError(err);
      });
      if (image) {
        setImageData(image.data);
      } else {
        setImageError('Image not found');
      }
    };
    void loadImage();
  }, [node.attrs.id]);

  console.log(node.attrs);

  if (!imageData)
    return (
      <NodeViewWrapper>
        {imageError ? (
          <div className={css.missingImage}>
            <FontAwesomeIcon icon={['fas', 'question']} />
            <Muted>
              Missing image, it may have been deleted from the image manager
            </Muted>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </NodeViewWrapper>
    );

  return (
    <NodeViewWrapper>
      <CustomImageComponent data={imageData} />
    </NodeViewWrapper>
  );
};

export const CustomImage = Node.create({
  name: 'customImage',
  group: 'block',
  atom: true,
  selectable: true, // Makes it selectable
  draggable: true, // Optional: makes it draggable
  inline: false, // Ensures it's treated as a block element

  addAttributes() {
    return {
      id: {
        default: null,
      },
    };
  },

  addKeyboardShortcuts() {
    return {
      ArrowUp: () => this.editor?.commands.focus('before'),
      ArrowDown: () => this.editor?.commands.focus('after'),
    };
  },

  parseHTML() {
    return [
      {
        tag: 'img[data-image-id]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'img',
      {
        ...HTMLAttributes,
        'data-image-id': HTMLAttributes.id,
      },
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageComponent);
  },

  addCommands(): any {
    return {
      insertImage:
        (id: string) =>
        ({ commands }: any) => {
          return commands.insertContent({
            type: this.name,
            attrs: { id },
          });
        },
    };
  },
});
