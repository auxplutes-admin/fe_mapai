import axios from "axios";
import { API_BASE_URL,SESSION_COOKIE_NAME } from "@/constant";

export const API_CLIENT = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: { "Content-Type": "application/json" },
});

API_CLIENT.interceptors.request.use(
    function (config) {
      // Retrieve user token from local storage
      const token = localStorage.getItem(SESSION_COOKIE_NAME) ?? "";
      // Set authorization header with bearer token
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  export const login = async(payload:{
    email:string,
    password:string,
    role:string
  })=>{
    const response = await API_CLIENT.post(
      "auth/login",
      payload
    )
    return response.data;
  }
  
// ------------------------------------------------------------
// API END POINTS
// ------------------------------------------------------------
// Chat 
export const sendChatMessage = async(payload:{
  regionId: string,
  question: string,
  session_id: string
})=>{
  const response = await axios.post("https://sa-mapai-api.enttlevo.online/chat_sa", payload);
  return response.data;
}

// chat by session id 
export const chatBySessionId = async(payload:{
  session_id: string
})=>{
  const response = await axios.post("https://x3kb-thkl-gi2q.n7e.xano.io/api:cWjxJO0v/chat_by_session_id_sa", payload);
  return response.data;
}

// get all regions
export const getAllRegions = async()=>{
  const response = await axios.get("https://x3kb-thkl-gi2q.n7e.xano.io/api:cWjxJO0v/get_region_sa");
  return response.data;
}

// get all sessions
export const getAllSessions = async()=>{
  const response = await axios.post("https://x3kb-thkl-gi2q.n7e.xano.io/api:cWjxJO0v/get_session_sa");
  return response.data;
}




