let baseURL = null;

if (process.env.REACT_APP_ENV === 'DEV') {
  baseURL = `http://${window.location.hostname}:8000`;
} else {
  baseURL = process.env.REACT_APP_NLM_SERVER_DNS;
}

export default baseURL;