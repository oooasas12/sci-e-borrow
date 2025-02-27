import { Equipment } from './equipment';
import { BudgetSource, EquipmentGroup, EquipmentName, EquipmentStatus, Unit } from './general';
import { User } from './user';

export interface EquipmentBroken {
  id: number;
  date_broken: Date | string;
  date_end_repair: Date | string;
  detail: string;
  equipment: Equipment;
  equipment_status: EquipmentStatus;
  user: User;
}