import { Node } from '@tiptap/core';
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import { CustomImageLoader } from '@shared/components';

const ImageComponent = ({ node }: any) => {
  return (
    <NodeViewWrapper>
      <CustomImageLoader node={node} />
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
      applicationId: {
        default: null,
      },
    };
  },

  addKeyboardShortcuts() {
    return {
      ArrowUp: () => this.editor?.commands.focus('before' as any),
      ArrowDown: () => this.editor?.commands.focus('after' as any),
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
        'data-image-application-id': HTMLAttributes.applicationId,
      },
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageComponent);
  },

  addCommands(): any {
    return {
      insertImage:
        (id: string, applicationId: string) =>
        ({ commands }: any) => {
          return commands.insertContent({
            type: this.name,
            attrs: { id, applicationId },
          });
        },
    };
  },
});
