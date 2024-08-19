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
}

export interface Scene {
  id: string,
  type: "scene",
  metadata: SceneMetadata,
  frames: Frame[]
  position: { x: number, y: number }
  choices: Choice[],
}

export interface Frame {
  id: string,
  type: "frame",
  nodes: JSONContent,
}

export interface Choice {
  id: string,
  type: "choice",
  label: string,
  target: string,
}

export interface Node {
  id: string,
  content: never,
}
