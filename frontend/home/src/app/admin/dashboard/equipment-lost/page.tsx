"use client";
import React, { useEffect, useState } from "react";
import Layout from "@/Layouts/default";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { Input } from "@/components/ui/input";
import { FaCheck, FaXmark } from "react-icons/fa6";
import { useForm, SubmitHandler } from "react-hook-form";
import { CheckIcon } from "lucide-react";
import ButtonPrimary from "@/components/button/buttonPrimary";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete, MdEditSquare } from "react-icons/md";
import PaginationList from "@/components/pagination/PaginationList";
import { IoIosArrowDown } from "react-icons/io";
import ListBoxComponent from "@/components/ListBox/ListBox";
import { Equipment } from "@/types/equipment";
import { toast, Toaster } from "react-hot-toast";
import FilterListBox from "@/components/ListBox/FilterListBox";
import {
  BudgetSource,
  Branch,
  Unit,
  EquipmentStatus,
  EquipmentName,
} from "@/types/general";
import { EquipmentGroup } from "@/types/general";

const EquipmentPage: React.FC = () => {
  const {
    register: registerInsert,
    handleSubmit: handleSubmitInsert,
    formState: { errors: errorsInsert },
    reset: resetInsert,
  } = useForm<Equipment>();

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    setValue,
    formState: { errors: errorsEdit },
    reset: resetEdit,
  } = useForm<Equipment>();

  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<Equipment[]>([]);
  const [filteredData, setFilteredData] = useState<Equipment[]>([]);
  const [openInsertData, setOpenInsertData] = useState(false);
  const [openEditData, setOpenEditData] = useState(false);
  const [openDelData, setOpenDelData] = useState(false);
  const [selectedFilterBranch, setSelectedFilterBranch] = useState<string[]>(
    [],
  );
  const [errorInput, setErrorInput] = useState({
    equipmentName: false,
    equipmentGroup: false,
    equipmentStatus: false,
    budgetSource: false,
    unit: false,
  });
  const [editData, setEditData] = useState<Equipment>();
  const [delData, setDelData] = useState({
    index: 0,
    name: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [equipmentName, setEquipmentName] = useState<EquipmentName[]>([]);
  const [equipmentGroup, setEquipmentGroup] = useState<EquipmentGroup[]>([]);
  const [equipmentStatus, setEquipmentStatus] = useState<EquipmentStatus[]>([]);
  const [budgetSource, setBudgetSource] = useState<BudgetSource[]>([]);
  const [unit, setUnit] = useState<Unit[]>([]);
  const [selectedEquipmentName, setSelectedEquipmentName] =
    useState<EquipmentName>({ id: 0, name: "" });
  const [selectedEquipmentGroup, setSelectedEquipmentGroup] =
    useState<EquipmentGroup>({ id: 0, name: "", code: "" });
  const [selectedEquipmentStatus, setSelectedEquipmentStatus] =
    useState<EquipmentStatus>({ id: 0, name: "" });
  const [selectedBudgetSource, setSelectedBudgetSource] =
    useState<BudgetSource>({ id: 0, name: "" });
  const [selectedUnit, setSelectedUnit] = useState<Unit>({ id: 0, name: "" });
  const [selectedBranch, setSelectedBranch] = useState<Branch>({
    id: 0,
    name: "",
  });
  const [selectedFilterEquipmentGroup, setSelectedFilterEquipmentGroup] =
    useState<string[]>([]);
  const [selectedFilterEquipmentStatus, setSelectedFilterEquipmentStatus] =
    useState<string[]>([]);
  const [selectedFilterEquipmentName, setSelectedFilterEquipmentName] =
    useState<string[]>([]);

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [
          equipmentNameRes,
          equipmentGroupRes,
          equipmentStatusRes,
          budgetSourceRes,
          unitRes,
        ] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/equipment-name`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/equipment-group`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/equipment-status`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/budget-source`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/unit`),
        ]);

        const [
          equipmentNameData,
          equipmentGroupData,
          equipmentStatusData,
          budgetSourceData,
          unitData,
        ] = await Promise.all([
          equipmentNameRes.json(),
          equipmentGroupRes.json(),
          equipmentStatusRes.json(),
          budgetSourceRes.json(),
          unitRes.json(),
        ]);

        setEquipmentName(equipmentNameData.data);
        setEquipmentGroup(equipmentGroupData.data);
        setEquipmentStatus(equipmentStatusData.data);
        setBudgetSource(budgetSourceData.data);
        setUnit(unitData.data);
      } catch (error) {
        console.error("Error fetching master data:", error);
        toast.error("ไม่สามารถดึงข้อมูลพื้นฐานได้");
      }
    };

    fetchMasterData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/equipment/find-data-lost`,
      );
      const result = await response.json();
      console.log("result :: ", result.data);

      setData(result.data);
      setFilteredData(result.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let results = data;

    if (selectedFilterEquipmentGroup.length > 0) {
      results = results.filter((item) =>
        selectedFilterEquipmentGroup.includes(
          item.equipment_group.name.toLowerCase(),
        ),
      );
    }

    if (selectedFilterEquipmentStatus.length > 0) {
      results = results.filter((item) =>
        selectedFilterEquipmentStatus.includes(
          item.equipment_status.name.toLowerCase(),
        ),
      );
    }

    if (selectedFilterEquipmentName.length > 0) {
      results = results.filter((item) =>
        selectedFilterEquipmentName.includes(
          item.equipment_name.name.toLowerCase(),
        ),
      );
    }

    results = results.filter(
      (item) =>
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.equipment_name.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.equipment_group.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
    );
    setFilteredData(results);
  }, [
    searchTerm,
    selectedFilterEquipmentGroup,
    selectedFilterEquipmentStatus,
    selectedFilterEquipmentName,
  ]);

  const filterEquipmentGroup = (value: string) => {
    if (value === "all") {
      setSelectedFilterEquipmentGroup([]); // ถ้าเลือก 'ทั้งหมด' จะล้างการเลือกทั้งหมด
      return []; // ถ้าเลือก 'ทั้งหมด' จะล้างการเลือกทั้งหมด
    }
    if (selectedFilterEquipmentGroup.includes(value)) {
      setSelectedFilterEquipmentGroup(
        selectedFilterEquipmentGroup.filter(
          (item) => item !== value.toLowerCase(),
        ),
      );
    } else {
      setSelectedFilterEquipmentGroup([...selectedFilterEquipmentGroup, value]);
    }
  };

  const filterEquipmentStatus = (value: string) => {
    if (value === "all") {
      setSelectedFilterEquipmentStatus([]); // ถ้าเลือก 'ทั้งหมด' จะล้างการเลือกทั้งหมด
      return []; // ถ้าเลือก 'ทั้งหมด' จะล้างการเลือกทั้งหมด
    }
    if (selectedFilterEquipmentStatus.includes(value)) {
      setSelectedFilterEquipmentStatus(
        selectedFilterEquipmentStatus.filter(
          (item) => item !== value.toLowerCase(),
        ),
      );
    } else {
      setSelectedFilterEquipmentStatus([
        ...selectedFilterEquipmentStatus,
        value,
      ]);
    }
  };

  const filterEquipmentName = (value: string) => {
    if (value === "all") {
      setSelectedFilterEquipmentName([]);
      return [];
    }
    if (selectedFilterEquipmentName.includes(value)) {
      setSelectedFilterEquipmentName(
        selectedFilterEquipmentName.filter(
          (item) => item !== value.toLowerCase(),
        ),
      );
    } else {
      setSelectedFilterEquipmentName([...selectedFilterEquipmentName, value]);
    }
  };

  const onSubmit = async (data: Equipment) => {
    // เพิ่มข้อมูลจาก state ของ ListBox components
    const formData = {
      ...data,
      equipment_group: selectedEquipmentGroup,
      equipment_name: selectedEquipmentName,
      budget_source: selectedBudgetSource,
      unit: selectedUnit,
    };

    if (!formData.equipment_group?.id) {
      setErrorInput({ ...errorInput, equipmentGroup: true });
      return;
    }
    if (!formData.equipment_name?.id) {
      setErrorInput({ ...errorInput, equipmentName: true });
      return;
    }
    if (!formData.budget_source?.id) {
      setErrorInput({ ...errorInput, budgetSource: true });
      return;
    }
    if (!formData.unit?.id) {
      setErrorInput({ ...errorInput, unit: true });
      return;
    }

    const apiFormData = new FormData();
    apiFormData.append("code", formData.code);
    apiFormData.append("value", formData.value);
    apiFormData.append(
      "date_come",
      formData.date_come instanceof Date
        ? formData.date_come.toISOString()
        : formData.date_come,
    );
    apiFormData.append("feature", formData.feature);
    apiFormData.append("location", formData.location);
    apiFormData.append(
      "equipment_group_id",
      String(formData.equipment_group.id),
    );
    apiFormData.append("equipment_status_id", "1");
    apiFormData.append("equipment_name_id", String(formData.equipment_name.id));
    apiFormData.append("budget_source_id", String(formData.budget_source.id));
    apiFormData.append("unit_id", String(formData.unit.id));
    apiFormData.append("code_old", formData.code_old);

    toast.promise(
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/equipment`, {
        method: "POST",
        body: apiFormData,
      }),
      {
        loading: "กำลังเพิ่มข้อมูล...",
        success: () => {
          setErrorInput({
            equipmentName: false,
            equipmentGroup: false,
            equipmentStatus: false,
            budgetSource: false,
            unit: false,
          });
          setSelectedEquipmentGroup({ id: 0, name: "", code: "" });
          setSelectedEquipmentStatus({ id: 0, name: "" });
          setSelectedEquipmentName({ id: 0, name: "" });
          setOpenInsertData(false);
          resetInsert();
          fetchData();
          return "เพิ่มข้อมูลครุภัณฑ์สำเร็จ";
        },
        error: "ไม่สามารถเพิ่มข้อมูลครุภัณฑ์ได้",
      },
    );
  };

  const onSubmitEdit = async (data: Equipment) => {
    console.log("test data :: ", data);

    if (!data.equipment_group) {
      setErrorInput({ ...errorInput, equipmentGroup: true });
      return;
    }
    if (!data.equipment_name) {
      setErrorInput({ ...errorInput, equipmentName: true });
      return;
    }
    if (!data.budget_source) {
      setErrorInput({ ...errorInput, budgetSource: true });
      return;
    }
    if (!data.unit) {
      setErrorInput({ ...errorInput, unit: true });
      return;
    }

    const formData = new FormData();
    formData.append("id", String(data.id));
    formData.append("code", data.code);
    formData.append("value", data.value);
    formData.append(
      "date_come",
      data.date_come instanceof Date
        ? data.date_come.toISOString()
        : data.date_come,
    );
    formData.append("feature", data.feature);
    formData.append("location", data.location);
    formData.append("equipment_group_id", String(data.equipment_group.id));
    formData.append("equipment_name_id", String(data.equipment_name.id));
    formData.append("budget_source_id", String(data.budget_source.id));
    formData.append("unit_id", String(data.unit.id));
    formData.append("code_old", data.code_old);

    toast.promise(
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/equipment/${data.id}`, {
        method: "PATCH",
        body: formData,
      }),
      {
        loading: "กำลังแก้ไขข้อมูล...",
        success: () => {
          setErrorInput({
            equipmentName: false,
            equipmentGroup: false,
            equipmentStatus: false,
            budgetSource: false,
            unit: false,
          });
          setSelectedEquipmentGroup({ id: 0, name: "", code: "" });
          setSelectedEquipmentName({ id: 0, name: "" });
          setSelectedBudgetSource({ id: 0, name: "" });
          setSelectedUnit({ id: 0, name: "" });
          setOpenEditData(false);
          resetEdit();
          fetchData();
          return "แก้ไขข้อมูลครุภัณฑ์สำเร็จ";
        },
        error: "ไม่สามารถแก้ไขข้อมูลครุภัณฑ์ได้",
      },
    );
  };

  const handleEdit = (data: Equipment) => {
    const dateCome =
      data.date_come instanceof Date
        ? data.date_come
        : new Date(data.date_come);
    dateCome.setDate(dateCome.getDate() + 1);
    resetEdit();
    setValue("id", data.id);
    setValue("code", data.code);
    setValue("value", data.value);
    setValue("date_come", dateCome.toISOString().split("T")[0]);
    setValue("feature", data.feature);
    setValue("location", data.location);
    setValue("equipment_group", data.equipment_group);
    setValue("equipment_status", data.equipment_status);
    setValue("equipment_name", data.equipment_name);
    setValue("budget_source", data.budget_source);
    setValue("unit", data.unit);
    setValue("code_old", data.code_old);
    setOpenEditData(true);
    setSelectedEquipmentGroup(data.equipment_group);
    setSelectedEquipmentStatus(data.equipment_status);
    setSelectedEquipmentName(data.equipment_name);
    setSelectedBudgetSource(data.budget_source);
    setSelectedUnit(data.unit);
  };

  const perPageSelectorHandler = (perPage: number) => {
    setCurrentPage(1);
    setPerPage(perPage);
  };

  const pageDirectHandler = (index: number) => {
    setCurrentPage(index + 1);
  };

  const handleDel = (index: number, name: string) => {
    setDelData({
      index: index,
      name: name,
    });
    setOpenDelData(true);
  };

  const handleSlectEquipmentName = (value: EquipmentName) => {
    setSelectedEquipmentName(value);
    setValue("equipment_name", value);
  };

  const handleSlectEquipmentGroup = (value: EquipmentGroup) => {
    setSelectedEquipmentGroup(value);
    setValue("equipment_group", value);
  };

  const handleSlectBudgetSource = (value: BudgetSource) => {
    setSelectedBudgetSource(value);
    setValue("budget_source", value);
  };

  const handleSlectUnit = (value: Unit) => {
    setSelectedUnit(value);
    setValue("unit", value);
  };

  return (
    <Layout>
      <div className="container">
        <Toaster position="bottom-right" reverseOrder={false} />
        <h1 className="title lg text-font_color">รายการครุภัณฑ์ที่สูญหาย</h1>
        <div className="mt-8 flex flex-col gap-4">
          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              <Input
                type="text"
                placeholder="ค้นหา..."
                className="w-[300px] min-w-[250px] bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="flex gap-2">
                <FilterListBox
                  placeholder="ประเภทครุภัณฑ์"
                  selected={selectedFilterEquipmentGroup}
                  item={equipmentGroup}
                  filter={filterEquipmentGroup}
                />
                <FilterListBox
                  placeholder="สถานะครุภัณฑ์"
                  selected={selectedFilterEquipmentStatus}
                  item={equipmentStatus}
                  filter={filterEquipmentStatus}
                />
                <FilterListBox
                  placeholder="ชื่อครุภัณฑ์"
                  selected={selectedFilterEquipmentName}
                  item={equipmentName}
                  filter={filterEquipmentName}
                />
              </div>
            </div>
          </div>
          <Table className="rounded-lg border">
            <TableHeader>
              <TableRow className="">
                <TableHead className="whitespace-nowrap">#</TableHead>
                <TableHead className="whitespace-nowrap">
                  รหัสครุภัณฑ์
                </TableHead>
                <TableHead className="whitespace-nowrap">
                  รายการครุภัณฑ์
                </TableHead>
                <TableHead className="whitespace-nowrap">
                  ประเภทครุภัณฑ์
                </TableHead>
                <TableHead className="whitespace-nowrap">หน่วยนับ</TableHead>
                <TableHead className="whitespace-nowrap">
                  มูลค่าครุภัณฑ์
                </TableHead>
                <TableHead className="whitespace-nowrap">วันที่ได้มา</TableHead>
                <TableHead className="whitespace-nowrap">แหล่งเงิน</TableHead>
                <TableHead className="whitespace-nowrap">
                  คุณสมบัติ (ยี่ห่อ/รุ่น)
                </TableHead>
                <TableHead className="whitespace-nowrap">
                  หมายเหตุ/เลขครุภัณฑ์เดิม
                </TableHead>
                <TableHead className="whitespace-nowrap">
                  สถานที่ตั้ง/จัดเก็บ
                </TableHead>
                <TableHead className="whitespace-nowrap text-center">
                  สถานะครุภัณฑ์
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData
                .slice(currentPage * perPage - perPage, currentPage * perPage)
                .map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.code}</TableCell>
                    <TableCell>{item.equipment_name.name}</TableCell>
                    <TableCell>{item.equipment_group.name}</TableCell>
                    <TableCell>{item.unit.name}</TableCell>
                    <TableCell>{item.value}</TableCell>
                    <TableCell>
                      {new Date(item.date_come).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>{item.budget_source.name}</TableCell>
                    <TableCell>{item.feature}</TableCell>
                    <TableCell>{item.code_old}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>
                      <span
                        className={`${
                          item.equipment_status.id === 3
                            ? "flex items-center justify-center rounded-full bg-yellow-500 px-2 py-1 text-white"
                            : item.equipment_status.id === 5
                              ? "flex items-center justify-center rounded-full bg-green-500 px-2 py-1 text-white"
                              : item.equipment_status.id === 4
                                ? "flex items-center justify-center rounded-full bg-red-500 px-2 py-1 text-white"
                                : ""
                        }`}
                      >
                        {item.equipment_status.name}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <div className="flex w-full justify-between">
            <PaginationList
              current_page={currentPage}
              items_per_page={perPage}
              total_item={filteredData.length}
              onPerPageSelector={perPageSelectorHandler}
              pageDirectHandler={pageDirectHandler}
            />
          </div>
        </div>
      </div>
      {loading && <div>กำลังโหลด...</div>}
    </Layout>
  );
};

export default EquipmentPage;
