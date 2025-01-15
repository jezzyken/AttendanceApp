const ENV = 'local';

const config = {
  local: {
    apiUrl: 'http://192.168.1.153:3000/api/v1/',
  },
  development: {
    apiUrl: 'https://dev.inventory-epos-app.onrender.com/api/v1/',
  },
  production: {
    apiUrl: 'https://gitattendance.onrender.com/api/v1/',
  },
};

export default config[ENV];
