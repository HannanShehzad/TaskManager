import React from 'react';
import { Card, Button, Select, theme } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDraggable,
  useDroppable
} from '@dnd-kit/core';

const STATUSES = ['Pending', 'In Progress', 'Completed'];

  // Apply the Ant Design v5 theme token
const useStyles = () => {
  const { token } = theme.useToken();
  return {
    card: {
      marginBottom: token.marginMD,
      borderRadius: token.borderRadiusLG,
      boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    },
    select: {
      width: 120,
    },
    dropZone: {
      transition: 'background-color 0.2s ease',
      minHeight: '200px',
      height: '100%',
      borderRadius: token.borderRadiusLG,
      padding: token.padding,
    },
    dropZoneActive: {
      backgroundColor: token.colorPrimaryBg,
      borderColor: token.colorPrimary,
    }
  };
};const DraggableTaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task._id,
    data: { task }
  });

  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      <TaskCard
        task={task}
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
        isDragging={isDragging}
      />
    </div>
  );
};

const TaskCard = ({ task, onEdit, onDelete, onStatusChange, isDragging }) => {
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
    opacity: isDragging ? 0.5 : 1,
    cursor: 'move',
    transform: isDragging ? 'scale(1.05)' : 'scale(1)',
    transition: 'transform 0.2s, opacity 0.2s',
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

const StatusColumn = ({ status, children }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: status,
  });

  const styles = useStyles();
  
  return (
    <div 
      ref={setNodeRef}
      className="bg-gray-50 p-4 rounded-lg"
      style={{
        ...styles.dropZone,
        ...(isOver ? styles.dropZoneActive : {}),
      }}
    >
      <h3 className="text-lg font-semibold mb-4">{status}</h3>
      <div className="min-h-[100px]">
        {children}
      </div>
    </div>
  );
};

const KanbanBoard = ({ tasks, onTaskMove, onEditTask, onDeleteTask }) => {
  const [activeId, setActiveId] = React.useState(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: (event) => {
        return event.code === 'Space' || event.code === 'Enter'
          ? event.preventDefault()
          : undefined;
      },
    })
  );

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const task = tasks.find(t => t._id === active.id);
      const newStatus = over.id;
      
      if (task && STATUSES.includes(newStatus) && task.status !== newStatus) {
        onTaskMove(task._id, newStatus);
      }
    }
    
    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const activeTask = activeId ? tasks.find(task => task._id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STATUSES.map((status) => {
          const statusTasks = getTasksByStatus(status);
          return (
            <StatusColumn key={status} status={status}>
              {statusTasks.map((task) => (
                <DraggableTaskCard
                  key={task._id}
                  task={task}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                  onStatusChange={onTaskMove}
                />
              ))}
            </StatusColumn>
          );
        })}
      </div>
      <DragOverlay>
        {activeTask ? (
          <TaskCard
            task={activeTask}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            onStatusChange={onTaskMove}
            isDragging={true}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;