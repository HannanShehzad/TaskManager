import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button, Card, Row, Col, Statistic, Typography, Spin } from 'antd';
import { 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  RightCircleOutlined,
  PlusCircleOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import { useTasks } from "../hooks/useTasks";

const { Title, Paragraph } = Typography;

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { tasks, isLoading } = useTasks();
  
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(task => task.status === 'Completed').length,
    inProgress: tasks.filter(task => task.status === 'In Progress').length,
    pending: tasks.filter(task => task.status === 'Pending').length
  };

  const features = [
    {
      icon: <ClockCircleOutlined style={{ fontSize: '24px', color: '#6366f1' }} />,
      title: "Task Tracking",
      description: "Keep track of all your tasks in one place"
    },
    {
      icon: <CheckCircleOutlined style={{ fontSize: '24px', color: '#6366f1' }} />,
      title: "Task Management",
      description: "Organize and prioritize your tasks efficiently"
    },
    {
      icon: <RightCircleOutlined style={{ fontSize: '24px', color: '#6366f1' }} />,
      title: "Progress Monitoring",
      description: "Monitor your progress and stay on track"
    }
  ];

  const stats = [
    { 
      title: 'Total Tasks',
      value: taskStats.total,
      icon: <RightCircleOutlined style={{ fontSize: '20px' }} />,
      color: '#6366f1'  // Indigo
    },
    { 
      title: 'Completed',
      value: taskStats.completed,
      icon: <CheckCircleOutlined style={{ fontSize: '20px' }} />,
      color: '#389E0D'  // Green
    },
    { 
      title: 'In Progress',
      value: taskStats.inProgress,
      icon: <ClockCircleOutlined style={{ fontSize: '20px' }} />,
      color: '#0958D9'  // Blue
    },
    { 
      title: 'Pending',
      value: taskStats.pending,
      icon: <ClockCircleOutlined style={{ fontSize: '20px' }} />,
      color: '#D46B08'  // Orange
    }
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {isAuthenticated ? (
          <>
            {/* Welcome Section */}
            <div className="text-center mb-12">
              <Title level={1} className="mb-4">
                Welcome back, {user?.name || 'User'}!
              </Title>
              <Paragraph className="text-lg text-gray-600 mb-8">
                Ready to be productive today? Let's manage your tasks efficiently.
              </Paragraph>
              <Button 
                type="primary" 
                size="large"
                icon={<PlusCircleOutlined />}
                onClick={() => navigate('/tasks')}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Go to Tasks
              </Button>
            </div>

            {/* Statistics Cards */}
            <Row gutter={[16, 16]} className="mb-12">
              {stats.map((stat, index) => (
                <Col xs={12} sm={6} key={index}>
                  <Card 
                    className="text-center hover:shadow-lg transition-shadow"
                    loading={isLoading}
                  >
                    <Statistic
                      title={
                        <span className="flex items-center justify-center gap-2">
                          {stat.icon}
                          {stat.title}
                        </span>
                      }
                      value={stat.value}
                      valueStyle={{ color: stat.color }}
                      prefix={isLoading ? <LoadingOutlined /> : null}
                    />
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Features Section */}
            <Row gutter={[24, 24]} className="mb-12">
              {features.map((feature, index) => (
                <Col xs={24} sm={8} key={index}>
                  <Card 
                    className="text-center h-full hover:shadow-lg transition-shadow"
                    bordered={false}
                  >
                    <div className="mb-4">{feature.icon}</div>
                    <Title level={4} className="mb-2">{feature.title}</Title>
                    <Paragraph className="text-gray-600">
                      {feature.description}
                    </Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        ) : (
          <div className="text-center py-16">
            <Title level={1} className="mb-4">
              Welcome to Task Manager
            </Title>
            <Paragraph className="text-xl text-gray-600 mb-8">
              Please log in to manage your tasks and boost your productivity
            </Paragraph>
            <Button 
              type="primary" 
              size="large"
              onClick={() => navigate('/')}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Log In Now
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
