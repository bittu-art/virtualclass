import React, { use, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SocketContext } from '../context/socket'; // Import useSocket hook
import apiService from '../services/ApiServices'; // Adjusted path to apiService
import { useNavigate } from 'react-router-dom';
// const apiService ={}
function Classsession() {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const { id, roomId } = useParams()
    const [isClassStarted, setIsClassStarted] = useState(false);
    const { socket, userData } = useContext(SocketContext);

    const navigate = useNavigate();// Get socket and connection status from context

    async function fetchAttendance() {

        try {
            const data = await apiService.get('/api/attendance/' + id); // Assuming apiService has a .get method
            if (data) { // Assuming response has a 'success' property

                console.log('Attendance data received:', data);
                const students = [];
                const teachers = [];

                data.map((item) => {
                    if (item.users?.user_type === 'student') {
                        console.log('Student:', item.name);
                        students.push({ id: item.users.id, name: item.users.name });
                    } else if (item.users?.user_type === 'teacher') {
                        console.log('Teacher:', item.name);
                        teachers.push(item.users.name);
                    }
                })
                // Assuming data contains students and teachers arrays
                setStudents(students || []);
                setTeachers(teachers || []);
            } else {
                setError(data.message || 'Failed to fetch Room.');
                console.error('Failed to fetch Room:', data.message);
            }
        } catch (err) {
            setError('An error occurred while fetching Room.');
            console.error('API call error for Room:', err);
        }
    }
    async function checkUserpresent() {
        try {
            const data = await apiService.get('/api/classes/class-attendance/' + id); // Assuming apiService has a .get method
            if (data) { // Assuming response has a 'success' property

                console.log('checkUserpresent data received:', data);
                if (userData?.user_type === 'student') {
                    if (data.is_started === true) {
                        setIsClassStarted(true);
                        console.log('Class has started');

                        const userPresent = data.attendance.find((item) => {
                            return item.user_id === userData.userId
                        })

                        if (userPresent) {
                            fetchAttendance();
                        } else {
                            console.log('User is not present in the class');
                            alert('You not present in the class');
                        }
                    } else {
                        console.log('Class has not started yet');
                        alert('Class has not started yet');
                    }

                } else {
                    console.log('Teacher can see the attendance');
                    fetchAttendance();
                }

                // Assuming data contains students and teachers arrays

            } else {
                setError(data.message || 'Failed to fetch Room.');
                console.error('Failed to fetch Room:', data.message);
            }
        } catch (err) {
            setError('An error occurred while fetching Room.');
            console.error('API call error for Room:', err);
        }
    }

    useEffect(() => {
        function handleNewUserJoined(user_data) {
            setStudents((prevStudents) => [...prevStudents, { id: user_data.id, name: user_data.name }]);
        }
        function handleClassEnded(data) {
            console.log('Class ended successfully:', data);
            alert('Class ended successfully');
            navigate('/roomlist');
        }
        function handleClassStarted(data) {
            console.log('Class started successfully:', data);
            alert('Class started successfully');
            setIsClassStarted(true);
        }
        function handleUserRemoved(data) {
            console.log('User removed from class:', data);
            setStudents((prevStudents) => prevStudents.filter((student) => student.id !== data.id));
        }

        if (socket && socket.connected) {
            socket.on('newuserjoined', handleNewUserJoined);
            socket.on('classended', handleClassEnded);
            socket.on('classstarted', handleClassStarted);
            socket.on('userremoved', handleUserRemoved);
        }

        return () => {
            if (socket) {
                socket.off('newuserjoined', handleNewUserJoined);
                socket.off('classended', handleClassEnded);
                socket.off('classstarted', handleClassStarted);
                socket.off('userremoved', handleUserRemoved);
            }
        };
    }, [socket?.connected, id]);

    useEffect(() => { checkUserpresent() }, [userData]);






    const handleStartClass = () => {
        console.log('Start Class button clicked!');
        try {

            if (socket && socket.connected) {
                console.log('Socket is connected:', socket.id);
                // Emit setUserId when the socket connects
                socket.emit('startclass', { classId: id, room_id: roomId, userData });
                socket.on("classstarted", (data) => {
                    console.log('Class started successfully:', data);
                    socket.emit('getattendance', { classId: data });
                }
                );

                socket.on('attendance', (data) => {

                    console.log('Attendance data received:', data);
                    const students = [];
                    const teachers = [];

                    data.map((item) => {
                        if (item.users.user_type === 'student') {
                            console.log('Student:', item.name);
                            students.push(item.users.name);
                        } else if (item.users.user_type === 'teacher') {
                            console.log('Teacher:', item.name);
                            teachers.push(item.users.name);
                        }
                    })
                    setStudents(students || []);
                    setTeachers(teachers || []);

                })
                socket.on("classexists", (data) => {
                    console.log('Class already exists:', data);
                    alert('Class already exists');
                })

            } else {
                console.log('Socket is not connected');
            }
        } catch (err) {
            console.error('Error starting class:', err);
        }
        // Add logic for starting the class here
    };

    const handleEndClass = () => {
        try {

            if (socket && socket.connected) {
                console.log('Socket is connected:', socket.id);
                // Emit setUserId when the socket connects
                socket.emit('endclass', { classId: id, userData });






            } else {
                console.log('Socket is not connected');
            }
        } catch (err) {
            console.error('Error class ended:', err);
        }
        // Add logic for ending the class here
    };

    const containerStyle = {
        minHeight: '100vh',
        backgroundColor: '#f8f9fa', // Equivalent to Bootstrap's bg-light
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem', // Equivalent to Bootstrap's p-4
        fontFamily: 'Inter, sans-serif' // Keeping a common font family
    };

    const mainCardStyle = {
        backgroundColor: '#fff',
        padding: '1.5rem', // Equivalent to Bootstrap's p-4
        borderRadius: '0.25rem', // Equivalent to Bootstrap's rounded
        boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)', // A general shadow, similar to shadow-lg
        width: '100%',
        maxWidth: '960px',
    };

    const headerContainerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem', // Equivalent to Bootstrap's mb-4
    };

    const titleStyle = {
        fontSize: '2.5rem', // Equivalent to Bootstrap's display-4
        fontWeight: '700', // Equivalent to Bootstrap's fw-bold
        color: '#212529', // Equivalent to Bootstrap's text-dark
    };

    const buttonGroupStyle = {
        display: 'flex',
        gap: '1rem', // Equivalent to Bootstrap's gap-3

    };

    const buttonStyle = {
        padding: '0.5rem 1.5rem', // Equivalent to Bootstrap's px-4 py-2
        fontSize: '1.25rem', // Equivalent to Bootstrap's btn-lg
        borderRadius: '0.3rem', // Equivalent to Bootstrap's rounded-2
        border: 'none', // Remove default button border
        cursor: 'pointer',
        transition: 'background-color 0.3s ease, transform 0.2s ease', // Basic transition for hover
        fontWeight: '600',
        color: '#fff',
    };

    const primaryButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#0d6efd', // Equivalent to Bootstrap's btn-primary
    };

    const dangerButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#dc3545', // Equivalent to Bootstrap's btn-danger
    };

    const rowStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1.5rem', // Equivalent to Bootstrap's g-4
    };

    const cardColStyle = {
        width: '100%', // Default for col-12
        flex: '0 0 auto',
        maxWidth: '100%',
        // For responsiveness (col-md-6), inline styles are limited.
        // In a real app, you'd use media queries in a <style> block or a CSS-in-JS solution.
        // This is a simple approximation for larger screens:
        '@media (min-width: 768px)': { // This will not work directly as inline style
            width: 'calc(50% - 0.75rem)', // 50% minus half of the gap
            maxWidth: 'calc(50% - 0.75rem)',
        }
    };

    const listCardStyle = {
        backgroundColor: '#fff',
        border: '1px solid #dee2e6', // Equivalent to Bootstrap's border border-secondary
        borderRadius: '0.25rem',
        boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)', // Equivalent to shadow-sm
        padding: '1.5rem', // Equivalent to Bootstrap's p-4
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    };

    const listTitleStyle = {
        fontSize: '1.5rem', // Equivalent to Bootstrap's h4
        fontWeight: '600', // Equivalent to Bootstrap's fw-semibold
        color: '#6c757d', // Equivalent to Bootstrap's text-secondary
        marginBottom: '1rem', // Equivalent to Bootstrap's mb-3
    };

    const listItemStyle = {
        listStyle: 'none', // Equivalent to Bootstrap's list-unstyled
        paddingLeft: '0',
        width: '100%',
        textAlign: 'center',
        marginBottom: '0', // Equivalent to Bootstrap's mb-0
    };

    const studentTeacherNameStyle = {
        color: '#212529', // Equivalent to Bootstrap's text-dark
        fontSize: '1.25rem', // Equivalent to Bootstrap's fs-5
        paddingTop: '0.25rem', // Equivalent to Bootstrap's py-1
        paddingBottom: '0.25rem',
    };

    const noDataTextStyle = {
        color: '#6c757d', // Equivalent to Bootstrap's text-muted
        fontStyle: 'italic', // Equivalent to Bootstrap's fst-italic
    };

    return (
        <div style={containerStyle}>
            <div style={mainCardStyle}>
                <div style={headerContainerStyle}>
                    <h1 style={titleStyle}>Class session</h1>
                    {
                        userData?.user_type === 'teacher' && (<div style={buttonGroupStyle}>
                            {!isClassStarted && (<button
                                onClick={handleStartClass}
                                style={primaryButtonStyle}
                            >
                                Start Class
                            </button>)}
                            <button
                                onClick={handleEndClass}
                                style={dangerButtonStyle}
                            >
                                End Class
                            </button>
                        </div>)
                    }

                </div>

                <div style={rowStyle}>
                    {/* Student List Card */}
                    <div style={{ ...cardColStyle, flexGrow: 1 }}> {/* flexGrow to make them fill space */}
                        <div style={listCardStyle}>
                            <h2 style={listTitleStyle}>Student List</h2>
                            <ul style={listItemStyle}>
                                {students.length > 0 ? (
                                    students.map((student, index) => (
                                        <li key={index} style={studentTeacherNameStyle}>
                                            {student.name}
                                        </li>
                                    ))
                                ) : (
                                    <p style={noDataTextStyle}>No students in class.</p>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Teacher List Card */}
                    <div style={{ ...cardColStyle, flexGrow: 1 }}> {/* flexGrow to make them fill space */}
                        <div style={listCardStyle}>
                            <h2 style={listTitleStyle}>Teacher List</h2>
                            <ul style={listItemStyle}>
                                {teachers.length > 0 ? (
                                    teachers.map((teacher, index) => (
                                        <li key={index} style={studentTeacherNameStyle}>
                                            {teacher}
                                        </li>
                                    ))
                                ) : (
                                    <p style={noDataTextStyle}>No teachers assigned.</p>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Classsession;
