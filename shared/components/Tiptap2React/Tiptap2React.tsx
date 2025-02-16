import { JSONContent } from "@tiptap/react";
import css from "./Tiptap2React.module.scss";
import { FadeIn } from "../../animations";
import { CustomImageLoader } from "../CustomImageLoader/CustomImageLoader";
import { Mark } from "../../types";
import { ConditionalWrapperLoader } from "../../../player/src/components/organisms/ConditionalWrapperLoader/ConditionalWrapperLoader";

const FADE_DELAY = 0.3;

const applyMarks = (text: string | JSX.Element = "", marks?: Mark[]) => {
  if (!marks?.length) return text;

  const mark = marks[0];
  const element = (() => {
    switch (mark.type) {
      case "bold":
        return <strong>{text}</strong>;
      case "italic":
        return <em>{text}</em>;
      case "strike":
        return <s>{text}</s>;
      case "underline":
        return <u>{text}</u>;
      default:
        return text;
    }
  })();

  return applyMarks(element, marks.slice(1));
};

const renderNode = (
  node: JSONContent,
  index: number,
  lastNode: boolean = false,
  onAnimationComplete?: () => void,
  fadeDelay: number = FADE_DELAY,
  inEditor: boolean = false,
) => {
  function handleAnimationEnd() {
    if (lastNode && onAnimationComplete) {
      onAnimationComplete();
    }
  }

  switch (node.type) {
    case "paragraph":
      return (
        <FadeIn
          key={index}
          delay={index * fadeDelay}
          onAnimationComplete={handleAnimationEnd}
        >
          <p className={css.paragraph}>
            {node.content?.map((child, i) => renderNode(child, i))}
          </p>
        </FadeIn>
      );
    case "heading":
      const Tag = `h${node.attrs?.level}` as keyof JSX.IntrinsicElements;
      return (
        <FadeIn
          key={index}
          delay={index * fadeDelay}
          onAnimationComplete={handleAnimationEnd}
        >
          <Tag className={`${css.heading}`}>
            {node.content?.map((child, i) => renderNode(child, i))}
          </Tag>
        </FadeIn>
      );
    case "text":
      return <span key={index}>{applyMarks(node.text, node.marks)}</span>;
    case "bulletList":
      return (
        <FadeIn
          key={index}
          delay={index * fadeDelay}
          onAnimationComplete={handleAnimationEnd}
        >
          <ul>{node.content?.map((child, i) => renderNode(child, i))}</ul>
        </FadeIn>
      );
    case "orderedList":
      return (
        <FadeIn
          key={index}
          delay={index * fadeDelay}
          onAnimationComplete={handleAnimationEnd}
        >
          <ol>{node.content?.map((child, i) => renderNode(child, i))}</ol>
        </FadeIn>
      );
    case "listItem":
      return (
        <li key={index}>
          {node.content?.map((child, i) => renderNode(child, i))}
        </li>
      );
    case "blockquote":
      return (
        <blockquote key={index}>
          {node.content?.map((child, i) => renderNode(child, i))}
        </blockquote>
      );
    case "code":
      return (
        <pre key={index}>
          <code>{node.content?.map((child, i) => renderNode(child, i))}</code>
        </pre>
      );
    case "hardBreak":
      return <br key={index} />;
    case "customImage":
      return (
        <FadeIn
          key={index}
          delay={index * fadeDelay}
          onAnimationComplete={handleAnimationEnd}
        >
          <CustomImageLoader key={index} node={node} />
        </FadeIn>
      );
    case "conditionalWrapper":
      const { content, conditions } = node.attrs as any;
      return (
        <FadeIn
          key={index}
          delay={index * fadeDelay}
          onAnimationComplete={handleAnimationEnd}
        >
          {inEditor ? (
            <Tiptap2React nodes={node.attrs?.content} inEditor={inEditor} />
          ) : (
            <ConditionalWrapperLoader
              content={content}
              conditions={conditions}
            />
          )}
        </FadeIn>
      );
    default:
      return null;
  }
};

interface Tiptap2ReactProps {
  nodes: JSONContent;
  onAnimationComplete?: () => void;
  fadeDelay?: number;
  inEditor?: boolean;
}

export function Tiptap2React({
  nodes,
  onAnimationComplete,
  fadeDelay = FADE_DELAY,
  inEditor = false,
}: Tiptap2ReactProps) {
  function handleAnimationEnd() {
    if (onAnimationComplete) {
      onAnimationComplete();
    }
  }

  if (nodes.content && nodes.content.length > 0) {
    const content = nodes.content;
    return (
      <div className={css.content}>
        {content.map((node, index) => {
          const isLastNode = index + 1 === content.length;
          return renderNode(
            node,
            index,
            isLastNode,
            handleAnimationEnd,
            fadeDelay,
            inEditor,
          );
        })}
      </div>
    );
  }
  return <div className={css.content}>{renderNode(nodes, 0)}</div>;
}
