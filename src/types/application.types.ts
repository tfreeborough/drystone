import {JSONContent} from "@tiptap/react";


export interface Application {
  id: string,
  name: string,
  description: string,
  scenes: Scene[],
  stagePosition?: { x: number, y: number },
  stageScale?: number,
}

export interface Scene {
  id: string,
  frames: Frame[]
  position: { x: number, y: number }
}

export interface Frame {
  id: string,
  nodes: JSONContent,
}

export interface Node {
  id: string,
  content: never,
}
