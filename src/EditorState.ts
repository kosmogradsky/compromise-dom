import { TextSelection } from "./TextSelection";

export interface EditorState {
  selection: TextSelection;
  isSelectingText: boolean;
  isEnteringText: boolean;
  text: string;
}

export class EditorStateUtils {
  constructor(private state: EditorState) {}

  stringifyFields() {
    return {
      selection: {
        start: this.state.selection.start.toString(),
        end: this.state.selection.end.toString(),
      },
      isSelectingText: this.state.isSelectingText ? "true" : "false",
      isEnteringText: this.state.isEnteringText ? "true" : "false",
    };
  }
}

export class EditorStateContainer {
  private state: EditorState = {
    selection: new TextSelection(0, 0),
    text: "the text",
    isEnteringText: false,
    isSelectingText: false,
  };
  private statePreview: EditorState = this.state;

  getState(): EditorState {
    return this.state;
  }

  setStatePreview(state: EditorState) {
    this.statePreview = state;
  }

  applyStatePreview() {
    this.state = this.statePreview;
  }
}
