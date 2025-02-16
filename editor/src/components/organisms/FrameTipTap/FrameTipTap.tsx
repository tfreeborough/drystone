import {
  BubbleMenu,
  EditorContent,
  FloatingMenu,
  JSONContent,
  useEditor,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Application,
  Asset,
  Condition,
  EditorEvents,
  Frame,
} from '@shared/types';
import { useContext, useEffect } from 'react';
import css from './FrameTipTap.module.scss';
import { observer } from 'mobx-react-lite';
import { CustomImage } from '../../custom_tiptap_components/CustomImage/CustomImage.tsx';
import { Flex, IconButton, ModalContext, ModalType } from '@shared/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ConditionalWrapper } from '../../custom_tiptap_components/ConditionalWrapper/ConditionalWrapper.tsx';
import { CreateConditionalWrapperModal } from '../CreateConditionalWrapperModal/CreateConditionalWrapperModal.tsx';
import { ImageManagerModal } from '../ImageManagerModal/ImageManagerModal.tsx';
import venti from 'venti-js';
import { Gapcursor } from '@tiptap/extension-gapcursor';

// define your extension array
const extensions = [StarterKit, ConditionalWrapper, CustomImage, Gapcursor];

interface FrameTipTapProps {
  frame: Frame;
  onUpdate: (content: JSONContent) => void;
  application: Application;
}

export const FrameTipTap = observer(
  ({ frame, onUpdate, application }: FrameTipTapProps) => {
    const { addModal } = useContext(ModalContext);

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

      venti.on(
        EditorEvents.INSERT_CONDITIONAL_WRAPPER,
        handleInsertConditionWrapper,
      );

      venti.on(
        EditorEvents.UPDATE_CONDITIONAL_WRAPPER,
        handleUpdateConditionWrapper,
      );

      return () => {
        venti.off(
          EditorEvents.INSERT_CONDITIONAL_WRAPPER,
          handleInsertConditionWrapper,
        );

        venti.off(
          EditorEvents.UPDATE_CONDITIONAL_WRAPPER,
          handleUpdateConditionWrapper,
        );
      };
    }, [frame.id]);

    const handleImageSelect = (image: Asset) => {
      if (editor) {
        // @ts-ignore
        editor.chain().focus().insertImage(image.id, image.applicationId).run();
      }
    };

    function handleOpenConditionalWrapperModal(
      event: React.MouseEvent<HTMLButtonElement>,
    ) {
      addModal({
        id: 'conditional-wrapper-modal',
        event,
        type: ModalType.NORMAL,
        content: <CreateConditionalWrapperModal />,
        extra: {
          application,
        },
      });
    }

    const handleOpenImageManager = (
      event: React.MouseEvent<HTMLButtonElement>,
    ) => {
      addModal({
        id: 'image-manager-modal',
        event,
        type: ModalType.NORMAL,
        content: <ImageManagerModal />,
        extra: {
          application,
          onImageSelect: handleImageSelect,
        },
      });
    };

    const handleInsertConditionWrapper = ({
      content,
      conditions,
    }: {
      content: JSONContent;
      conditions: Condition[];
    }) => {
      if (editor) {
        // @ts-ignore
        editor
          .chain()
          .focus()
          .insertConditionalWrapper(content, conditions, application)
          .run();
      }
    };

    const handleUpdateConditionWrapper = ({
      id,
      content,
      conditions,
    }: {
      id: string;
      content: JSONContent;
      conditions: Condition[];
    }) => {
      if (editor) {
        console.log('updating conditional wrapper', id);
        // @ts-ignore
        editor
          .chain()
          .focus()
          .updateConditionalWrapper(id, content, conditions, application)
          .run();
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
              <IconButton
                className={css.conditions}
                isActive={editor.isActive('conditionalWrapper')}
                onClick={handleOpenConditionalWrapperModal}
              >
                <FontAwesomeIcon
                  icon={['fas', 'filter']}
                  title="Add conditions"
                />
              </IconButton>
              <IconButton onClick={handleOpenImageManager}>
                <FontAwesomeIcon icon={['fas', 'image']} />
              </IconButton>
            </Flex>
          </div>
        </FloatingMenu>
        <BubbleMenu editor={editor}>
          <div className={css.bubbleMenu}>
            <Flex className={css.flex}>
              <IconButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
              >
                <FontAwesomeIcon icon={['fas', 'bold']} />
              </IconButton>
              <IconButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
              >
                <FontAwesomeIcon icon={['fas', 'italic']} />
              </IconButton>
              <IconButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                isActive={editor.isActive('strike')}
              >
                <FontAwesomeIcon icon={['fas', 'strikethrough']} />
              </IconButton>
            </Flex>
          </div>
        </BubbleMenu>
      </>
    );
  },
);
