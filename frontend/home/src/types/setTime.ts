import { User } from "./user";

export interface SetTime {
    id: number;
    date_start: Date | string;
    date_stop: Date | string;
    time_start: string;
    time_stop: string;
    note: string;
    user: User;
}


