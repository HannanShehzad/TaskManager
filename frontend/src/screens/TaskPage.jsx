import React, { useState } from "react";
import { Button, Form, Spin, Empty, Table, Switch, Tag, Space, Tooltip } from "antd";
import { 
  PlusOutlined, 
  AppstoreOutlined, 
  BarsOutlined,
  EditOutlined,
  DeleteOutlined 
} from "@ant-design/icons";
import dayjs from 'dayjs';
import { useSnackbarContext } from "../context/SnackbarContext";
import TaskForm from "../components/TaskForm";
import KanbanBoard from "../components/KanbanBoard";
import { useTasks } from "../hooks/useTasks";

const TaskPage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isKanbanView, setIsKanbanView] = useState(true);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [form] = Form.useForm();

  const { tasks, isLoading, createTask, updateTask, deleteTask } = useTasks();

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
      sorter: (a, b) => a.title.localeCompare(b.title),
      filterSearch: true,
      onFilter: (value, record) => record.title.toLowerCase().includes(value.toLowerCase()),
      filteredValue: null,
      render: (text, record) => (
        <div className="font-medium">{text}</div>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      sorter: (a, b) => a.description.localeCompare(b.description),
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
      filters: [
        { text: 'Pending', value: 'Pending' },
        { text: 'In Progress', value: 'In Progress' },
        { text: 'Completed', value: 'Completed' },
      ],
      filterMode: 'menu',
      filtered: true,
      onFilter: (value, record) => {
        if (!record.status) return false;
        return record.status.toString() === value.toString();
      },
      sorter: (a, b) => {
        if (!a.status || !b.status) return 0;
        return a.status.localeCompare(b.status);
      },
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
      sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
      defaultSortOrder: 'ascend',
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

  const handleTaskMove = (taskId, newStatus) => {
    updateTask({ taskId, taskData: { status: newStatus } });
  };

  const handleDeleteTask = (taskId) => {
    deleteTask(taskId);
  };

  const handleFormSubmit = (values) => {
    if (editingTask) {
      updateTask({ taskId: editingTask._id, taskData: values });
    } else {
      createTask(values);
    }
    setModalVisible(false);
    form.resetFields();
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

      {isLoading ? (
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
          <div className="p-4 border-b flex justify-end space-x-4">
            <Button onClick={() => {
              setFilteredInfo({});
              setSortedInfo({});
            }}>
              Clear filters and sorters
            </Button>
          </div>
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
            onChange={(pagination, filters, sorter, extra) => {
              setFilteredInfo(filters);
              setSortedInfo(sorter);
              console.log('Table changed:', { pagination, filters, sorter, extra });
            }}
            filteredInfo={filteredInfo}
            sortedInfo={sortedInfo}
            className="rounded-lg overflow-hidden"
            scroll={{ x: 'max-content' }}
            sticky
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