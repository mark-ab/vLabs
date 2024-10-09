import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/login';
import Signup from './pages/signup';
import LibrarianDashboard from './pages/librarian-dashboard';
import MemberDashboard from './pages/member-dashboard';
import { useState } from 'react';
import RefrshHandler from './RefrshHandler';
import { LibraryProvider } from './pages/LibraryContext';

function ProtectedRoute({ children, allowedUserType }) {
  const userType = localStorage.getItem('userType');
  const token = localStorage.getItem('token');
  
  if (!token || userType !== allowedUserType) {
      return <Navigate to="/login" />;
  }
  
  return children;
}


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />
  }

  return (
    <div className="App">
      <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/librarian-dashboard' element={<ProtectedRoute allowedUserType="librarian"> <LibraryProvider> <LibrarianDashboard /> </LibraryProvider> </ProtectedRoute>} />
        <Route path='/member-dashboard' element={<ProtectedRoute allowedUserType="member"> <LibraryProvider><MemberDashboard /> </LibraryProvider></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;