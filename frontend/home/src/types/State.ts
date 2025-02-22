import { Branch, Faculty, Group } from "./general";

export interface UserState {
    user: {
        id: string | number,
        name: string,
        username: string,
        password: string,
        fac: Faculty,
        group: Group,
        branch: Branch
    } | null;
    isAuthenticated: boolean;
  }