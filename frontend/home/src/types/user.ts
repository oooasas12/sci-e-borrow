import { Branch, PositionFac, PositionBranch } from "./general";

export interface User {
    id: string | number,
    name: string,
    username: string,
    password: string,
    position_fac: PositionFac,
    branch: Branch,
    position_branch: PositionBranch
}