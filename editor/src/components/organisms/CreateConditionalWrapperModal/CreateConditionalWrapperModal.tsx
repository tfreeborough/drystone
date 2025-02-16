import Heading from '../../atoms/Heading/Heading.tsx';
import css from './CreateConditionalWrapperModal.module.scss';
import Muted from '../../atoms/Muted/Muted.tsx';
import {
  BubbleMenu,
  EditorContent,
  FloatingMenu,
  useEditor,
} from '@tiptap/react';
import { Fragment, useContext, useEffect, useState } from 'react';
import StarterKit from '@tiptap/starter-kit';
import { CustomImage } from '../../custom_tiptap_components/CustomImage/CustomImage.tsx';
import {
  Align,
  Application,
  Asset,
  Condition,
  EditorEvents,
  FlexDirection,
  Gap,
  JSONContent,
} from '@shared/types';
import {
  Button,
  Flex,
  IconButton,
  ModalContext,
  ModalType,
  ToggleBox,
} from '@shared/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observer } from 'mobx-react-lite';
import { ImageManagerModal } from '../ImageManagerModal/ImageManagerModal.tsx';
import { AddConditionForm } from '../../molecules/AddConditionForm/AddConditionForm.tsx';
import Label from '../../atoms/Label/Label.tsx';
import { ConditionDisplay } from '../../atoms/ConditionDisplay/ConditionDisplay.tsx';
import venti from 'venti-js';
import { DynamicVariable } from '../../custom_tiptap_marks/DynamicVariable/DynamicVariable.tsx';

interface CreateConditionalWrapperModalProps {
  extra?: {
    id?: string;
    nodes?: JSONContent;
    conditions?: Condition[];
    application: Application;
  };
}

const extensions = [StarterKit, CustomImage, DynamicVariable];

export const CreateConditionalWrapperModal = observer(
  ({ extra }: CreateConditionalWrapperModalProps) => {
    const { addModal } = useContext(ModalContext);

    const [isNew] = useState<boolean>(extra?.id === undefined);
    const [addNewCondition, setAddNewCondition] = useState(false);
    const [conditions, setConditions] = useState<Condition[]>(
      extra?.conditions || [],
    );
    const [content, setContent] = useState<JSONContent | undefined>();

    const editor = useEditor({
      extensions,
      content: extra?.nodes,
    });

    useEffect(() => {
      setContent(editor?.getJSON());
    }, [editor?.state.doc.content]);

    const handleImageSelect = (image: Asset) => {
      if (editor) {
        // @ts-ignore
        editor.chain().focus().insertImage(image.id, image.applicationId).run();
      }
    };

    const handleOpenImageManager = (
      event: React.MouseEvent<HTMLButtonElement>,
    ) => {
      addModal({
        id: 'image-manager-modal',
        event,
        type: ModalType.NORMAL,
        content: <ImageManagerModal />,
        extra: {
          application: extra?.application,
          onImageSelect: handleImageSelect,
        },
      });
    };

    function handleAddCondition(condition: Condition) {
      setConditions([...conditions, condition]);
      setAddNewCondition(false);
    }

    function handleDeleteCondition(id: string) {
      setConditions(conditions.filter(c => c.id !== id));
    }

    function handleSave() {
      if (isNew) {
        venti.trigger(EditorEvents.INSERT_CONDITIONAL_WRAPPER, {
          content,
          conditions,
        });
      } else {
        venti.trigger(EditorEvents.UPDATE_CONDITIONAL_WRAPPER, {
          id: extra?.id,
          content,
          conditions,
        });
      }
    }

    return (
      <div className={css.createConditionalWrapperModal}>
        <Heading>Update a conditional wrapper</Heading>
        <Muted>
          Enter your custom content and choose which conditions to apply for
          this to render.
        </Muted>
        <hr />
        <EditorContent editor={editor} className={css.editor} />
        {editor && (
          <>
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
                    onClick={() =>
                      editor?.chain().focus().toggleBulletList().run()
                    }
                    isActive={editor.isActive('bulletList')}
                  >
                    <FontAwesomeIcon icon={['fas', 'list']} />
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
        )}
        <hr />
        <Flex
          flexDirection={FlexDirection.COLUMN}
          gap={Gap.XS}
          alignItems={Align.STRETCH}
        >
          <Flex
            className={css.conditions}
            alignItems={Align.STRETCH}
            flexDirection={FlexDirection.COLUMN}
            gap={Gap.XS}
          >
            {conditions.length === 0 && (
              <Muted>You have no added any conditions yet.</Muted>
            )}
            {conditions.length > 0 && (
              <Label>Only render this content IF</Label>
            )}
            {conditions.map((condition, index) => {
              const isLast = index === conditions.length - 1;
              return (
                <Fragment key={condition.id}>
                  <ConditionDisplay
                    condition={condition}
                    onDelete={handleDeleteCondition}
                  />
                  {!isLast && <Muted>AND</Muted>}
                </Fragment>
              );
            })}
          </Flex>
          <ToggleBox
            title="Add new condition"
            value={addNewCondition}
            onToggle={value => setAddNewCondition(value)}
          >
            <AddConditionForm onAdd={handleAddCondition} />
          </ToggleBox>
          <Button className={css.save} onClick={handleSave}>
            Save
          </Button>
        </Flex>
      </div>
    );
  },
);
