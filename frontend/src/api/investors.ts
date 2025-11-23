import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

export interface Investor {
  id?: number;
  full_name: string;
  id_number: string;
  email: string;
  phone: string;
  investment_amount: number;
  start_date: string;
  investor_type: string;
  notes?: string;
}

export const investorsApi = {
  // הוספת משקיע
  create: async (investor: Investor) => {
    const response = await axios.post(`${API_URL}/investors`, investor);
    return response.data;
  },
  
  // קבלת כל המשקיעים
  getAll: async () => {
    const response = await axios.get(`${API_URL}/investors`);
    return response.data;
  },
  
  // קבלת משקיע ספציפי
  getOne: async (id: number) => {
    const response = await axios.get(`${API_URL}/investors/${id}`);
    return response.data;
  },
  
  // עדכון משקיע
  update: async (id: number, investor: Investor) => {
    const response = await axios.put(`${API_URL}/investors/${id}`, investor);
    return response.data;
  },
  
  // מחיקת משקיע
  delete: async (id: number) => {
    const response = await axios.delete(`${API_URL}/investors/${id}`);
    return response.data;
  }
};