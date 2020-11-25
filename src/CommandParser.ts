import {
  EditorAction,
  goLeft,
  goRight,
  shrinkRightwise,
  widenRightwise,
  deleteLeftwise,
  deleteRightwise,
  switchSelectionMode,
  switchEnteringMode,
  InsertText,
} from "./EditorAction";

export class CommandParser {
  constructor(private commandString: string, private isEnteringText: boolean) {}

  private parseCommand(commandChar: string): EditorAction | null {
    switch (commandChar) {
      case "a":
        return goLeft;
      case "s":
        return goRight;
      case "d":
        return shrinkRightwise;
      case "f":
        return widenRightwise;
      case "z":
        return deleteLeftwise;
      case "x":
        return deleteRightwise;
      case "e":
        return switchSelectionMode;
      case "t":
        return switchEnteringMode;
      default:
        return null;
    }
  }

  private parseCommandChars(): EditorAction[] {
    const commandChars = this.commandString.split("");
    const actions: EditorAction[] = [];

    for (const commandChar of commandChars) {
      const action = this.parseCommand(commandChar);

      if (action !== null) {
        actions.push(action);
      }
    }

    return actions;
  }

  parse(): EditorAction[] {
    if (this.isEnteringText) {
      return [new InsertText(this.commandString)];
    } else {
      return this.parseCommandChars();
    }
  }
}
