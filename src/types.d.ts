export interface IUser {    
    id: string;
    email: string;
    name: string;
    username: string;
}

export interface ISignUp {
    name: string;
    username: string;
    email: string;
    password: string;
}

interface IPlatform {
    id: number;
    name: string;
    owner: number;
}

interface IDuty {
    id: number;
    name: string;
}

export interface ITask {
    id: number;
    platform: IPlatform;
    duty: IDuty[];
    client: string;
    task_name: string;
    created_at: string;
    due_date: string;
    type: string;
    status: string;
    money: number;
    owner: number;
    note: string;
}

export interface ITaskTotal {
    total: number;
    start_date: string;
    expired_count: number;
    in_progress_count: number;
    completed_count: number;
    cancelled_count: number;
    food_count: number;
    stuff_count: number;
    active_count: number;
    completed_money: number;
}

export interface ITaskAdd {
    platform_id: number;
    client: string;
    task_name: string;
    created_at: string;
    due_date: string;
    type: string;
    money: number;
    note: string;
}

export interface IPlatformAdd {
    name: string;
}

