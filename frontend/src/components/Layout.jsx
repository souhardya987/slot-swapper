import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation(); 
  const getLinkClasses = (path) =>
    `${
      location.pathname === path
        ? 'border-indigo-500 text-indigo-600' // active link (blue underline)
        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700' // inactive link
    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link
                to="/"
                className="shrink-0 flex items-center text-xl font-bold text-indigo-600"
              >
                SlotSwapper
              </Link>

              {user && (
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link to="/" className={getLinkClasses('/')}>
                    My Dashboard
                  </Link>
                  <Link
                    to="/marketplace"
                    className={getLinkClasses('/marketplace')}
                  >
                    Marketplace
                  </Link>
                  <Link
                    to="/requests"
                    className={getLinkClasses('/requests')}
                  >
                    My Requests
                  </Link>
                </div>
              )}
            </div>

            <div className="flex items-center">
              {user ? (
                <button
                  onClick={logout}
                  className="bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  Logout
                </button>
              ) : (
                <div className="space-x-2">
                  <Link
                    to="/login"
                    className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
