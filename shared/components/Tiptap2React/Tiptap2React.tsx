import { JSONContent } from "@tiptap/react";
import css from "./Tiptap2React.module.scss";
import { FadeIn } from "../../animations";
import { CustomImageLoader } from "../CustomImageLoader/CustomImageLoader";
import { Mark } from "../../types";
import { ConditionalWrapperLoader } from "../../../player/src/components/organisms/ConditionalWrapperLoader/ConditionalWrapperLoader";
import { DynamicVariable } from "../DynamicVariable/DynamicVariable";

const FADE_DELAY = 0.3;

const applyMarks = (
  text: string | JSX.Element = "",
  marks?: Mark[],
  inEditor: boolean = false,
) => {
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
      case "dynamicVariable":
        return (
          <DynamicVariable
            name={mark.attrs?.name}
            id={mark.attrs?.id}
            inEditor={inEditor}
          />
        );
      default:
        return text;
    }
  })();

  return applyMarks(element, marks.slice(1), inEditor);
};

const renderNode = (
  node: JSONContent,
  index: number,
  options?: {
    lastNode?: boolean;
    onAnimationComplete?: () => void;
    fadeDelay?: number;
    inEditor?: boolean;
  },
) => {
  const lastNode = options?.lastNode ?? false;
  const fadeDelay = options?.fadeDelay ?? FADE_DELAY;
  const inEditor = options?.inEditor ?? false;
  const onAnimationComplete = options?.onAnimationComplete ?? null;
  function handleAnimationEnd() {
    if (lastNode && onAnimationComplete) {
      onAnimationComplete();
    } else {
      console.log("went to end animation - last node", lastNode);
      console.log(
        "went to end animation - onAnimationComplete",
        onAnimationComplete,
      );
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
            {node.content?.map((child, i) =>
              renderNode(child, i, { inEditor }),
            )}
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
            {node.content?.map((child, i) =>
              renderNode(child, i, { inEditor }),
            )}
          </Tag>
        </FadeIn>
      );
    case "text":
      return (
        <span key={index}>{applyMarks(node.text, node.marks, inEditor)}</span>
      );
    case "bulletList":
      return (
        <FadeIn
          key={index}
          delay={index * fadeDelay}
          onAnimationComplete={handleAnimationEnd}
        >
          <ul>
            {node.content?.map((child, i) =>
              renderNode(child, i, { inEditor }),
            )}
          </ul>
        </FadeIn>
      );
    case "orderedList":
      return (
        <FadeIn
          key={index}
          delay={index * fadeDelay}
          onAnimationComplete={handleAnimationEnd}
        >
          <ol>
            {node.content?.map((child, i) =>
              renderNode(child, i, { inEditor }),
            )}
          </ol>
        </FadeIn>
      );
    case "listItem":
      return (
        <li key={index}>
          {node.content?.map((child, i) => renderNode(child, i, { inEditor }))}
        </li>
      );
    case "blockquote":
      return (
        <blockquote key={index}>
          {node.content?.map((child, i) => renderNode(child, i, { inEditor }))}
        </blockquote>
      );
    case "code":
      return (
        <pre key={index}>
          <code>
            {node.content?.map((child, i) =>
              renderNode(child, i, { inEditor }),
            )}
          </code>
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
          console.log("rendering node", node);
          return renderNode(node, index, {
            lastNode: isLastNode,
            onAnimationComplete: handleAnimationEnd,
            fadeDelay,
            inEditor,
          });
        })}
      </div>
    );
  }

  console.log("rendering node", nodes);

  return (
    <div className={css.content}>
      {renderNode(nodes, 0, {
        inEditor,
      })}
    </div>
  );
}
