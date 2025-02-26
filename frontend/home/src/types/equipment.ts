import { BudgetSource, EquipmentGroup, EquipmentName, EquipmentStatus, Unit } from './general';

export interface Equipment {
  id: number;
  code: string;
  value: string;
  date_come: Date | string;
  feature: string;
  location: string;
  equipment_status: EquipmentStatus;
  budget_source: BudgetSource;
  unit: Unit;
  equipment_group: EquipmentGroup;
  equipment_name: EquipmentName;
  code_old: string;
}