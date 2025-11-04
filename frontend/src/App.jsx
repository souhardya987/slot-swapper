import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import Requests from './pages/Requests';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

      
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/requests" element={<Requests />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;