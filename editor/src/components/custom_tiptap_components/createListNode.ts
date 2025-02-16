import { Node } from '@tiptap/core';

export const createListNode = (name: string, tag: string) => {
  return Node.create({
    name,
    group: 'block',
    content: 'listItem+',
    selectable: true,
    parseHTML() {
      return [{ tag }];
    },
    renderHTML() {
      return [tag, 0];
    },
  });
};
