import { Tiptap2React } from "@shared/components";
import { Frame as FrameType } from "@shared/types";
import { useEffect, useRef } from "react";

interface FrameProps {
  frame: FrameType;
  onAnimationCompleted: () => void;
}

export const Frame = ({ frame, onAnimationCompleted }: FrameProps) => {
  const frameRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (frameRef.current) {
      console.log("scrolling frame into view");
      frameRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start", // 'start', 'center', or 'end'
      });
    }
  }, []);

  return (
    <div ref={frameRef}>
      <Tiptap2React
        nodes={frame.nodes}
        onAnimationComplete={onAnimationCompleted}
      />
    </div>
  );
};
