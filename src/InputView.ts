import { CommandParser } from "./CommandParser";
import { EditorStateContainer, EditorState } from "./EditorState";

export class InputView {
  private input = document.createElement("input");

  constructor(
    private eventListener: { handleEvent(inputValue: string): void }
  ) {}

  initialize(): HTMLElement {
    this.input.type = "text";

    this.input.addEventListener("input", () => {
      this.eventListener.handleEvent(this.input.value);
    });

    return this.input;
  }

  setValue(value: string) {
    this.input.value = value;
  }
}

export class InputListener {
  constructor(
    private stateContainer: EditorStateContainer,
    private nodeUpdater: { updateNodes(state: EditorState): void }
  ) {}

  handleEvent(inputValue: string) {
    const state = this.stateContainer.getState();
    const actions = new CommandParser(inputValue, state.isEnteringText).parse();
    const statePreview = actions.reduce(
      (prevState, action) => action.updateState(prevState),
      state
    );
    this.stateContainer.setStatePreview(statePreview);
    this.nodeUpdater.updateNodes(statePreview);
  }
}
