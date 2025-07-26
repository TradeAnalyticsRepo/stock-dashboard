import axios from "axios";

export const callPostApi = async (url, parameter, headers = { "Content-Type": "application/json" }) => {
  try {
    await axios.post(url, parameter, { headers });
    console.log("callPostApi");
  } catch (error) {
    console.error("callPostApi 오류 발생:", error);
  }
};

export const callGetApi = async (url, parameter) => {
  try {
    return await axios.get(url, { params: parameter });
  } catch (error) {
    console.error("callGetApi 오류 발생:", error);
  }
};

export const callDeleteApi = async (url) => {
  try {
    return await axios.delete(url);
  } catch (error) {
    console.error("callDeleteApi 오류 발생:", error);
  }
};
