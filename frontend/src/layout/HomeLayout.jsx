import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

const HomeLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex flex-1">
        {/* Left sidebar (fixed width when expanded/collapsed) */}
        <Sidebar />

        {/* Main content column (header + outlet) */}
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-grow">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Footer sits outside the two-column area and stretches full width */}
      <Footer />
    </div>
  );
};

export default HomeLayout;