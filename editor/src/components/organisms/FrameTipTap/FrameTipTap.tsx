import {
  BubbleMenu,
  EditorContent,
  FloatingMenu,
  JSONContent,
  useEditor,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Application, Asset, Frame } from '@shared/types';
import { useContext, useEffect } from 'react';
import css from './FrameTipTap.module.scss';
import { ImageUploadButton } from '../../atoms/ImageUploadButton/ImageUploadButton.tsx';
import { ImageManager } from '../ImageManager/ImageManager.tsx';
import { AppContext } from '../../../stores/AppContext.ts';
import { observer } from 'mobx-react-lite';
import { CustomImage } from '../../custom_tiptap_components/CustomImage/CustomImage.tsx';
import { Flex, IconButton } from '@shared/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// define your extension array
const extensions = [StarterKit, CustomImage];

interface FrameTipTapProps {
  frame: Frame;
  onUpdate: (content: JSONContent) => void;
  application: Application;
}

export const FrameTipTap = observer(
  ({ frame, onUpdate, application }: FrameTipTapProps) => {
    const { DrystoneStore } = useContext(AppContext);

    const editor = useEditor({
      extensions,
      content: frame.nodes,
    });

    useEffect(() => {
      onUpdate(editor?.getJSON() ?? []);
    }, [editor?.state.doc.content]);

    useEffect(() => {
      setTimeout(() => {
        editor?.commands.setContent(frame.nodes);
      });
    }, [frame.id]);

    const handleImageSelect = (image: Asset) => {
      if (editor) {
        // @ts-ignore
        editor.chain().focus().insertImage(image.id, image.applicationId).run();
      }
    };

    if (!editor) {
      return <></>;
    }

    return (
      <>
        <EditorContent editor={editor} className={css.editor} />
        <FloatingMenu editor={editor}>
          <div className={css.floatingMenu}>
            <Flex className={css.flex}>
              <IconButton
                onClick={() =>
                  editor?.chain().focus().toggleHeading({ level: 1 }).run()
                }
                isActive={editor.isActive('heading', { level: 1 })}
              >
                <FontAwesomeIcon icon={['fas', 'heading']} />
              </IconButton>
              <IconButton
                onClick={() =>
                  editor?.chain().focus().toggleHeading({ level: 2 }).run()
                }
                isActive={editor.isActive('heading', { level: 2 })}
              >
                <FontAwesomeIcon icon={['fas', 'heading']} />2
              </IconButton>
              <IconButton
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
              >
                <FontAwesomeIcon icon={['fas', 'list']} />
              </IconButton>
              <ImageUploadButton />
            </Flex>
          </div>
        </FloatingMenu>
        <BubbleMenu editor={editor}>&nbsp;</BubbleMenu>
        {DrystoneStore.imageManagerOpen && (
          <ImageManager
            onImageSelect={handleImageSelect}
            application={application}
          />
        )}
      </>
    );
  },
);
