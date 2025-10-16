import { useAuth } from "../context/AuthContext";
import TaskPage from "./TaskPage";

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen">
      {isAuthenticated ? (
        <TaskPage />
      ) : (
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Welcome to Task Manager
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Please log in to manage your tasks
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
