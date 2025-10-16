import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1/tasks';

const taskService = {
  getAllTasks: async (token) => {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  createTask: async (taskData, token) => {
    const response = await axios.post(API_URL, taskData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  updateTask: async (taskId, taskData, token) => {
    const response = await axios.patch(`${API_URL}/${taskId}`, taskData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  deleteTask: async (taskId, token) => {
    const response = await axios.delete(`${API_URL}/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};

export default taskService;