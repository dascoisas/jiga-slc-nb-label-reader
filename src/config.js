import axios from 'axios';
import baseURL from './serverURL';

const client = axios.create({
  baseURL: baseURL,
  timeout: 9000,
  headers: {},
});

export { client };