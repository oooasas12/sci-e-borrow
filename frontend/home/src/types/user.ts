import { Branch, Faculty, Group } from "./general";

export interface User {
    id: string | number,
    name: string,
    username: string,
    password: string,
    fac: Faculty,
    group: Group,
    branch: Branch
}