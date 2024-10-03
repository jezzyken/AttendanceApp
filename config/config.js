const ENV = 'local';

const config = {
  local: {
    apiUrl: 'http://192.168.1.153:3001/api/v1/node',
  },
  development: {
    apiUrl: 'https://dev.inventory-epos-app.onrender.com/api/v1/node',
  },
  production: {
    apiUrl: 'https://inventory-epos-app.onrender.com/api/v1/node',
  },
};

export default config[ENV];
