import {JSONContent} from "@tiptap/react";


export interface Application {
  id: string,
  type: "application",
  name: string,
  description: string,
  scenes: Scene[],
  stagePosition?: { x: number, y: number },
  stageScale?: number,
}

export interface SceneMetadata {
  note?: string,
  canvasBackground?: string,
}

export interface Scene {
  id: string,
  type: "scene",
  metadata: SceneMetadata,
  frames: Frame[]
  position: { x: number, y: number }
}

export interface Frame {
  id: string,
  type: "frame",
  nodes: JSONContent,
}

export interface Node {
  id: string,
  content: never,
}
