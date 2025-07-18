import React, { useEffect, useState, useContext } from 'react';
import apiService from '../services/ApiServices'; // Adjusted path to apiService
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../context/socket'; // Import useSocket hook
import { useParams } from 'react-router-dom';


function Room() {
    const [Room, setRoom] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    const navigate = useNavigate();
    const { socket,userData } = useContext(SocketContext); // Get socket and connection status from context
    // const { roomid } = useParams()

    //    const [userData, setUserData] = useState(null);
        // useEffect(() => {
        //     const userString = localStorage.getItem("user");
        //     if (userString) {
        //         try {
        //             const parsedUser = JSON.parse(userString);
        //             setUserData(parsedUser);
        //         } catch (e) {
        //             console.error("Failed to parse user data from localStorage:", e);
        //             // Clear invalid data if parsing fails to prevent future errors
        //             localStorage.removeItem("user");
        //         }
        //     }
        // }, []);
    const getRoom = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.get('/api/rooms/'); // Assuming apiService has a .get method
            if (response) { // Assuming response has a 'success' property
                setRoom(response); // Assuming response.Room contains the array of Room
            } else {
                setError(response.message || 'Failed to fetch Room.');
                console.error('Failed to fetch Room:', response.message);
            }
        } catch (err) {
            setError('An error occurred while fetching Room.');
            console.error('API call error for Room:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getRoom();
        localStorage.removeItem("joinedRoom");
    }, []);

    const handleJoinRoom = (roomId) => {
        if (socket && socket?.connected) {
            console.log(roomId,userData.user_type)
            socket?.emit('joinclass', {roomId,userData});

            socket.on('notallowed',(id)=>{
                alert('class'+ id+'is not started yet')
            })

            socket.on('allowed',(id)=>{

                 localStorage.setItem("joinedRoom", id);
                
                navigate(`/classsession/${id}/${roomId}`);
                 // Example: navigate to a chat page specific to the room
            })
            socket.on('alreadyexistclass', (data) => {
                console.log('Room joined successfully:', data);
                localStorage.setItem("joinedRoom", data);
                  navigate(`/classsession/${data}/${roomId}`);

                // You can update the UI or state here if needed
            })
           
            // After joining the room on the server, navigate to a chat page or update UI
        } else {
            console.log('Socket not connected. Cannot join room.');
            // You might want to show a user-friendly message here
        }
    };


       // --- Inline Styles ---
const containerStyle = {
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: 'Inter, sans-serif',
    };

    const mainBoxStyle = { // Corresponds to the outer Box with maxWidth: "600px"
        maxWidth: '600px',
        width: '100%', // Ensure it takes full width up to maxWidth
        textAlign: 'center', // From the outer div in user's provided JSX
        padding: '20px', // From the outer div in user's provided JSX
        backgroundColor: '#fff', // Assuming a white background for the main content box
        borderRadius: '8px', // Equivalent to Material-UI's borderRadius: 2 (approx 8px)
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // Simplified shadow
    };

    const titleStyle = { // Corresponds to Typography variant="h4"
        fontSize: '2rem', // h4 equivalent
        fontWeight: 'bold',
        color: '#333', // text.primary
        marginBottom: '1rem', // mb: 4 (approx 1rem)
        textAlign: 'center', // align="center"
    };

    const gridBoxStyle = { // Corresponds to Box with display: 'grid'
        display: 'flex', // Using flexbox for simplicity instead of grid
        flexWrap: 'wrap',
        gap: '16px', // gap: 2 (approx 16px)
        justifyContent: 'center', // To center cards if they don't fill a row
    };

    const cardStyle = { // Corresponds to Card component
        borderRadius: '8px', // borderRadius: 2
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)', // boxShadow: 2 (simplified)
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        border: '1px solid #eee', // Light border
        padding: '16px', // CardContent padding
        width: 'calc(50% - 8px)', // minmax(280px, 1fr) approximation for 2 columns with gap
        minWidth: '280px', // Ensures a minimum width
        boxSizing: 'border-box', // Include padding and border in width calculation
    };

    const cardTitleStyle = { // Corresponds to Typography variant="h6"
        fontSize: '1.25rem', // h6 equivalent
        fontWeight: 'bold',
        marginBottom: '8px', // mb: 1 (approx 8px)
        color: '#333',
    };

    const bodyTextStyle = { // Corresponds to Typography variant="body2"
        fontSize: '0.875rem', // body2 equivalent
        color: '#666', // text.secondary
        marginBottom: '4px', // Small margin for text lines
    };

    const buttonBoxStyle = { // Corresponds to Box sx={{ p: 2, pt: 0 }}
        padding: '16px', // p: 2
        paddingTop: '0', // pt: 0
    };

    const buttonStyle = { // Corresponds to Button variant="contained"
        backgroundColor: '#1976d2', // primary color
        color: '#fff',
        padding: '8px 16px',
        borderRadius: '4px', // borderRadius: 1
        textTransform: 'none', // textTransform: 'none'
        fontWeight: 'bold',
        width: '100%', // fullWidth
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    };

    const noClassesTextStyle = { // Corresponds to Typography variant="body1"
        fontSize: '1rem', // body1 equivalent
        color: '#666', // textSecondary
        textAlign: 'center', // align="center"
        fontStyle: 'italic',
    };

    return (
        <div style={containerStyle}>
            <div style={mainBoxStyle}>
                <h2 style={titleStyle}>
                    Available Room
                </h2>

                {Room.length > 0 ? (
                    <div style={gridBoxStyle}>
                        {Room.map((room) => (
                            <div key={room.id} style={cardStyle}>
                                <div style={{ padding: '16px' }}> {/* Simulating CardContent */}
                                    <h3 style={cardTitleStyle}>
                                        {room.class_name}
                                    </h3>
                                    <p style={bodyTextStyle}>
                                        ID: {room.id}
                                    </p>
                                    <p style={bodyTextStyle}>
                                        Created At: {new Date(room.createdat).toLocaleString()}
                                    </p>
                                </div>
                                <div style={buttonBoxStyle}>
                                    <button
                                        onClick={() => handleJoinRoom(room.id)}
                                        style={buttonStyle}
                                    >
                                        Join Room
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={noClassesTextStyle}>No Room available.</p>
                )}
            </div>
        </div>
    );
}

export default Room;
