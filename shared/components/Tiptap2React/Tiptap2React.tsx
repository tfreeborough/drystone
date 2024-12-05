import { JSONContent } from "@tiptap/react";
import { Container } from "react-effect-typewriter";
import css from "./Tiptap2React.module.scss";
import { FadeIn } from "../../animations";

const renderNode = (node: JSONContent, index: number) => {
  const fadeDelay = 0.5;
  switch (node.type) {
    case "paragraph":
      return (
        <FadeIn key={index} delay={index * fadeDelay}>
          <p className={css.paragraph}>
            {node.content?.map((child, i) => renderNode(child, i))}
          </p>
        </FadeIn>
      );
    case "heading":
      const Tag = `h${node.attrs?.level}` as keyof JSX.IntrinsicElements;
      return (
        <FadeIn key={index} delay={index * fadeDelay}>
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
        <FadeIn key={index} delay={index * fadeDelay}>
          <ul>{node.content?.map((child, i) => renderNode(child, i))}</ul>
        </FadeIn>
      );
    case "orderedList":
      return (
        <FadeIn key={index} delay={index * fadeDelay}>
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
    default:
      return null;
  }
};

interface Tiptap2ReactProps {
  nodes: JSONContent;
}

export function Tiptap2React({ nodes }: Tiptap2ReactProps) {
  if (nodes.content && nodes.content.length > 0) {
    return (
      <div>
        <Container typingSpeed={20}>
          {nodes.content.map((node, index) => renderNode(node, index))}
        </Container>
      </div>
    );
  }
  return (
    <div>
      <Container enableLogs>{renderNode(nodes, 0)}</Container>
    </div>
  );
}
