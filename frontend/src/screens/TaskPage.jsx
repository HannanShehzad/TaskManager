import React, { useState, useEffect } from "react";
import { Button, Form, Spin, Empty, Table, Switch, Tag, Space, Tooltip } from "antd";
import { 
  PlusOutlined, 
  AppstoreOutlined, 
  BarsOutlined,
  EditOutlined,
  DeleteOutlined 
} from "@ant-design/icons";
import dayjs from 'dayjs';
import { useAuth } from "../context/AuthContext";
import { useSnackbarContext } from "../context/SnackbarContext";
import taskService from "../services/taskService";
import TaskForm from "../components/TaskForm";
import KanbanBoard from "../components/KanbanBoard";

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isKanbanView, setIsKanbanView] = useState(true);
  const [form] = Form.useForm();

  // Status color mapping
  const statusColors = {
    'Pending': { bg: '#FFF7E6', text: '#D46B08', border: '#FFD591' },      // Orange
    'In Progress': { bg: '#E6F4FF', text: '#0958D9', border: '#91CAFF' },  // Blue
    'Completed': { bg: '#F6FFED', text: '#389E0D', border: '#B7EB8F' }     // Green
  };

  // Table columns configuration
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div className="font-medium">{text}</div>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag
          style={{
            backgroundColor: statusColors[status]?.bg,
            color: statusColors[status]?.text,
            border: `1px solid ${statusColors[status]?.border}`,
            padding: '4px 12px',
          }}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditTask(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteTask(record._id)}
          />
        </Space>
      ),
    },
  ];
  const { token } = useAuth();
  const { openSnackBar } = useSnackbarContext();

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, [token]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getAllTasks(token);
      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      openSnackBar(
        "error",
        error.response?.data?.message || "Failed to fetch tasks"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    form.setFieldsValue({
      ...task,
      dueDate: task.dueDate ? dayjs(task.dueDate) : null,
    });
    setModalVisible(true);
  };

  const handleTaskMove = async (taskId, newStatus) => {
    try {
      await taskService.updateTask(taskId, { status: newStatus }, token);
      // Optimistically update the UI
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
      openSnackBar("success", "Task status updated successfully");
    } catch (error) {
      console.error("Error updating task:", error);
      openSnackBar(
        "error",
        error.response?.data?.message || "Failed to update task"
      );
      // Refresh tasks to ensure UI is in sync with server
      fetchTasks();
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId, token);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      openSnackBar("success", "Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
      openSnackBar(
        "error",
        error.response?.data?.message || "Failed to delete task"
      );
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      if (editingTask) {
        await taskService.updateTask(editingTask._id, values, token);
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === editingTask._id ? { ...task, ...values } : task
          )
        );
        openSnackBar("success", "Task updated successfully");
      } else {
        const response = await taskService.createTask(values, token);
        setTasks((prevTasks) => [...prevTasks, response.data.task]);
        openSnackBar("success", "Task created successfully");
      }
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error saving task:", error);
      openSnackBar(
        "error",
        error.response?.data?.message || "Failed to save task"
      );
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div></div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateTask}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          Add Task
        </Button>
      </div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-800">Task Management</h1>
          
        </div>
        <div
         
        >
          <div className="flex items-center space-x-2 bg-white px-3 py-1 rounded-lg shadow-sm">
            <BarsOutlined 
              className={!isKanbanView ? 'text-indigo-600' : 'text-gray-400'} 
            />
            <Switch
              checked={isKanbanView}
              onChange={setIsKanbanView}
              className={isKanbanView ? 'bg-indigo-600' : 'bg-gray-400'}
            />
            <AppstoreOutlined 
              className={isKanbanView ? 'text-indigo-600' : 'text-gray-400'} 
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : tasks.length === 0 ? (
        <Empty
          description="No tasks found. Create your first task!"
          className="my-16"
        />
      ) : isKanbanView ? (
        <KanbanBoard
          tasks={tasks}
          onTaskMove={handleTaskMove}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
        />
      ) : (
        <div className="bg-white rounded-lg shadow">
          <Table
            dataSource={tasks}
            columns={columns}
            rowKey="_id"
            pagination={{ 
              pageSize: 10,
              position: ['bottomCenter'],
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} tasks`
            }}
            className="rounded-lg overflow-hidden"
          />
        </div>
      )}

      <TaskForm
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingTask(null);
          form.resetFields();
        }}
        onFinish={handleFormSubmit}
        editingTask={editingTask}
        form={form}
      />
    </div>
  );
};

export default TaskPage;