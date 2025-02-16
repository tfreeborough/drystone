import { Mark } from '@tiptap/core';
import css from './DynamicVariable.module.scss';

export const DynamicVariable = Mark.create({
  name: 'dynamicVariable',
  keepOnSplit: false,

  addAttributes() {
    return {
      name: {
        default: null,
      },
      id: {
        default: null,
      },
    };
  },

  addCommands() {
    return {
      removeEntireVariable:
        () =>
        ({ tr, state }) => {
          const { selection } = state;
          const { $from, $to } = selection;

          // Find start and end of the marked text
          let start = $from.pos;
          let end = $to.pos;

          state.doc.nodesBetween($from.pos, $to.pos, (node, pos) => {
            if (node.marks.some(mark => mark.type === this.type)) {
              start = Math.min(start, pos);
              end = Math.max(end, pos + node.nodeSize);
            }
          });

          tr.delete(start, end);
          return true;
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      Backspace: ({ editor }) => {
        const { selection } = editor.state;
        const { $from } = selection;

        // Check if current selection has our mark
        const hasDynamicMark = $from
          .marks()
          .some(mark => mark.type.name === 'dynamicVariable');

        if (hasDynamicMark) {
          // If we have the mark, remove the entire variable
          return editor.commands.removeEntireVariable();
        }

        // Otherwise, let normal backspace behavior continue
        return false;
      },
      Delete: ({ editor }) => {
        // Same logic as Backspace
        const { selection } = editor.state;
        const { $from } = selection;

        const hasDynamicMark = $from
          .marks()
          .some(mark => mark.type.name === 'dynamicVariable');

        if (hasDynamicMark) {
          return editor.commands.removeEntireVariable();
        }

        return false;
      },
      Space: ({ editor }) => {
        const { selection } = editor.state;
        const { $from } = selection;

        // Check if we're in a dynamic variable mark
        const hasDynamicMark = $from
          .marks()
          .some(mark => mark.type.name === 'dynamicVariable');

        if (hasDynamicMark) {
          // Remove the mark and insert the space
          editor.chain().unsetMark('dynamicVariable').insertContent(' ').run();
          return true;
        }

        return false;
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-variable-name]',
        getAttrs: element => ({
          name: element.getAttribute('data-variable-name'),
        }),
      },
      {
        tag: 'span[data-variable-id]',
        getAttrs: element => ({
          id: element.getAttribute('data-variable-id'),
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      {
        ...HTMLAttributes,
        'data-variable-name': HTMLAttributes.name,
        'data-variable-id': HTMLAttributes.id,
        class: css.dynamicVariable,
      },
      0,
    ];
  },
});
