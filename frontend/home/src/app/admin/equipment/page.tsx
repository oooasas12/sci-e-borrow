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
import {
  FaCheck,
  FaCircleExclamation,
  FaXmark,
  FaFilePdf,
} from "react-icons/fa6";
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
import { FaEdit, FaEye, FaSearch, FaTrash } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import html2pdf from "html2pdf.js";
import { HiOutlineDotsVertical } from "react-icons/hi";

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
  const [openShowEquipment, setOpenShowEquipment] = useState(false);
  const [ShowEquipment, setShowEquipment] = useState<Equipment | null>(null);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [filterDateStart, setFilterDateStart] = useState<string>("");
  const [filterDateEnd, setFilterDateEnd] = useState<string>("");
  const [openAdd, setOpenAdd] = useState(false);
  const [openExportPDF, setOpenExportPDF] = useState(false);
  const [selectedGroupsForExport, setSelectedGroupsForExport] = useState<
    number[]
  >([]);
  const [selectedStatusesForExport, setSelectedStatusesForExport] = useState<
    number[]
  >([]);
  const [testData, setTestData] = useState<Equipment[][]>([]);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

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
        `${process.env.NEXT_PUBLIC_API_URL}/equipment`,
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

    if (filterDateStart && filterDateEnd) {
      results = results.filter((item) => {
        const itemDate = new Date(item.date_come);
        return (
          itemDate >= new Date(filterDateStart) &&
          itemDate <= new Date(filterDateEnd)
        );
      });
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
    filterDateStart,
    filterDateEnd,
  ]);

  const clearDateFilter = () => {
    setFilterDateStart("");
    setFilterDateEnd("");
  };

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

    const dateCome =
      formData.date_come instanceof Date
        ? formData.date_come
        : new Date(formData.date_come);
    apiFormData.append("date_come", dateCome.toISOString().split("T")[0]);
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
          fetchData();
          resetInsert();
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
    const dateCome =
      data.date_come instanceof Date
        ? data.date_come
        : new Date(data.date_come);
    formData.append("date_come", dateCome.toISOString().split("T")[0]);
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

  const [equipmentLastUse, setEquipmentLastUse] = useState<string>("");
  const handleShowEquipment = (item: Equipment) => {
    const fetchEquipmentLastUse = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/borrow-list/equipment-last-use/${item.id}`,
      );
      const data = await response.json();
      if (response.ok) {
        setEquipmentLastUse(data.data.user.name);
      } else {
        setEquipmentLastUse("-");
      }
    };
    fetchEquipmentLastUse();
    setShowEquipment(item);
    setOpenShowEquipment(true);
  };

  const handleOpenExportPDFDialog = () => {
    // ตั้งค่าเริ่มต้นให้เลือกทุกกลุ่มและทุกสถานะ
    setSelectedGroupsForExport(equipmentGroup.map((group) => group.id));
    setSelectedStatusesForExport(equipmentStatus.map((status) => status.id));
    setOpenExportPDF(true);
  };

  // ฟังก์ชันสำหรับการเช็ค/ยกเลิกเช็คตัวกรองประเภทครุภัณฑ์
  const handleGroupFilterChange = (groupId: number, checked: boolean) => {
    if (checked) {
      setSelectedGroupsForExport((prev) => [...prev, groupId]);
    } else {
      setSelectedGroupsForExport((prev) => prev.filter((id) => id !== groupId));
    }
  };

  // ฟังก์ชันสำหรับการเช็ค/ยกเลิกเช็คตัวกรองสถานะ
  const handleStatusFilterChange = (statusId: number, checked: boolean) => {
    if (checked) {
      setSelectedStatusesForExport((prev) => [...prev, statusId]);
    } else {
      setSelectedStatusesForExport((prev) =>
        prev.filter((id) => id !== statusId),
      );
    }
  };

  const handleExportPDF = async () => {
    // กรองข้อมูลตามตัวกรองที่เลือก
    let filteredForExport = [...filteredData];

    // แยกข้อมูลตามกลุ่มครุภัณฑ์เป็น array ของแต่ละกลุ่ม
    const groupedData = selectedGroupsForExport
      .map((groupId) => {
        return filteredForExport.filter(
          (item) =>
            item.equipment_group.id === groupId &&
            selectedStatusesForExport.includes(item.equipment_status.id),
        );
      })
      .filter((group) => group.length > 0); // กรองกลุ่มที่ไม่มีข้อมูลออก

    // เรียงลำดับข้อมูลในแต่ละกลุ่ม
    groupedData.forEach((group) => {
      group.sort((a, b) => {
        // เรียงตามสถานะ
        const statusCompare = a.equipment_status.name.localeCompare(
          b.equipment_status.name,
        );
        if (statusCompare !== 0) return statusCompare;

        // เรียงตามชื่อครุภัณฑ์
        return a.equipment_name.name.localeCompare(b.equipment_name.name);
      });
    });

    // กำหนดค่าให้ sortedData เป็น array ของ array ที่แยกตามกลุ่ม

    setTestData(groupedData);
    console.log("groupedData ::", groupedData);

    // แปลง base64 ของโลโก้
    const logoUrl = "/images/logo-sru.png";
    const logoResponse = await fetch(logoUrl);
    const logoBlob = await logoResponse.blob();
    const logoBase64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(logoBlob);
    });

    // สร้าง element ชั่วคราวสำหรับ PDF
    const tempContainer = document.createElement("div");
    tempContainer.style.cssText =
      "font-family: sarabun, sans-serif; color: black;";
    document.body.appendChild(tempContainer);

    // สร้างเนื้อหา PDF
    let pdfContent =
      `<div>` +
      `<div style="display: flex; justify-content: space-between; align-items: flex-end; gap: 10px;">` +
      `<div style="display: flex; gap: 8px; align-items: flex-end;">` +
      `<img src="/images/logo-sru.png" alt="logo" style="width: 50px; height: 60px;"/>` +
      `<div style="display: flex; flex-direction: column; gap: 6px;">` +
      `<h1 style="font-size: 12px; font-weight: bold;">มหาวิทยาลัยราชภัฏสุราษฎร์ธานี</h1>` +
      `<p style="font-size: 12px; font-weight: bold;">ระบบคลังพัสดุ</p>` +
      `</div>` +
      `</div>` +
      `<div style="display: flex; flex-direction: column; gap: 12px;">` +
      `<h1 style="font-size: 16px; font-weight: bold;">รายงานรายการครุภัณฑ์</h1>` +
      `<p style="font-size: 10px;">013 : คลังคณะวิทยาศาสตร์และเทคโนโลยี</p>` +
      `</div>` +
      `</div>` +
      `<div style="width: 100%; height: 2px; background-color: black; margin: 10px 0px;"></div>` +
      groupedData
        .map((group, index) => {
          return (
            `<div key="${index}">` +
            `<p style="font-size: 10px; font-weight: bold;">กลุ่มพัสดุ ${group[0]?.equipment_group?.code} : ${group[0]?.equipment_group?.name}</p>` +
            `<div style="width: 100%; padding: 20px 0px;">` +
            `<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 10px;">` +
            `<thead>` +
            `<tr style="background-color: #d1d5db;">` +
            `<th style="border: 1px solid black; padding: 10px; text-align: center; width: 5%; margin: auto auto;">ลำดับ</th>` +
            `<th style="border: 1px solid black; padding: 10px; text-align: center; width: 10%;">รหัสครุภัณฑ์</th>` +
            `<th style="border: 1px solid black; padding: 10px; text-align: center; width: 17%;">รายการครุภัณฑ์</th>` +
            `<th style="border: 1px solid black; padding: 10px; text-align: center; width: 5%;">ปกติ</th>` +
            `<th style="border: 1px solid black; padding: 10px; text-align: center; width: 5%;">ชำรุด</th>` +
            `<th style="border: 1px solid black; padding: 10px; text-align: center; width: 5%;">เสื่อมสภาพ</th>` +
            `<th style="border: 1px solid black; padding: 10px; text-align: center; width: 5%;">สูญหาย</th>` +
            `<th style="border: 1px solid black; padding: 10px; text-align: center; width: 5%;">หน่วยนับ</th>` +
            `<th style="border: 1px solid black; padding: 10px; text-align: center; width: 5%;">มูลค่าครุภัณฑ์</th>` +
            `<th style="border: 1px solid black; padding: 10px; text-align: center; width: 5%;">วันที่ได้มา</th>` +
            `<th style="border: 1px solid black; padding: 10px; text-align: center; width: 13%;">แหล่งเงิน</th>` +
            `<th style="border: 1px solid black; padding: 10px; text-align: center; width: 10%;">หมายเหตุ/<br/>เลขครุภัณฑ์เดิม</th>` +
            `<th style="border: 1px solid black; padding: 10px; text-align: center; width: 10%;">สถานที่ตั้ง/<br/>จัดเก็บ</th>` +
            `</tr>` +
            `</thead>` +
            group
              .map(
                (item, index) =>
                  `<tbody>` +
                  `<tr>` +
                  `<td style="border: 1px solid black; padding: 10px; text-align: center;">${index + 1}</td>` +
                  `<td style="border: 1px solid black; padding: 10px; vertical-align: middle;">${item.code}</td>` +
                  `<td style="border: 1px solid black; padding: 10px;">${item.equipment_name.name}</td>` +
                  `<td style="border: 1px solid black; padding: 10px; text-align: center;"><input type="checkbox" ${item.equipment_status.id != 3 && item.equipment_status.id != 4 && item.equipment_status.id != 6 && "checked"} /></td>` +
                  `<td style="border: 1px solid black; padding: 10px; text-align: center;"><input type="checkbox" ${item.equipment_status.id == 3 && "checked"} /></td>` +
                  `<td style="border: 1px solid black; padding: 10px; text-align: center;"><input type="checkbox" ${item.equipment_status.id == 6 && "checked"} /></td>` +
                  `<td style="border: 1px solid black; padding: 10px; text-align: center;"><input type="checkbox" ${item.equipment_status.id == 4 && "checked"} /></td>` +
                  `<td style="border: 1px solid black; padding: 10px; text-align: center;">${item.unit.name}</td>` +
                  `<td style="border: 1px solid black; padding: 10px; text-align: right;">${parseFloat(item.value).toLocaleString("th-TH")}</td>` +
                  `<td style="border: 1px solid black; padding: 10px; text-align: center;">${item.date_come ? new Date(item.date_come).toLocaleDateString("th-TH") : "-"}</td>` +
                  `<td style="border: 1px solid black; padding: 10px;">${item.budget_source.name}</td>` +
                  `<td style="border: 1px solid black; padding: 10px;">${item.code_old || "-"}</td>` +
                  `<td style="border: 1px solid black; padding: 10px;">${item.location || "-"}</td>` +
                  `</tr>` +
                  `</tbody>`,
              )
              .join("") +
            `</table>` +
            `</div>` +
            `</div>`
          );
        })
        .join("") +
      `</div>`;

    tempContainer.innerHTML = pdfContent;

    try {
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `แบบตรวจสอบครุภัณฑ์ประจำปี_${new Date().toLocaleDateString("th-TH")}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: true,
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
        pagebreak: { mode: "avoid-all", before: ".page-break" },
      };

      const pdfBlob = await html2pdf()
        .set(opt)
        .from(tempContainer)
        .toPdf()
        .get("pdf")
        .then((pdf: any) => {
          const totalPages = pdf.internal.getNumberOfPages();
          for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i);
            pdf.setFontSize(10);
            pdf.text(
              `หน้า ${i} จาก ${totalPages}`,
              pdf.internal.pageSize.getWidth() - 30,
              pdf.internal.pageSize.getHeight() - 10,
            );
          }
          return pdf.output("blob");
        });

      // สร้าง URL จาก blob และเปิดในแท็บใหม่
      const url = URL.createObjectURL(pdfBlob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("เกิดข้อผิดพลาดในการสร้าง PDF");
    } finally {
      document.body.removeChild(tempContainer);
    }
  };

  const handleChangeStatus = async (status: number, equipment_id: string) => {
    const formData = new FormData();
    formData.append("equipment_status_id", status.toString());
    await toast.promise(
      (async () => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/equipment/${equipment_id}`,
          {
            method: "PATCH",
            body: formData,
          },
        );

        if (!response.ok) throw new Error("Failed to add data");

        fetchData();
      })(),
      {
        loading: "กำลังเปลี่ยนสถานะครุภัณฑ์...",
        success: "เปลี่ยนสถานะครุภัณฑ์สำเร็จ",
        error: "เกิดข้อผิดพลาดในการเปลี่ยนสถานะครุภัณฑ์",
      },
    );
  };

  return (
    <Layout>
      <div className="container">
        <Toaster position="bottom-right" reverseOrder={false} />
        <h1 className="title lg text-font_color">รายการครุภัณฑ์</h1>
        <div className="mt-8 flex flex-col gap-4">
          <div className="flex flex-col justify-between gap-4 md:flex-row">
            <div className="flex flex-col gap-2">
              <Input
                type="text"
                placeholder="ค้นหา..."
                className="w-[300px] min-w-[250px] bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2 lg:flex-row">
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
                  <button
                    onClick={() => setShowDateFilter(!showDateFilter)}
                    className="flex h-9 w-full items-center justify-between gap-2 rounded-md border bg-white px-2 py-1 transition-all hover:bg-gray-100 lg:w-fit"
                  >
                    <span>กรองตามวันที่ได้มา</span>
                    <IoIosArrowDown
                      className={`text-sm transition-transform ${showDateFilter ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>

                {showDateFilter && (
                  <div className="flex flex-col lg:flex-row  gap-4 rounded-lg bg-gray-50 p-4">
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="filter-date-start"
                        className="text-sm text-gray-600"
                      >
                        ตั้งแต่วันที่
                      </label>
                      <Input
                        id="filter-date-start"
                        type="date"
                        value={filterDateStart}
                        onChange={(e) => setFilterDateStart(e.target.value)}
                        className="bg-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="filter-date-end"
                        className="text-sm text-gray-600"
                      >
                        ถึงวันที่
                      </label>
                      <Input
                        id="filter-date-end"
                        type="date"
                        value={filterDateEnd}
                        min={filterDateStart}
                        onChange={(e) => setFilterDateEnd(e.target.value)}
                        className="bg-white"
                      />
                    </div>
                    <button
                      onClick={clearDateFilter}
                      className="h-10 rounded-md border bg-gray-200 px-4 py-2 text-gray-700 transition-all hover:bg-gray-300"
                    >
                      ล้างตัวกรอง
                    </button>
                    {filterDateStart && filterDateEnd && (
                      <div className="ml-2 text-sm text-gray-600">
                        กำลังกรอง:{" "}
                        {new Date(filterDateStart).toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}{" "}
                        ถึง{" "}
                        {new Date(filterDateEnd).toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex h-fit">
              <button
                onClick={() => setOpenInsertData(true)}
                className="mr-2 flex w-fit items-center gap-2 whitespace-nowrap rounded-lg bg-primary_1 px-6 py-2 text-white transition-all hover:bg-dark"
              >
                <span>เพิ่มรายการ</span>
              </button>
              <button
                onClick={handleOpenExportPDFDialog}
                className="flex w-fit items-center gap-2 whitespace-nowrap rounded-lg bg-red-600 px-6 py-2 text-white transition-all hover:bg-red-700"
              >
                <FaFilePdf />
                <span>ส่งออก PDF</span>
              </button>
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
                <TableHead className="whitespace-nowrap">
                  คุณสมบัติ (ยี่ห่อ/รุ่น)
                </TableHead>
                <TableHead className="whitespace-nowrap text-center">
                  สถานะครุภัณฑ์
                </TableHead>
                <TableHead className="whitespace-nowrap"></TableHead>
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
                    <TableCell>{item.feature}</TableCell>
                    <TableCell>
                      <span
                        className={`${
                          item.equipment_status.id === 1
                            ? "flex items-center justify-center rounded-full bg-green-500 px-2 py-1 text-center text-white"
                            : item.equipment_status.id === 2
                              ? "flex items-center justify-center rounded-full bg-blue-500 px-2 py-1 text-center text-white"
                              : item.equipment_status.id === 4
                                ? "flex items-center justify-center rounded-full bg-red-500 px-2 py-1 text-center text-white"
                                : "flex items-center justify-center rounded-full bg-yellow-500 px-2 py-1 text-center text-white"
                        }`}
                      >
                        {item.equipment_status.name}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Listbox onChange={() => {}} value={null}>
                          {({ open }) => (
                            <div
                              className={`my-scroll relative ${open ? "z-50" : "z-10"}`}
                            >
                              {/* Listbox Button */}
                              <ListboxButton
                                onClick={() =>
                                  setOpenMenuId(open ? null : item.id)
                                }
                                className="flex h-9 w-full items-center justify-center gap-3   text-center shadow-sm  focus:outline-none"
                              >
                                <span className="flex items-center justify-between gap-4 text-sm">
                                  <HiOutlineDotsVertical
                                    className="cursor-pointer text-gray-500"
                                    size={20}
                                  />
                                </span>
                              </ListboxButton>

                              {/* Listbox Options */}
                              <ListboxOptions className="absolute mt-1 max-h-60 -translate-x-1/2 w-fit overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                {equipmentStatus.map((status, index) => (
                                  <ListboxOption
                                    key={index}
                                    value={6}
                                    className={({ active }) =>
                                      `flex cursor-pointer select-none items-center justify-between gap-2 px-4 py-2 ${
                                        active ? "bg-gray-100" : "text-gray-900"
                                      }`
                                    }
                                    onClick={(event) => {
                                      event.preventDefault();
                                      handleChangeStatus(
                                        status.id,
                                        String(item.id),
                                      );
                                    }}
                                  >
                                    <span className="whitespace-pre">{status.name}</span>
                                  </ListboxOption>
                                ))}
                              </ListboxOptions>
                            </div>
                          )}
                        </Listbox>
                        <FaCircleExclamation
                          className="cursor-pointer text-blue-500"
                          size={20}
                          onClick={() => handleShowEquipment(item)}
                        />
                        <MdEditSquare
                          className="cursor-pointer text-yellow-500"
                          onClick={() => {
                            handleEdit(item);
                          }}
                          size={20}
                        />
                        <MdDelete
                          className="cursor-pointer text-red-600"
                          onClick={() => handleDel(item.id, item.code)}
                          size={20}
                        />
                      </div>
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
      <Dialog
        open={openInsertData}
        onClose={() => setOpenInsertData(false)}
        className="relative z-10"
      >
        <DialogBackdrop
          transition
          className="data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in fixed inset-0 bg-gray-500/75 transition-opacity"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-start justify-center gap-4 p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in data-closed:sm:translate-y-0 data-closed:sm:scale-95 relative transform overflow-visible rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl sm:p-6"
            >
              <div className="flex flex-col gap-4">
                <div className="flex justify-between">
                  <DialogTitle
                    as="h2"
                    className="text-base font-semibold text-gray-900"
                  >
                    เพิ่มรายการครุภัณฑ์
                  </DialogTitle>
                  <FaXmark
                    className="cursor-pointer text-gray-400 hover:text-gray-600"
                    onClick={() => setOpenInsertData(false)}
                  />
                </div>
                <form
                  onSubmit={handleSubmitInsert(onSubmit)}
                  className="flex flex-col gap-4"
                >
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm text-font_color">
                      รหัสครุภัณฑ์
                    </label>
                    <Input
                      type="text"
                      placeholder="รหัสครุภัณฑ์"
                      {...registerInsert("code")}
                    />
                    {errorsInsert.code && (
                      <p className="text-red-500">
                        {errorsInsert.code.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="group" className="text-sm text-font_color">
                      รายการชื่อครุภัณฑ์
                    </label>
                    <ListBoxComponent
                      placeholder="รายการชื่อครุภัณฑ์"
                      selectedValue={selectedEquipmentName}
                      options={[
                        { id: 0, name: "เลือกรายการชื่อครุภัณฑ์" },
                        ...equipmentName,
                      ]}
                      onChange={handleSlectEquipmentName}
                    />
                    {errorInput.equipmentName && (
                      <p className="text-sm text-red-500">
                        **โปรดเลือกรายการชื่อครุภัณฑ์
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm text-font_color">
                      มูลค่าครุภัณฑ์
                    </label>
                    <Input
                      type="text"
                      placeholder="มูลค่าครุภัณฑ์"
                      {...registerInsert("value")}
                    />
                    {errorsInsert.value && (
                      <p className="text-red-500">
                        {errorsInsert.value.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm text-font_color">
                      วันที่ได้มา
                    </label>
                    <Input
                      type="date"
                      placeholder="วันที่ได้มา"
                      {...registerInsert("date_come")}
                    />
                    {errorsInsert.date_come && (
                      <p className="text-red-500">
                        {errorsInsert.date_come.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm text-font_color">
                      คุณสมบัติ (ยี่ห่อ/รุ่น)
                    </label>
                    <Input
                      type="text"
                      placeholder="คุณสมบัติ (ยี่ห่อ/รุ่น)"
                      {...registerInsert("feature")}
                    />
                    {errorsInsert.feature && (
                      <p className="text-red-500">
                        {errorsInsert.feature.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm text-font_color">
                      หมายเหตุ/เลขครุภัณฑ์เดิม
                    </label>
                    <Input
                      type="text"
                      placeholder="หมายเหตุ/เลขครุภัณฑ์เดิม"
                      {...registerInsert("code_old")}
                    />
                    {errorsInsert.code_old && (
                      <p className="text-red-500">
                        {errorsInsert.code_old.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm text-font_color">
                      สถานที่ตั้ง/จัดเก็บ
                    </label>
                    <Input
                      type="text"
                      placeholder="สถานที่ตั้ง/จัดเก็บ"
                      {...registerInsert("location")}
                    />
                    {errorsInsert.location && (
                      <p className="text-red-500">
                        {errorsInsert.location.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="budget_source"
                      className="text-sm text-font_color"
                    >
                      แหล่งเงิน
                    </label>
                    <ListBoxComponent
                      placeholder="แหล่งเงิน"
                      selectedValue={selectedBudgetSource}
                      options={[
                        { id: 0, name: "เลือกแหล่งเงิน" },
                        ...budgetSource,
                      ]}
                      onChange={handleSlectBudgetSource}
                    />
                    {errorInput.budgetSource && (
                      <p className="text-sm text-red-500">
                        **โปรดเลือกแหล่งเงิน
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="unit" className="text-sm text-font_color">
                      หน่วยนับ
                    </label>
                    <ListBoxComponent
                      placeholder="หน่วยนับ"
                      selectedValue={selectedUnit}
                      options={[{ id: 0, name: "เลือกหน่วยนับ" }, ...unit]}
                      onChange={handleSlectUnit}
                    />
                    {errorInput.unit && (
                      <p className="text-sm text-red-500">
                        **โปรดเลือกหน่วยนับ
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="equipment_group"
                      className="text-sm text-font_color"
                    >
                      กลุ่มครุภัณฑ์
                    </label>
                    <ListBoxComponent
                      placeholder="กลุ่มครุภัณฑ์"
                      selectedValue={selectedEquipmentGroup}
                      options={[
                        { id: 0, name: "เลือกกลุ่มครุภัณฑ์" },
                        ...equipmentGroup,
                      ]}
                      onChange={handleSlectEquipmentGroup}
                    />
                    {errorInput.equipmentGroup && (
                      <p className="text-sm text-red-500">
                        **โปรดเลือกกลุ่มครุภัณฑ์
                      </p>
                    )}
                  </div>
                  <ButtonPrimary
                    data="เพิ่มรายการ"
                    type="submit"
                    size="small"
                    className="ml-auto"
                  />
                </form>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <Dialog
        open={openEditData}
        onClose={() => setOpenEditData(false)}
        className="relative z-10"
      >
        <DialogBackdrop
          transition
          className="data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in fixed inset-0 bg-gray-500/75 transition-opacity"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-start justify-center gap-4 p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in data-closed:sm:translate-y-0 data-closed:sm:scale-95 relative transform overflow-visible rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl sm:p-6"
            >
              <div className="flex flex-col gap-4">
                <div className="flex justify-between">
                  <DialogTitle
                    as="h2"
                    className="text-base font-semibold text-gray-900"
                  >
                    แก้ไขรายการครุภัณฑ์
                  </DialogTitle>
                  <FaXmark
                    className="cursor-pointer text-gray-400 hover:text-gray-600"
                    onClick={() => setOpenEditData(false)}
                  />
                </div>
                <form
                  onSubmit={handleSubmitEdit(onSubmitEdit)}
                  className="flex flex-col gap-4"
                >
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm text-font_color">
                      รหัสครุภัณฑ์
                    </label>
                    <Input
                      type="text"
                      placeholder="รหัสครุภัณฑ์"
                      {...registerEdit("code")}
                    />
                    {errorsEdit.code && (
                      <p className="text-red-500">{errorsEdit.code.message}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="group" className="text-sm text-font_color">
                      รายการชื่อครุภัณฑ์
                    </label>
                    <ListBoxComponent
                      placeholder="รายการชื่อครุภัณฑ์"
                      selectedValue={selectedEquipmentName}
                      options={[
                        { id: 0, name: "เลือกรายการชื่อครุภัณฑ์" },
                        ...equipmentName,
                      ]}
                      onChange={handleSlectEquipmentName}
                    />
                    {errorInput.equipmentName && (
                      <p className="text-sm text-red-500">
                        **โปรดเลือกรายการชื่อครุภัณฑ์
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm text-font_color">
                      มูลค่าครุภัณฑ์
                    </label>
                    <Input
                      type="text"
                      placeholder="มูลค่าครุภัณฑ์"
                      {...registerEdit("value")}
                    />
                    {errorsEdit.value && (
                      <p className="text-red-500">{errorsEdit.value.message}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm text-font_color">
                      วันที่ได้มา
                    </label>
                    <Input
                      type="date"
                      placeholder="วันที่ได้มา"
                      {...registerEdit("date_come")}
                    />
                    {errorsEdit.date_come && (
                      <p className="text-red-500">
                        {errorsEdit.date_come.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm text-font_color">
                      คุณสมบัติ (ยี่ห่อ/รุ่น)
                    </label>
                    <Input
                      type="text"
                      placeholder="คุณสมบัติ (ยี่ห่อ/รุ่น)"
                      {...registerEdit("feature")}
                    />
                    {errorsEdit.feature && (
                      <p className="text-red-500">
                        {errorsEdit.feature.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm text-font_color">
                      หมายเหตุ/เลขครุภัณฑ์เดิม
                    </label>
                    <Input
                      type="text"
                      placeholder="หมายเหตุ/เลขครุภัณฑ์เดิม"
                      {...registerEdit("code_old")}
                    />
                    {errorsEdit.code_old && (
                      <p className="text-red-500">
                        {errorsEdit.code_old.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm text-font_color">
                      สถานที่ตั้ง/จัดเก็บ
                    </label>
                    <Input
                      type="text"
                      placeholder="สถานที่ตั้ง/จัดเก็บ"
                      {...registerEdit("location")}
                    />
                    {errorsEdit.location && (
                      <p className="text-red-500">
                        {errorsEdit.location.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="budget_source"
                      className="text-sm text-font_color"
                    >
                      แหล่งเงิน
                    </label>
                    <ListBoxComponent
                      placeholder="แหล่งเงิน"
                      selectedValue={selectedBudgetSource}
                      options={[
                        { id: 0, name: "เลือกแหล่งเงิน" },
                        ...budgetSource,
                      ]}
                      onChange={handleSlectBudgetSource}
                    />
                    {errorInput.budgetSource && (
                      <p className="text-sm text-red-500">
                        **โปรดเลือกแหล่งเงิน
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="unit" className="text-sm text-font_color">
                      หน่วยนับ
                    </label>
                    <ListBoxComponent
                      placeholder="หน่วยนับ"
                      selectedValue={selectedUnit}
                      options={[{ id: 0, name: "เลือกหน่วยนับ" }, ...unit]}
                      onChange={handleSlectUnit}
                    />
                    {errorInput.unit && (
                      <p className="text-sm text-red-500">
                        **โปรดเลือกหน่วยนับ
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="equipment_group"
                      className="text-sm text-font_color"
                    >
                      กลุ่มครุภัณฑ์
                    </label>
                    <ListBoxComponent
                      placeholder="กลุ่มครุภัณฑ์"
                      selectedValue={selectedEquipmentGroup}
                      options={[
                        { id: 0, name: "เลือกกลุ่มครุภัณฑ์" },
                        ...equipmentGroup,
                      ]}
                      onChange={handleSlectEquipmentGroup}
                    />
                    {errorInput.equipmentGroup && (
                      <p className="text-sm text-red-500">
                        **โปรดเลือกกลุ่มครุภัณฑ์
                      </p>
                    )}
                  </div>
                  <ButtonPrimary
                    data="ยืนยัน"
                    type="submit"
                    size="small"
                    className="ml-auto"
                  />
                </form>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <Dialog
        open={openDelData}
        onClose={() => setOpenDelData(false)}
        className="relative z-10"
      >
        <DialogBackdrop
          transition
          className="data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in fixed inset-0 bg-gray-500/75 transition-opacity"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-start justify-center gap-4 p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in data-closed:sm:translate-y-0 data-closed:sm:scale-95 relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl sm:p-6"
            >
              <div className="flex flex-col gap-4">
                <div className="flex justify-between">
                  <DialogTitle
                    as="h2"
                    className="text-base font-semibold text-gray-900"
                  >
                    ลบรายการครุภัณฑ์
                  </DialogTitle>
                  <FaXmark
                    className="cursor-pointer text-gray-400 hover:text-gray-600"
                    onClick={() => setOpenDelData(false)}
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <span className="text-font_color">
                    คุณต้องการลบรายการครุภัณฑ์ ชื่อ: <b>{delData.name}</b>{" "}
                    หรือไม่
                  </span>
                  <div className="flex justify-end gap-4">
                    <ButtonPrimary
                      data="ยืนยัน"
                      size="small"
                      className="bg-red-500 hover:bg-red-600"
                      onClick={() => handleDel(delData.index, delData.name)}
                    />
                    <ButtonPrimary
                      data="ยกเลิก"
                      size="small"
                      className="bg-gray-500 hover:bg-gray-600"
                      onClick={() => setOpenDelData(false)}
                    />
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <Dialog
        open={openShowEquipment}
        onClose={() => setOpenShowEquipment(false)}
        className="relative z-10"
      >
        <DialogBackdrop
          transition
          className="data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in fixed inset-0 bg-gray-500/75 transition-opacity"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-start justify-center gap-4 p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in data-closed:sm:translate-y-0 data-closed:sm:scale-95 relative transform overflow-visible rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl sm:p-6"
            >
              <div className="flex flex-col gap-4">
                <div className="flex justify-between">
                  <DialogTitle
                    as="h2"
                    className="text-base font-semibold text-gray-900"
                  >
                    รายละเอียดครุภัณฑ์
                  </DialogTitle>
                  <FaXmark
                    className="cursor-pointer text-gray-400 hover:text-gray-600"
                    onClick={() => setOpenShowEquipment(false)}
                  />
                </div>
                <div className="flex w-fit flex-col gap-4">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-font_color">รหัสครุภัณฑ์</span>
                    <span className="text-font_color">
                      {ShowEquipment?.code}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-font_color">ชื่อครุภัณฑ์</span>
                    <span className="text-font_color">
                      {ShowEquipment?.equipment_name.name}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-font_color">กลุ่มครุภัณฑ์</span>
                    <span className="text-font_color">
                      {ShowEquipment?.equipment_group.name}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-font_color">หน่วยนับ</span>
                    <span className="text-font_color">
                      {ShowEquipment?.unit.name}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-font_color">มูลค่าครุภัณฑ์</span>
                    <span className="text-font_color">
                      {ShowEquipment?.value}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-font_color">วันที่ได้มา</span>
                    <span className="text-font_color">
                      {ShowEquipment?.date_come
                        ? new Date(ShowEquipment?.date_come).toLocaleDateString(
                            "en-US",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            },
                          )
                        : ""}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-font_color">
                      คุณสมบัติ (ยี่ห่อ/รุ่น)
                    </span>
                    <span className="text-font_color">
                      {ShowEquipment?.feature}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-font_color">สถานที่ตั้ง/จัดเก็บ</span>
                    <span className="text-font_color">
                      {ShowEquipment?.location}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-font_color">แหล่งเงิน</span>
                    <span className="text-font_color">
                      {ShowEquipment?.budget_source.name}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-font_color">
                      หมายเหตุ/เลขครุภัณฑ์เดิม
                    </span>
                    <span className="text-font_color">
                      {ShowEquipment?.code_old}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-font_color">ผู้ใช้งานล่าสุด</span>
                    <span className="text-font_color">{equipmentLastUse}</span>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      {/* Modal สำหรับตัวกรองก่อนการส่งออก PDF */}
      <Dialog open={openExportPDF} onClose={() => setOpenExportPDF(false)}>
        <DialogBackdrop className="data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in fixed inset-0 z-40 bg-gray-500/75 transition-opacity" />
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <DialogPanel className="data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in data-closed:scale-95 data-closed:translate-y-4 data-enter:translate-y-0 data-enter:scale-100 w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                ส่งออกรายงานครุภัณฑ์
              </DialogTitle>
              <div className="mt-4">
                <p className="mb-4 text-sm text-gray-500">
                  กรุณาเลือกตัวกรองสำหรับรายงาน
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      กรองตามประเภทครุภัณฑ์
                    </label>
                    <div className="mt-3 flex flex-col gap-2">
                      {equipmentGroup.map((group) => (
                        <div key={group.id} className="flex items-center">
                          <Input
                            type="checkbox"
                            id={`group-${group.id}`}
                            className="h-4 w-4 rounded border-gray-300 text-primary_1 focus:ring-primary_1"
                            checked={selectedGroupsForExport.includes(group.id)}
                            onChange={(e) =>
                              handleGroupFilterChange(
                                group.id,
                                e.target.checked,
                              )
                            }
                          />
                          <label
                            htmlFor={`group-${group.id}`}
                            className="ml-2 text-sm text-gray-700"
                          >
                            {group.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      onClick={() => setOpenExportPDF(false)}
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md bg-primary_1 px-4 py-2 text-sm font-medium text-white hover:bg-dark"
                      onClick={() => {
                        setOpenExportPDF(false);
                        handleExportPDF();
                      }}
                    >
                      ส่งออก PDF
                    </button>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      {loading && <div>กำลังโหลด...</div>}
    </Layout>
  );
};

export default EquipmentPage;
