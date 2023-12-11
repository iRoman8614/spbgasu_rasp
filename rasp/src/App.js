import './App.scss';
import Main from "./pages/Main";
import {HashRouter} from "react-router-dom";

function App() {
    return (
        <HashRouter>
            <Main />
        </HashRouter>
    );
}

export default App;
