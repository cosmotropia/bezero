const BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:3000";
const API_URL = `${BASE_URL}/api`;

console.log("API_URL:", API_URL);

export { BASE_URL, API_URL }