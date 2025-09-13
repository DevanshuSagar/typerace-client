import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";

function App() {
    return (
        <div className="bg-gray-100 min-h-screen text-gray-800">
            <NavBar />
            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default App;
