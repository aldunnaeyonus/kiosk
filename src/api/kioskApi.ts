import axios from 'axios';

const BASE_URL = "https://bigdogtools.com/kiosk";

const kioskApi = axios.create({
  baseURL: BASE_URL,
    timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// // Optional: Interceptor to add kiosk_id to requests if needed globally
// kioskApi.interceptors.request.use(async (config) => {
//   // You could add authentication tokens or other common headers here
//   const kioskId = await AsyncStorage.getItem("kiosk_id");
//   if (kioskId && config.data) {
//     // Example of how you might automatically add kiosk_id to post data
//     // Be careful with this approach, ensure it fits your API's needs
//   }
//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });


export default kioskApi;