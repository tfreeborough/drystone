import { JSONContent } from "@tiptap/react";
import css from "./Tiptap2React.module.scss";
import { FadeIn } from "../../animations";
import { CustomImageLoader } from "../CustomImageLoader/CustomImageLoader";

const FADE_DELAY = 0.3;

const renderNode = (
  node: JSONContent,
  index: number,
  lastNode: boolean = false,
  onAnimationComplete?: () => void,
  fadeDelay: number = FADE_DELAY,
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
      const style = {
        fontWeight: node.marks?.find((m) => m.type === "bold")
          ? "bold"
          : "normal",
        fontStyle: node.marks?.find((m) => m.type === "italic")
          ? "italic"
          : "normal",
        textDecoration: node.marks?.find((m) => m.type === "underline")
          ? "underline"
          : "none",
      };
      return (
        <span key={index} style={style}>
          {node.text}
        </span>
      );
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
    default:
      return null;
  }
};

interface Tiptap2ReactProps {
  nodes: JSONContent;
  onAnimationComplete?: () => void;
  fadeDelay?: number;
}

export function Tiptap2React({
  nodes,
  onAnimationComplete,
  fadeDelay = FADE_DELAY,
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
          );
        })}
      </div>
    );
  }
  return <div className={css.content}>{renderNode(nodes, 0)}</div>;
}
