import axios from 'axios';

// Direct connection to your live Render Backend
const API_URL = 'https://lab5-b4qk.onrender.com';

export default axios.create({
  baseURL: API_URL
});