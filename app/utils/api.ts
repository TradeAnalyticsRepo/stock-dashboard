import axios from "axios";

export const callPostApi = async (url: string, parameter: any, headers: object = {'Content-Type': 'application/json'}) => {
  try {
    const result = await axios.post(url, parameter, { headers});
    console.log('callPostApi');
  } catch(error) {
    console.error('callPostApi 오류 발생:', error);
  }
}

export const callGetApi = async (url: string, parameter: any) => {
  try {
    return await axios.get(url, parameter);
  } catch (error) {
    console.error('callGetApi 오류 발생:', error);
  }
}