import './App.css';
import {Layout} from "./components/Layout/Layout";
import { Routes, Route } from "react-router-dom"
import Search from "./pages/Search";
import Room from "./pages/Room";
import Teacher from "./pages/Teacher";

function App() {
  return (
    <Layout>
        <Routes>
            <Route path={'/'} element={<Search />} />
            <Route path={'/Room'} element={<Room />} />
            <Route path={'/Teacher'} element={<Teacher />} />
        </Routes>
    </Layout>
  );
}

export default App;
