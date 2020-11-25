import {
  EditorState,
  EditorStateContainer,
  EditorStateUtils,
} from "./EditorState";
import { InputListener, InputView } from "./InputView";

export class MainView {
  selectionStartNode: Text;
  selectionEndNode: Text;
  isEnteringTextNode: Text;
  isSelectingTextNode: Text;
  textNode: Text;
  textCursor = document.createElement("div");

  constructor(private stateContainer: EditorStateContainer) {
    const initialState = this.stateContainer.getState();
    const strigifiedInitialState = new EditorStateUtils(
      initialState
    ).stringifyFields();

    this.selectionStartNode = document.createTextNode(
      strigifiedInitialState.selection.start
    );
    this.selectionEndNode = document.createTextNode(
      strigifiedInitialState.selection.end
    );
    this.isEnteringTextNode = document.createTextNode(
      strigifiedInitialState.isEnteringText
    );
    this.isSelectingTextNode = document.createTextNode(
      strigifiedInitialState.isSelectingText
    );
    this.textNode = document.createTextNode(initialState.text);
  }

  initialize(): HTMLElement {
    const mainDiv = document.createElement("div");
    const editorDiv = document.createElement("div");
    const selectionStartDiv = document.createElement("div");
    const selectionEndDiv = document.createElement("div");
    const isEnteringTextDiv = document.createElement("div");
    const isSelectingTextDiv = document.createElement("div");

    this.textCursor.style.position = "absolute";
    this.textCursor.style.left = "8px";
    this.textCursor.style.top = "9px";
    this.textCursor.style.height = "15px";
    this.textCursor.style.width = "1px";
    this.textCursor.style.backgroundColor = "black";

    const textSpan = document.createElement("span");
    textSpan.appendChild(this.textNode);

    editorDiv.appendChild(textSpan);
    selectionStartDiv.appendChild(document.createTextNode("selection start: "));
    selectionEndDiv.appendChild(document.createTextNode("selection end: "));
    isEnteringTextDiv.appendChild(document.createTextNode("isEnteringText: "));
    isSelectingTextDiv.appendChild(
      document.createTextNode("isSelectingText: ")
    );

    selectionStartDiv.appendChild(this.selectionStartNode);
    selectionEndDiv.appendChild(this.selectionEndNode);
    isEnteringTextDiv.appendChild(this.isEnteringTextNode);
    isSelectingTextDiv.appendChild(this.isSelectingTextNode);

    const inputListener = new InputListener(this.stateContainer, this);
    const inputView = new InputView(inputListener);

    const form = document.createElement("form");
    form.action = "";

    form.appendChild(inputView.initialize());

    mainDiv.appendChild(this.textCursor);
    mainDiv.appendChild(editorDiv);
    mainDiv.appendChild(selectionStartDiv);
    mainDiv.appendChild(selectionEndDiv);
    mainDiv.appendChild(isEnteringTextDiv);
    mainDiv.appendChild(isSelectingTextDiv);
    mainDiv.appendChild(form);

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      this.stateContainer.applyStatePreview();
      inputView.setValue("");
    });

    return mainDiv;
  }

  updateNodes(state: EditorState) {
    const strigifiedState = new EditorStateUtils(state).stringifyFields();

    if (this.textNode.nodeValue !== state.text) {
      this.textNode.nodeValue = state.text;
    }
    if (this.selectionStartNode.nodeValue !== strigifiedState.selection.start) {
      this.selectionStartNode.nodeValue = strigifiedState.selection.start;
    }
    if (this.selectionEndNode.nodeValue !== strigifiedState.selection.end) {
      this.selectionEndNode.nodeValue = strigifiedState.selection.end;
    }
    if (this.isEnteringTextNode.nodeValue !== strigifiedState.isEnteringText) {
      this.isEnteringTextNode.nodeValue = strigifiedState.isEnteringText;
    }
    if (
      this.isSelectingTextNode.nodeValue !== strigifiedState.isSelectingText
    ) {
      this.isSelectingTextNode.nodeValue = strigifiedState.isSelectingText;
    }

    const range = document.createRange();
    range.setStart(this.textNode, state.selection.start);
    range.setEnd(
      this.textNode,
      state.selection.end === state.text.length
        ? state.selection.start
        : state.selection.start + 1
    );

    const rects = range.getClientRects();
    this.textCursor.style.left =
      state.selection.end === state.text.length
        ? rects[0].right + "px"
        : rects[0].left + "px";
  }
}
