import { ApplicationVariable } from "./application.types";

export interface PlayerState {
  started: boolean;
  position: string;
  history: string[];
  variables: ApplicationVariable[];
}
