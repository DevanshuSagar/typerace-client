import React, { useState, useEffect, useMemo } from "react";
import { io } from "socket.io-client";
import { SocketContext } from "./SocketContext";

const VITE_SOCKET_URL = import.meta.env.VITE_API_URL.replace("/api", "");

export default function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io(VITE_SOCKET_URL, {});
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    const contextValue = useMemo(() => socket, [socket]);

    return (
        <SocketContext.Provider value={contextValue}>
            {children}
        </SocketContext.Provider>
    );
}
