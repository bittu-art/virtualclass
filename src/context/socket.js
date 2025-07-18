import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null); // Initialize with null for clarity

function SocketValueContext({ children }) {

    const socketRef = useRef(null);
    const [socket, setSocket] = useState(null);
    const [userData, setUserData] = useState(null);
    const [joinedRoom, setJoinedRoom] = useState(null);
    useEffect(() => {
        const userString = localStorage.getItem("user");
       
        if (userString) {
            try {
                const parsedUser = JSON.parse(userString);
                setUserData(parsedUser);
            } catch (e) {
                console.error("Failed to parse user data from localStorage:", e);
                // Clear invalid data if parsing fails to prevent future errors
                localStorage.removeItem("user");
            }
        }
        
    }, []);

    useEffect(() => {
        const roomString = localStorage.getItem("joinedRoom");
        if (roomString) {
            try {
                const parsedRoom = JSON.parse(roomString);
                setJoinedRoom(parsedRoom);
            } catch (e) {
                console.error("Failed to parse joined room data from localStorage:", e);
                // Clear invalid data if parsing fails to prevent future errors
                localStorage.removeItem("joinedRoom");
            }
        }
    
    
    },
        []); // This effect runs when joinedRoom changes

    // Use state to hold the socket instance



    useEffect(() => {
       console.log('SocketValueContext useEffect triggered with user:',userData?.userId,!socketRef.current,socketRef.current);
        if (userData?.userId && !socketRef.current) {
            console.log('Attempting to connect socket...');

            const newSocket = io('http://localhost:4000/', {
                reconnection: false,
                reconnectionAttempts: 0,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
                timeout: 20000,
                // You might want to add auth headers here if needed for authentication
                // auth: {
                //   token: localStorage.getItem("token") // Example of sending token
                // }
            });

            socketRef.current = newSocket; // Store the socket instance in the ref
            setSocket(newSocket); // Update the state with the new socket

            if( joinedRoom) {
                newSocket.emit('joinclassbyId',joinedRoom)
            }

            // Emit setUserId when the socket connects
            newSocket.on('connect', () => {
                console.log('Socket connected!');

            });



            // Handle disconnection
            newSocket.on('disconnect', (reason) => {
                console.log('Socket disconnected:', reason);
            });

            // Handle connection errors
            newSocket.on('connect_error', (error) => {
                console.error('Socket connection error:', error);
            });

            // Cleanup function to close the socket when the component unmounts
            return () => {
                console.log('Disconnecting socket...');
                newSocket.disconnect();
                socketRef.current = null;
                setSocket(null);
            };
        }
        else {
            setSocket(socketRef.current);
        }


    }, [userData]); // Re-run effect if userData changes


    // useEffect(() => {
    //     if (socket && userData?.currentUser?.id) {
    //         console.log('Re-emitting setUserId:', userData.currentUser.id);
    //         socket.emit('setUserId', { userId: userData.currentUser.id, schema: userData.currentUser.schema });
    //     }
    // }, [socket, userData]);


    return (
        <SocketContext.Provider
            value={{
                socket: socket,userData
            }}
        >
            {children}
        </SocketContext.Provider>
    );
}

export { SocketContext, SocketValueContext };