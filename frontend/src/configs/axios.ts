// import axios from 'axios';

// // Always use backend URL so request goes straight to backend (avoids proxy 404)
// const baseURL = import.meta.env.VITE_BASEURL || 'http://localhost:3000';

// const api = axios.create({
//   baseURL,
//   withCredentials: true,
// });

// export default api


import axios from "axios";

const baseURL =
   import.meta.env.VITE_BASEURL || "http://localhost:3000";

const api = axios.create({
  baseURL,
  withCredentials: true,
   headers: {
    "Content-Type": "application/json",
  },
});

export default api;
