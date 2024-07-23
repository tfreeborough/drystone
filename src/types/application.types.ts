

export interface Application {
  id: string,
  name: string,
  description: string,
  scenes: Scene[]
}

export interface Scene {
  id: string,
  frames: Frame[]
}

export interface Frame {
  id: string,
  nodes: Node[]
}

export interface Node {
  id: string,
  content: never,
}
