import {BubbleMenu, EditorContent, FloatingMenu, JSONContent, useEditor} from "@tiptap/react";
import StarterKit from '@tiptap/starter-kit'
import {Frame} from "../../../types/application.types.ts";
import {useEffect} from "react";
import css from './FrameTipTap.module.scss';

// define your extension array
const extensions = [StarterKit]

interface FrameTipTapProps {
  frame: Frame,
  onUpdate: (content: JSONContent) => void,
}

function FrameTipTap({ frame, onUpdate }: FrameTipTapProps){
  const editor = useEditor({
    extensions,
    content: frame.nodes,
  })

  useEffect(() => {
    onUpdate(editor?.getJSON() ?? [])
  }, [editor?.state.doc.content]);

  useEffect(() => {
    editor?.commands.setContent(frame.nodes);
  }, [frame.id]);

  //console.log(editor?.getJSON());

  if(!editor){
    return <></>
  }

  return (
    <>
      <EditorContent editor={editor} className={css.editor} />
      <FloatingMenu editor={editor}>
        <div className={css.floatingMenu}>
          <button
            onClick={() => editor?.chain().focus().toggleHeading({level: 1}).run()}
            className={editor.isActive('heading', {level: 1}) ? 'is-active' : ''}
          >
            H1
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleHeading({level: 2}).run()}
            className={editor.isActive('heading', {level: 2}) ? 'is-active' : ''}
          >
            H2
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'is-active' : ''}
          >
            Bullet list
          </button>
        </div>
      </FloatingMenu>
      <BubbleMenu editor={editor}>
        <></>
      </BubbleMenu>
    </>
  )
}

export default FrameTipTap;
