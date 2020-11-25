import { EditorState } from "./EditorState";
import { TextSelection } from "./TextSelection";

export interface EditorAction {
  updateState(prevState: EditorState): EditorState;
}

export const widenRightwise = {
  updateSelection(
    prevSelection: TextSelection,
    textLength: number
  ): TextSelection {
    const newSelection = new TextSelection(
      prevSelection.start,
      prevSelection.length + 1
    );

    if (newSelection.end < textLength) {
      return newSelection;
    }

    return prevSelection;
  },
  updateState(prevState: EditorState): EditorState {
    return {
      ...prevState,
      selection: this.updateSelection(
        prevState.selection,
        prevState.text.length
      ),
    };
  },
};

export const shrinkRightwise = {
  updateSelection(prevSelection: TextSelection): TextSelection {
    if (prevSelection.length - 1 >= 0) {
      return new TextSelection(prevSelection.start, prevSelection.length - 1);
    }

    return prevSelection;
  },
  updateState(prevState: EditorState): EditorState {
    return {
      ...prevState,
      selection: this.updateSelection(prevState.selection),
    };
  },
};

export const goLeft = {
  goLeft(prevSelection: TextSelection): TextSelection {
    const position = Math.max(prevSelection.start - 1, 0);

    return new TextSelection(position, 0);
  },
  widenLeftwise(prevSelection: TextSelection): TextSelection {
    const newSelectionStart = prevSelection.start - 1;

    if (newSelectionStart >= 0) {
      return new TextSelection(newSelectionStart, prevSelection.length + 1);
    }

    return prevSelection;
  },
  updateState(prevState: EditorState): EditorState {
    return {
      ...prevState,
      selection: prevState.isSelectingText
        ? this.widenLeftwise(prevState.selection)
        : this.goLeft(prevState.selection),
    };
  },
};

export const goRight = {
  goRight(prevSelection: TextSelection, textLength: number): TextSelection {
    const position = Math.min(prevSelection.end + 1, textLength);

    return new TextSelection(position, 0);
  },
  shrinkLeftwise(prevSelection: TextSelection): TextSelection {
    const newSelectionStart = prevSelection.start + 1;

    if (newSelectionStart <= prevSelection.end) {
      return new TextSelection(newSelectionStart, prevSelection.length - 1);
    }

    return prevSelection;
  },
  updateState(prevState: EditorState): EditorState {
    return {
      ...prevState,
      selection: prevState.isSelectingText
        ? this.shrinkLeftwise(prevState.selection)
        : this.goRight(prevState.selection, prevState.text.length),
    };
  },
};

export const deleteSelection = {
  updateState(prevState: EditorState): EditorState {
    return {
      ...prevState,
      text:
        prevState.text.slice(0, prevState.selection.start) +
        prevState.text.slice(prevState.selection.end),
      selection: new TextSelection(prevState.selection.start, 0),
    };
  },
};

export const deleteLeftwise = {
  deleteLeftwise(prevState: EditorState): EditorState {
    if (prevState.text.length === 1) {
      return {
        ...prevState,
        text: "",
      };
    } else {
      const position = Math.max(prevState.selection.start - 1, 0);

      return {
        ...prevState,
        text:
          prevState.text.slice(0, position) +
          prevState.text.slice(prevState.selection.start),
        selection: new TextSelection(position, 0),
      };
    }
  },
  updateState(prevState: EditorState): EditorState {
    if (prevState.selection.length > 0) {
      return deleteSelection.updateState(prevState);
    }

    return this.deleteLeftwise(prevState);
  },
};

export const deleteRightwise = {
  deleteRightwise(prevState: EditorState): EditorState {
    if (prevState.selection.start === prevState.text.length - 1) {
      return {
        ...prevState,
        text: prevState.text.slice(0, prevState.selection.start),
        selection: new TextSelection(prevState.selection.start - 1, 0),
      };
    } else {
      const position = Math.min(
        prevState.selection.start + 1,
        prevState.text.length - 1
      );
      return {
        ...prevState,
        text:
          prevState.text.slice(0, prevState.selection.start) +
          prevState.text.slice(position),
      };
    }
  },
  updateState(prevState: EditorState): EditorState {
    if (prevState.selection.length > 0) {
      return deleteSelection.updateState(prevState);
    }

    return this.deleteRightwise(prevState);
  },
};

export const switchSelectionMode = {
  updateState(prevState: EditorState): EditorState {
    return {
      ...prevState,
      isSelectingText: !prevState.isSelectingText,
    };
  },
};

export const switchEnteringMode = {
  updateState(prevState: EditorState): EditorState {
    return {
      ...prevState,
      isEnteringText: !prevState.isEnteringText,
    };
  },
};

export class InsertText {
  constructor(private text: string) {}

  updateState(prevState: EditorState): EditorState {
    const position =
      prevState.text.length === 0
        ? this.text.length
        : prevState.selection.start + this.text.length;

    return {
      text:
        prevState.text.slice(0, prevState.selection.start) +
        this.text +
        prevState.text.slice(prevState.selection.end),
      isEnteringText: false,
      isSelectingText: prevState.isSelectingText,
      selection: new TextSelection(position, 0),
    };
  }
}
