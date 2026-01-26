// API Configuration
export const API_CONFIG = {
  // Disable API calls in demo/development mode
  MOCK_MODE: true,
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  WS_URL: process.env.REACT_APP_WS_URL || 'ws://localhost:8080',
  
  // Enable/Disable features
  ENABLE_API: false,
  ENABLE_WEBSOCKET: false,
  ENABLE_SERVICE_WORKER: false,
};

// Mock API responses
export const mockApiResponse = (data: any) => {
  return Promise.resolve({ data, success: true });
};
