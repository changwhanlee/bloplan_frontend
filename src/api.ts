import Cookies from "js-cookie";
import axios from "axios";
import { IPlatformAdd, ISignUp, ITaskAdd } from "./types";


const Instance = axios.create({
    baseURL: process.env.NODE_ENV === "development" ? "http://127.0.0.1:8000/api/v1/" 
    : "https://backend.reviewcatcher.net/api/v1/",
    withCredentials: true,
});

export const getTest = () => 
    Instance.get(`tasks/test`).then((response) => response.data);

export const getUser = () => 
    Instance.get(`users/me`).then((response) => response.data);

export const logIn = (username: string, password: string) => 
    Instance.post(`users/log-in`, {
        username,
        password,
    }, {
        headers: {
            "X-CSRFToken": Cookies.get("csrftoken") || "",
        },
    })
    .then((response) => response.data);

export const logOut = () => 
    Instance.post(
        `users/log-out`, null, {
            headers: {
                "X-CSRFToken": Cookies.get("csrftoken") || "",
            },
        })
        .then((response) => response.data);

export const usernameSignUp = ({name, username, email, password}: ISignUp) => 
    Instance.post(`users/sign-up`, {
        name,
        username,
        email,
        password,
    }, {
        headers: {
            "X-CSRFToken": Cookies.get("csrftoken") || "",
        },
    })
    .then((response) => response.data)
    .catch(error => {
        console.error("Error details:", error.response?.data);
        throw error;
    });

export const checkUsername = (username: string) =>
    Instance.post(`users/check-username`, {
        username,
    }, {
        headers: {
            "X-CSRFToken": Cookies.get("csrftoken") || "",
        },
    })
    .then((response) => response.data);

export const TasksUpdateByDate = () => 
    Instance.get('tasks/date-update').then((response) => response.data);

export const getTasks = () => 
    Instance.get(`tasks/`).then((response) => response.data);

export const getTasksTotal = () => 
    Instance.get(`tasks/total`).then((response) => response.data);

export const getTaskDetail = (taskId: string) => 
    Instance.get(`tasks/${taskId}`).then((response) => response.data);

export const getPlatforms = () => 
    Instance.get(`tasks/platforms`).then((response) => response.data);

export const addTask = (task: ITaskAdd) => 
    Instance.post(`tasks/`, 
        task,
    {
        headers: {
            "X-CSRFToken": Cookies.get("csrftoken") || "",
        },
    })
    .then((response) => response.data)
    .catch(error => {
        console.error("Error details:", error.response?.data);
        throw error;
    });

export const updateTaskStatus = (taskId: string, status: string) => 
    Instance.post(`tasks/${taskId}/status`, {
        status,
    }, {
        headers: {
            "X-CSRFToken": Cookies.get("csrftoken") || "",
        },
    })
    .then((response) => response.data)
    .catch(error => {
        console.error("Error details:", error.response?.data);
        throw error;
    }); 

export const ModifyTask = (taskId: string, task: ITaskAdd) => 
    Instance.put(`tasks/${taskId}/modify`, task, {
        headers: {
            "X-CSRFToken": Cookies.get("csrftoken") || "",
        },
    })
    .then((response) => response.data);

export const addPlatform = (platform: IPlatformAdd) => 
    Instance.post(`tasks/platforms/add`, platform, {
        headers: {
            "X-CSRFToken": Cookies.get("csrftoken") || "",
        },
    })
    .then((response) => response.data);


export const deleteTask = (taskId: string) => 
    Instance.delete(`tasks/${taskId}/delete`, {
        headers: {
            "X-CSRFToken": Cookies.get("csrftoken") || "",
        },
    })
    .then((response) => response.data)
    .catch(error => {
        console.error("Error details:", error.response?.data);
        throw error;
    });