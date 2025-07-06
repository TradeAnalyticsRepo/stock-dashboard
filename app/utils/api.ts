import axios from "axios";

export const callPostApi = async (url: string, parameter: any, headers: object = {'Content-Type': 'application/json'}) => {
  try {
    const result = await axios.post(url, parameter, { headers});
    console.log('callPostApi');
  } catch(error) {
    console.error('callApi 오류 발생:', error);
  }
}