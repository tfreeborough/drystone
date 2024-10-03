
export enum PlayerHistoryTarget {
  CHOICE = 'choice',
  SCENE = 'scene',
  FRAME = 'frame',
}
export enum PlayerAction {
  CHOSE = 'chose',
  VIEWED = 'viewed',
}

export interface PlayerHistory {
  id: string,
  actor: string,
  verb: PlayerAction,
  target: string,
  target_type: PlayerHistoryTarget,
  timestamp: string,
}

export interface PlayerState {
  started: boolean;
  position: string;
  history: PlayerHistory[];
}
