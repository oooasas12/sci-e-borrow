export interface Group {
    id: number,
    name: string,
}

export interface Branch {
    id: number;
    name: string;
}

export interface Faculty {
    id: string | number,
    name: string,
}

export interface PositionBranch {
    id: number;
    name: string;
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