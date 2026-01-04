// MyContextProvider.js
import { createContext, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import userStore, { BASE_URL } from "./MyStore";

export const MyContext = createContext();

const MyContextProvider = ({ children }) => {
  const {userModelID} = userStore()
  const [registered, setRegistered] = useState(false);
  const [socket, setSocket] = useState(null); 
  const socketRef = useRef(null);

  useEffect(() => {
    
    const newSocket = io(`${BASE_URL}`, {
      transports: ["websocket"],
      autoConnect: true,
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to socket:", newSocket.id);
      newSocket.emit("register", userModelID);

      setRegistered(true); 
    });

    newSocket.on("connect_error", (err) => {
      console.log("Socket connect error:", err.message);
      setRegistered(false);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from socket");
      setRegistered(false);
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []); 

  const value = {
    registered,
    setRegistered,
    socket, 
  };

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
};

export default MyContextProvider;