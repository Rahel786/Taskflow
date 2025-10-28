
const API_URL = process.env.REACT_APP_API_URL;

const TaskAPI = {
  async getAll() {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to fetch tasks');
    const tasks = await res.json();
    // MongoDB uses _id, but backend already maps it to id
    return tasks;
  },

  async create(task) {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error(`Failed to create task: ${res.status}`);
    const data = await res.json();
    // Backend returns with id already mapped
    return data;
  },

  async update(id, updates) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update task');
    const task = await res.json();
    // Backend returns with id already mapped
    return task;
  },

  async updateStatus(id, status) {
    const res = await fetch(`${API_URL}/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update task status');
    const task = await res.json();
    return task;
  },

  async delete(id) {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete task');
    return { success: true };
  },
};

export default TaskAPI;