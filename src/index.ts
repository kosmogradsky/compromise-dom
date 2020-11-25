import { EditorStateContainer } from "./EditorState";
import { MainView } from "./MainView";

const stateContainer = new EditorStateContainer();
const mainView = new MainView(stateContainer);

const mainEl = mainView.initialize();

document.body.appendChild(mainEl);
