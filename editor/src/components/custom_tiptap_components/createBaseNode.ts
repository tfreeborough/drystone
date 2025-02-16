import { Node } from '@tiptap/core';

export const createBaseNode = (name: string, tag: string, group = 'block') => {
  return Node.create({
    name,
    group,
    content: 'inline*',
    selectable: true,
    parseHTML() {
      return [{ tag }];
    },
    renderHTML() {
      return [tag, 0];
    },
  });
};
