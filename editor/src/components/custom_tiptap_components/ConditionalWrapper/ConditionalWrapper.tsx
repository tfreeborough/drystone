import { Node } from '@tiptap/core';
import {
  Command,
  CommandProps,
  NodeViewProps,
  NodeViewWrapper,
  RawCommands,
  ReactNodeViewRenderer,
} from '@tiptap/react';
import css from './ConditionalWrapper.module.scss';
import { Application, Condition, JSONContent } from '@shared/types';
import {
  IconButton,
  ModalContext,
  ModalType,
  Tiptap2React,
} from '@shared/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext } from 'react';
import { CreateConditionalWrapperModal } from '../../organisms/CreateConditionalWrapperModal/CreateConditionalWrapperModal.tsx';

const ConditionalWrapperComponent = ({ node }: NodeViewProps) => {
  const { addModal } = useContext(ModalContext);
  const conditions = node.attrs.conditions;
  const content = node.attrs.content;
  const application = node.attrs.application;

  function handleEditConditionalWrapper(
    event: React.MouseEvent<HTMLButtonElement>,
  ) {
    addModal({
      id: 'conditional-wrapper-modal',
      event,
      type: ModalType.NORMAL,
      content: <CreateConditionalWrapperModal />,
      extra: {
        id: node.attrs.id,
        application,
        nodes: content,
        conditions,
      },
    });
  }

  return (
    <NodeViewWrapper
      className={`${css.conditionalWrapper}`}
      data-node-id={node.attrs.id}
    >
      <IconButton className={css.edit} onClick={handleEditConditionalWrapper}>
        <FontAwesomeIcon icon={['fas', 'pencil']} />
      </IconButton>
      <Tiptap2React nodes={content} inEditor />
    </NodeViewWrapper>
  );
};

export const ConditionalWrapper = Node.create({
  name: 'conditionalWrapper',
  group: 'block',
  content: '(block)*',
  atom: true,
  selectable: true,

  keymap: {
    Enter: () => false,
    Backspace: () => false,
    Delete: () => false,
    Tab: () => false,
    'Shift-Tab': () => false,
    ArrowLeft: () => false,
    ArrowRight: () => false,
    'Mod-a': () => false, // Ctrl/Cmd + A
    'Mod-c': () => false, // Copy
    'Mod-v': () => false, // Paste
    'Mod-x': () => false, // Cut
    'Mod-z': () => false, // Undo
    'Mod-y': () => false, // Redo
  },

  addAttributes() {
    return {
      conditions: {
        default: [],
      },
      content: [],
      application: null,
      id: {
        default: () => crypto.randomUUID(),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="conditional-wrapper"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      { 'data-type': 'conditional-wrapper', ...HTMLAttributes },
      0,
    ];
  },

  addCommands(): Partial<RawCommands> {
    return {
      insertConditionalWrapper:
        (
          content: JSONContent,
          conditions: Condition[],
          application: Application,
        ): Command =>
        ({ commands }: CommandProps): boolean => {
          return commands.insertContent({
            type: this.name,
            attrs: { conditions, content, application },
          });
        },
      updateConditionalWrapper:
        (
          id: string,
          content: JSONContent,
          conditions: Condition[],
          application: Application,
        ): Command =>
        ({ tr }: CommandProps): boolean => {
          let pos = null;
          tr.doc.descendants((node, position) => {
            if (node.attrs.id === id) {
              pos = position;
              return false;
            }
          });

          if (pos === null) return false;

          const node = tr.doc.nodeAt(pos);
          if (!node) return false;

          tr.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            content,
            conditions,
            application,
          });

          return true;
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ConditionalWrapperComponent);
  },
});
