import {  Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">About Us</h3>
            <p className="text-sm">We provide amazing services to make your life easier and more productive.</p>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Login</Link></li>
              <li><Link to="/signup" className="hover:text-white transition">Sign Up</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact</h3>
            <p className="text-sm">Email: info@ondemandsecurity.com</p>
            <p className="text-sm">Phone: +1 234 567 890</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
          <p>&copy; 2025 on demand security. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;