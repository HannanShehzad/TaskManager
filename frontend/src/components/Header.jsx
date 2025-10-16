
import { Link, useNavigation  } from 'react-router-dom';
import { Home, LogIn, Menu, UserPlus, } from 'lucide-react';
import { useStyleContext } from '../context/StyleContext';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { expanded, setExpanded } = useStyleContext();
  const { logout } = useAuth();
  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <span  className="flex items-center space-x-2">
            <div className=" h-10  rounded-full flex items-center justify-center px-3">
           <button
          className="p-2 rounded"
          onClick={() => setExpanded((s) => !s)}
          aria-label="Toggle sidebar"
        >
          <Menu size={18} />
        </button>
            </div>
          </span>
          <nav className="flex space-x-6">
            <Link to="/" className="flex items-center space-x-1 hover:text-indigo-200 transition">
              <Home size={18} />
              <span>Home</span>
            </Link>
            <span  className="flex items-center space-x-1 hover:text-indigo-200 transition cursor-pointer"
            
            onClick={() => {
              logout()
            }}>
              <LogIn size={18} />
              <span>Logout</span>
            </span>
           
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header