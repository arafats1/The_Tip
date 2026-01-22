const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api';

export const api = {
  // Workers
  registerWorker: async (data) => {
    const response = await fetch(`${API_URL}/tip-workers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    });
    return response.json();
  },

  loginWorker: async (phone, pin) => {
    const response = await fetch(`${API_URL}/tip-workers/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, pin }),
    });
    return response.json();
  },

  lookupWorker: async (tipId) => {
    const response = await fetch(`${API_URL}/tip-workers/lookup/${tipId}`);
    return response.json();
  },

  getWorker: async (workerId) => {
    const response = await fetch(`${API_URL}/tip-workers/${workerId}`);
    return response.json();
  },

  // Transactions
  createTransaction: async (data) => {
    const response = await fetch(`${API_URL}/tip-transactions/public`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    });
    return response.json();
  },

  getTransactions: async (workerId) => {
    const response = await fetch(`${API_URL}/tip-transactions/worker/${workerId}`);
    return response.json();
  },

  // Goals
  getGoals: async (workerId) => {
    const response = await fetch(`${API_URL}/tip-goals?filters[tip_worker][id][$eq]=${workerId}&sort=createdAt:desc`);
    return response.json();
  },

  createGoal: async (data) => {
    const response = await fetch(`${API_URL}/tip-goals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    });
    return response.json();
  },

  updateGoal: async (id, data) => {
    const response = await fetch(`${API_URL}/tip-goals/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    });
    return response.json();
  },

  deleteGoal: async (id) => {
    const response = await fetch(`${API_URL}/tip-goals/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  }
};
