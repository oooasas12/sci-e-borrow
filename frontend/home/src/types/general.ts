export interface Group {
    id: string | number,
    name: String,
}

export interface Branch {
    id: number;
    name: string;
}

export interface Faculty {
    id: string | number,
    name: String,
}

export interface PositionBranch {
    id: number;
    name: string;
    branch_id: number;
}

export interface PositionFac {
    id: number;
    name: string;
}

export interface EquipmentGroup {
    id: number;
    name: string;
}

export interface EquipmentStatus {
    id: number;
    name: string;
}

export interface ApprovalStatus {
    id: number;
    name: string;
}

export interface EquipmentName {
    id: number;
    name: string;
    group_id: number;
}

export interface Unit {
    id: number;
    name: string;
}

export interface BudgetSource {
    id: number;
    name: string;
}