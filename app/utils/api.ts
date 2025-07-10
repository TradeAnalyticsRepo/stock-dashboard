import axios from "axios";

export const callPostApi = async (
  url: string,
  parameter: Record<string, unknown>,
  headers: Record<string, string> = { "Content-Type": "application/json" }
) => {
  try {
    await axios.post(url, parameter, { headers });
    console.log("callPostApi");
  } catch (error) {
    console.error("callPostApi 오류 발생:", error);
  }
};

export const callGetApi = async (url: string, parameter?: Record<string, unknown>) => {
  try {
    return await axios.get(url, { params: parameter });
  } catch (error) {
    console.error("callGetApi 오류 발생:", error);
  }
};

export const callDeleteApi = async (url: string) => {
  try {
    return await axios.delete(url);
  } catch (error) {
    console.error("callDeleteApi 오류 발생:", error);
  }
};
