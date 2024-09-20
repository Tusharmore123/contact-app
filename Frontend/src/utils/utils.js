import axios from 'axios';
import { config } from '../import.js';

const postData = async (endpoint = "/login", data) => {
  try {
    let api = config.BASE_URL + endpoint;

    // Send the data using axios.post
    const res = await axios.post(api, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });

    // Return the response
    return res;
  } catch (error) {
    // Return the error for handling elsewhere
    return error;
  }
};

const fetchData = async (endpoint = "/contacts") => {
  try {
    let api = config.BASE_URL + endpoint;


    // Fetch data using axios.get
    const res = await axios.get(api, { withCredentials: true });

    // Return the response
    return res;
  } catch (error) {
    // Return the error for handling elsewhere
    return error;
  }
};
const deleteData = async (endpoint = "/contacts") => {
  try {
    let api = config.BASE_URL + endpoint;


    // Fetch data using axios.get
    const res = await axios.delete(api, { withCredentials: true });

    // Return the response
    return res;
  } catch (error) {
    // Return the error for handling elsewhere
    return error;
  }
};

const uploadToCloudinary = async (file) => {
  const formInfo = new FormData();
  formInfo.append('upload_preset', config.PRESET)
  formInfo.append('cloud_name', config.CLOUDNAME)
  formInfo.append('file', file);
  const res = await axios.post(`https://api.cloudinary.com/v1_1/${config.CLOUDNAME}/image/upload`, formInfo)
  return res
}
export { postData, fetchData, deleteData, uploadToCloudinary };
