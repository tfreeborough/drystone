import {BubbleMenu, EditorContent, EditorProvider, FloatingMenu, JSONContent, useEditor} from "@tiptap/react";
import StarterKit from '@tiptap/starter-kit'
import {Frame} from "../../../types/application.types.ts";
import {useEffect} from "react";

// define your extension array
const extensions = [StarterKit]

const content = '<p>Foo</p>'

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

  return (
    <>
      <EditorContent editor={editor} />
      <FloatingMenu editor={editor}>This is the floating menu</FloatingMenu>
      <BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu>
    </>
  )
}

export default FrameTipTap;
