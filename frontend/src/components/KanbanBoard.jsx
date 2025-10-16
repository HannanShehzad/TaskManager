import React from 'react';
import { Card, Button, Select, theme } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const STATUSES = ['Pending', 'In Progress', 'Completed'];

// Apply the Ant Design v5 theme token
const useStyles = () => {
  const { token } = theme.useToken();
  return {
    card: {
      marginBottom: token.marginMD,
      borderRadius: token.borderRadiusLG,
    },
    select: {
      width: 120,
    }
  };
};

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const styles = useStyles();
  
  // Status color mapping
  const statusColors = {
    'Pending': { bg: '#FFF7E6', borderColor: '#FFD591' },      // Orange theme
    'In Progress': { bg: '#E6F4FF', borderColor: '#91CAFF' },  // Blue theme
    'Completed': { bg: '#F6FFED', borderColor: '#B7EB8F' }     // Green theme
  };

  const cardStyle = {
    ...styles.card,
    backgroundColor: statusColors[task.status]?.bg || styles.card.backgroundColor,
    borderColor: statusColors[task.status]?.borderColor || styles.card.borderColor,
  };

  return (
    <Card
      style={cardStyle}
      extra={
        <Select
          value={task.status}
          onChange={(value) => onStatusChange(task._id, value)}
          style={styles.select}
          size="middle"
        >
          {STATUSES.map(status => (
            <Select.Option key={status} value={status}>
              {status}
            </Select.Option>
          ))}
        </Select>
      }
      actions={[
        <Button
          type="text"
          icon={<EditOutlined />}
          onClick={() => onEdit(task)}
        />,
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => onDelete(task._id)}
        />,
      ]}
    >
      <Card.Meta
        title={task.title}
        description={
          <>
            <p>{task.description}</p>
            <p className="text-sm text-gray-500">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </p>
          </>
        }
      />
    </Card>
  );
};

const KanbanBoard = ({ tasks, onTaskMove, onEditTask, onDeleteTask }) => {
  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {STATUSES.map((status) => {
        const statusTasks = getTasksByStatus(status);
        return (
          <div key={status} className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">{status}</h3>
            <div className="min-h-[100px]">
              {statusTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                  onStatusChange={onTaskMove}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;