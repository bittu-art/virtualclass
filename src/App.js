import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { SocketValueContext } from "./context/socket";
import LoginPage from './components/Login';
import Classsession from './components/Classsession';
import Room from './components/RoomList';
function App() {
 return (
    <Router>
      <div className="App">
        <SocketValueContext>

      
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/classsession/:id/:roomId" element={<Classsession /> }/>
          <Route path="/roomlist/" element={<Room /> }/>
          
          {/* <Route path="/menu" element={<NavBar />} /> */}
   
        


                    {/* Add more private routes here */}
        </Routes>
          </SocketValueContext>
        
      </div>
    </Router>
  );
}

export default App;
