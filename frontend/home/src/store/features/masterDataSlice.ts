import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Branch, PositionBranch, PositionFac, EquipmentGroup, EquipmentStatus, ApprovalStatus, EquipmentName, Unit, BudgetSource } from '@/types/general';

interface MasterDataState {
  branch: Branch[];
  positionBranch: PositionBranch[];
  positionFac: PositionFac[];
  equipmentGroup: EquipmentGroup[];
  equipmentStatus: EquipmentStatus[];
  approvalStatus: ApprovalStatus[];
  equipmentName: EquipmentName[];
  unit: Unit[];
  budgetSource: BudgetSource[];
}

const initialState: MasterDataState = {
  branch: [],
  positionBranch: [],
  positionFac: [],
  equipmentGroup: [],
  equipmentStatus: [],
  approvalStatus: [],
  equipmentName: [],
  unit: [],
  budgetSource: []
};

const masterDataSlice = createSlice({
  name: 'masterData',
  initialState,
  reducers: {
    setBranch: (state, action: PayloadAction<Branch[]>) => {
      state.branch = action.payload;
    },
    setPositionBranch: (state, action: PayloadAction<PositionBranch[]>) => {
      state.positionBranch = action.payload;
    },
    setPositionFac: (state, action: PayloadAction<PositionFac[]>) => {
      state.positionFac = action.payload;
    },
    setEquipmentGroup: (state, action: PayloadAction<EquipmentGroup[]>) => {
      state.equipmentGroup = action.payload;
    },
    setEquipmentStatus: (state, action: PayloadAction<EquipmentStatus[]>) => {
      state.equipmentStatus = action.payload;
    },
    setApprovalStatus: (state, action: PayloadAction<ApprovalStatus[]>) => {
      state.approvalStatus = action.payload;
    },
    setEquipmentName: (state, action: PayloadAction<EquipmentName[]>) => {
      state.equipmentName = action.payload;
    },
    setUnit: (state, action: PayloadAction<Unit[]>) => {
      state.unit = action.payload;
    },
    setBudgetSource: (state, action: PayloadAction<BudgetSource[]>) => {
      state.budgetSource = action.payload;
    },
  },
});

export const {
  setBranch,
  setPositionBranch,
  setPositionFac,
  setEquipmentGroup,
  setEquipmentStatus,
  setApprovalStatus,
  setEquipmentName,
  setUnit,
  setBudgetSource,
} = masterDataSlice.actions;

export default masterDataSlice.reducer;