/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://localhost:3000/api/v1/users/updateMyPassword'
        : 'http://localhost:3000/api/v1/users/updateMe';
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });
    if (res.data.status === 'success' && type !== 'pay') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
    }
    console.log(res);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
