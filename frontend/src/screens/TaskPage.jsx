import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Input, DatePicker, Select, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';
import TaskForm from "../components/TaskForm";
import KanbanBoard from "../components/KanbanBoard";
import taskService from "../services/taskService";
import { useAuth } from "../context/AuthContext";

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  
  // Simple form state instead of Ant Design Form
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: null,
    status: 'Pending',
  });

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getAllTasks(token);
      setTasks(response.data.tasks);
    } catch (error) {
      message.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [token]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      dueDate: null,
      status: 'Pending',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      dueDate: date,
    }));
  };

  const handleStatusChange = (value) => {
    setFormData(prev => ({
      ...prev,
      status: value,
    }));
  };

  const handleCreate = async () => {
    if (!formData.title.trim()) {
      message.error('Please enter a task title');
      return;
    }
    try {
      const dataToSend = {
        ...formData,
        dueDate: formData.dueDate ? formData.dueDate.toISOString() : null,
      };
      await taskService.createTask(dataToSend, token);
      message.success('Task created successfully');
      setIsModalVisible(false);
      resetForm();
      fetchTasks();
    } catch (error) {
      message.error('Failed to create task');
    }
  };

  const handleUpdate = async () => {
    if (!formData.title.trim()) {
      message.error('Please enter a task title');
      return;
    }
    try {
      const dataToSend = {
        ...formData,
        dueDate: formData.dueDate ? formData.dueDate.toISOString() : null,
      };
      await taskService.updateTask(editingTask._id, dataToSend, token);
      message.success('Task updated successfully');
      setIsModalVisible(false);
      setEditingTask(null);
      resetForm();
      fetchTasks();
    } catch (error) {
      message.error('Failed to update task');
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await taskService.deleteTask(taskId, token);
      message.success('Task deleted successfully');
      fetchTasks();
    } catch (error) {
      message.error('Failed to delete task');
    }
  };

  const openEditModal = (record) => {
    setEditingTask(record);
    setFormData({
      title: record.title,
      description: record.description,
      dueDate: dayjs(record.dueDate),
      status: record.status,
    });
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setEditingTask(null);
    resetForm();
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Pending', value: 'Pending' },
        { text: 'In Progress', value: 'In Progress' },
        { text: 'Completed', value: 'Completed' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => openEditModal(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Button.Group>
            <Button
              type={viewMode === 'table' ? 'primary' : 'default'}
              onClick={() => setViewMode('table')}
            >
              Table View
            </Button>
            <Button
              type={viewMode === 'kanban' ? 'primary' : 'default'}
              onClick={() => setViewMode('kanban')}
            >
              Kanban View
            </Button>
          </Button.Group>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            resetForm();
            setEditingTask(null);
            setIsModalVisible(true);
          }}
        >
          Add Task
        </Button>
      </div>

      {viewMode === 'table' ? (
        <Table
          columns={columns}
          dataSource={tasks}
          rowKey="_id"
          loading={loading}
        />
      ) : (
        <KanbanBoard
          tasks={tasks}
          onTaskMove={async (taskId, newStatus) => {
            try {
              await taskService.updateTask(taskId, { status: newStatus }, token);
              fetchTasks();
            } catch (error) {
              message.error('Failed to update task status');
            }
          }}
          onEditTask={(task) => openEditModal(task)}
          onDeleteTask={handleDelete}
        />
      )}

      <Modal
        title={editingTask ? 'Edit Task' : 'Create New Task'}
        visible={isModalVisible}
        onOk={editingTask ? handleUpdate : handleCreate}
        onCancel={closeModal}
        okText={editingTask ? 'Update' : 'Create'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter task title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Input.TextArea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter task description"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <DatePicker
              value={formData.dueDate}
              onChange={handleDateChange}
              style={{ width: '100%' }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <Select
              value={formData.status}
              onChange={handleStatusChange}
              options={[
                { label: 'Pending', value: 'Pending' },
                { label: 'In Progress', value: 'In Progress' },
                { label: 'Completed', value: 'Completed' },
              ]}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TaskPage;