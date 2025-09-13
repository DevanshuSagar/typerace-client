import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import AuthProvider from "./context/AuthProvider.jsx";
import SocketProvider from "./context/SocketProvider.jsx";

import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import GamePage from "./pages/GamePage.jsx";
import MultiplayerLobbyPage from "./pages/MultiplayerLobbyPage.jsx";
import MultiplayerGamePage from "./pages/MultiplayerGamePage.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <HomePage />,
            },
            {
                path: "login",
                element: <LoginPage />,
            },
            {
                path: "register",
                element: <RegisterPage />,
            },
            {
                path: "game/single",
                element: <GamePage />,
            },
            {
                path: "game/multiplayer",
                element: <MultiplayerLobbyPage />,
            },
            {
                path: "game/multiplayer/:gameId",
                element: <MultiplayerGamePage />,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AuthProvider>
            <SocketProvider>
                <RouterProvider router={router} />
            </SocketProvider>
        </AuthProvider>
    </React.StrictMode>
);
