import React from 'react';
import { Modal, Form, Input, DatePicker, Select } from 'antd';
import dayjs from 'dayjs';

const TaskForm = ({ visible, onCancel, onFinish, editingTask, form }) => {
  return (
    <Modal
      title={editingTask ? 'Edit Task' : 'Create Task'}
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={editingTask ? {
          ...editingTask,
          dueDate: dayjs(editingTask.dueDate),
        } : {
          status: 'Pending',
        }}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Please input task title!' }]}
        >
          <Input placeholder="Enter task title" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please input task description!' }]}
        >
          <Input.TextArea placeholder="Enter task description" rows={4} />
        </Form.Item>

        <Form.Item
          name="dueDate"
          label="Due Date"
          rules={[{ required: true, message: 'Please select due date!' }]}
        >
          <DatePicker className="w-full" />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select task status!' }]}
        >
          <Select>
            <Select.Option value="Pending">Pending</Select.Option>
            <Select.Option value="In Progress">In Progress</Select.Option>
            <Select.Option value="Completed">Completed</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskForm;