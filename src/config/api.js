// API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'http://192.168.49.2:30080'  // API port in Kubernetes
  : 'http://localhost:8080';     // Local development

export default API_BASE_URL;
