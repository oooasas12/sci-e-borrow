import { User } from './user';
import { ApprovalStatus } from './general';
import { Equipment } from './equipment';
export interface BorrowList {
  id: number;
  date_borrow: Date | string;
  date_return: Date | string;
  doc_borrow: string;
  doc_return: string;
  user: User;
  approval_status_borrow: ApprovalStatus;
  approval_status_return: ApprovalStatus;
}

export interface BorrowListDetail {
  id: number;
  borrow_list: BorrowList;
  equipment: Equipment;
}


