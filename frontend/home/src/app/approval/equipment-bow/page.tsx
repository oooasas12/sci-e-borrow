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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaCheck, FaCircleExclamation, FaXmark } from "react-icons/fa6";
import { useForm, SubmitHandler } from "react-hook-form";
import { CheckIcon } from "lucide-react";
import ButtonPrimary from "@/components/button/buttonPrimary";
import { FaArrowAltCircleDown, FaRegEdit } from "react-icons/fa";
import { MdDelete, MdEditSquare } from "react-icons/md";
import PaginationList from "@/components/pagination/PaginationList";
import { IoIosArrowDown } from "react-icons/io";
import toast, { Toaster } from "react-hot-toast";
import ButtonSelectColor from "@/components/button/buttonSelectColor";
import DialogDel from "@/components/dialog/DialogDel";
import DialogEdit from "@/components/dialog/DialogEdit";
import DialogInsert from "@/components/dialog/DialogInsert";
import FilterListBox from "@/components/ListBox/FilterListBox";
import ListBoxComponent from "@/components/ListBox/ListBox";
import { BorrowList, BorrowListDetail } from "@/types/borrowList";
import { Equipment } from "@/types/equipment";
import { useSelector } from "react-redux";
import DialogInsertBorrow from "@/components/dialog/DialogInsertBorrow";
import DialogEditBorrow from "@/components/dialog/DialogEditBorrow";
import { persistStore } from "redux-persist";
import { store } from "@/store/store";
import DialogShowBorrow from "@/components/dialog/DialogShowBorrow";
import DialogShowBorrowApproval from "@/components/dialog/DialogShowBorrowApproval";
import BorrowForm from "@/components/forms/BorrowForm";

const EquipmentBow: React.FC = () => {
  const {
    register: registerInsert,
    handleSubmit: handleSubmitInsert,
    watch: watchInsert,
    setValue: setValueInsert,
    reset: resetInsert,
    formState: { errors: errorsInsert },
  } = useForm<BorrowList>();

  // สร้าง interface ใหม่สำหรับฟอร์มแก้ไขที่รองรับ string สำหรับวันที่
  interface EditBorrowListForm
    extends Omit<BorrowList, "date_borrow" | "date_return"> {
    date_borrow: string;
    date_return: string;
  }
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    watch: watchEdit,
    setValue: setValueEdit,
    reset: resetEdit,
    formState: { errors: errorsEdit },
  } = useForm<EditBorrowListForm>();

  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<BorrowList[]>([]);
  const [filteredData, setFilteredData] = useState<BorrowList[]>([]);
  const [openInsertData, setOpenInsertData] = useState(false);
  const [openEditData, setOpenEditData] = useState(false);
  const [openDelData, setOpenDelData] = useState(false);
  const [selectGroup, setSelectGroup] = useState<string[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [filterEquipment, setFilterEquipment] = useState("");
  const [errorInput, setErrorInput] = useState({
    equipment_id: false,
  });
  const [editData, setEditData] = useState<BorrowList>();
  const [delData, setDelData] = useState({
    index: 0,
    id_equipment: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  // เพิ่ม state สำหรับเก็บวันที่เริ่มต้นและวันที่สิ้นสุดที่ต้องการกรอง
  const [filterDateStart, setFilterDateStart] = useState<string>("");
  const [filterDateEnd, setFilterDateEnd] = useState<string>("");
  const [showDateFilter, setShowDateFilter] = useState<boolean>(false);
  const [equipmentBorrow, setEquipmentBorrow] = useState<Equipment[]>([]);
  const [selectedEquipmentBorrow, setSelectedEquipmentBorrow] = useState<
    Equipment[]
  >([]);
  const [searchEquipmentBorrow, setSearchEquipmentBorrow] =
    useState<string>("");
  const [equipmentBorrowFilter, setEquipmentBorrowFilter] = useState<
    Equipment[]
  >([]);
  const [selectedEquipmentBorrowEdit, setSelectedEquipmentBorrowEdit] =
    useState<BorrowListDetail[]>([]);
  const user = useSelector((state: any) => state.auth.user);
  const [openDetail, setOpenDetail] = useState(false);

  // เพิ่ม function สำหรับดึงข้อมูล
  const fetchData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/borrow-list/branch/${user.branch.id}`,
      );
      const result = await response.json();

      if (response.ok) {
        setData(result.data);
        setFilteredData(result.data);
      } else {
        setData([]);
        setFilteredData([]);
        toast.error("ไม่พบข้อมูล");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchEquipment = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/equipment/find-data-free`,
      );
      const result = await response.json();
      setEquipmentBorrow(result.data);
      setEquipmentBorrowFilter(result.data);
    } catch (error) {
      console.error("Error fetching equipment:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchEquipment();
  }, []);

  useEffect(() => {
    if (searchEquipmentBorrow) {
      setEquipmentBorrowFilter(
        equipmentBorrow.filter(
          (item) =>
            item.equipment_name.name
              .toLowerCase()
              .includes(searchEquipmentBorrow.toLowerCase()) ||
            item.code
              .toLowerCase()
              .includes(searchEquipmentBorrow.toLowerCase()),
        ),
      );
    } else {
      setEquipmentBorrowFilter(equipmentBorrow);
    }
  }, [searchEquipmentBorrow]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filterGroup = (value: string) => {
    if (value === "all") {
      setSelectGroup([]); // ถ้าเลือก 'ทั้งหมด' จะล้างการเลือกทั้งหมด
      return []; // ถ้าเลือก 'ทั้งหมด' จะล้างการเลือกทั้งหมด
    }
    if (selectGroup.includes(value)) {
      setSelectGroup(
        selectGroup.filter((item) => item !== value.toLowerCase()),
      );
    } else {
      setSelectGroup([...selectGroup, value]);
    }
  };

  const onSubmit = async (data: BorrowList) => {
    console.log(data);
    if (selectedEquipmentBorrow.length === 0) {
      toast.error("โปรดเลือกอุปกรณ์");
      setErrorInput({
        equipment_id: true,
      });
      return;
    }
    const formData = new FormData();
    const dateBorrow =
      data.date_borrow instanceof Date
        ? data.date_borrow
        : new Date(data.date_borrow);

    if (data.date_return) {
      const dateReturn =
        data.date_return instanceof Date
          ? data.date_return
          : new Date(data.date_return);
      formData.append("date_return", dateReturn.toISOString().split("T")[0]);
    }

    formData.append("date_borrow", dateBorrow.toISOString().split("T")[0]);
    formData.append("approval_status_borrow_id", "3");
    formData.append("approval_status_return_id", "3");
    formData.append("user_id", user.id.toString());
    selectedEquipmentBorrow.forEach((equipmentId) => {
      formData.append("equipment_id[]", equipmentId.id.toString());
    });

    toast.promise(
      (async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/borrow-list`,
            {
              method: "POST",
              body: formData,
            },
          );

          if (!response.ok) {
            throw new Error("Failed to save settings");
          }

          fetchData();
        } catch (error) {
          throw error;
        }
      })(),
      {
        loading: "กำลังเพิ่มข้อมูล...",
        success: "เพิ่มรายการยืม-คืนสำเร็จ",
        error: "เพิ่มรายการยืม-คืนล้มเหลว",
      },
    );
    closeModalInsert();
  };

  const onSubmitEdit = async (data: EditBorrowListForm) => {
    const formData = new FormData();

    formData.append("date_borrow", data.date_borrow);
    formData.append("date_return", data.date_return);

    toast.promise(
      (async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/borrow-list/${editData?.id}`,
            {
              method: "PATCH",
              body: formData,
            },
          );

          if (!response.ok) {
            throw new Error("Failed to update borrow-list");
          }

          if (response.ok) {
            if (selectedEquipmentBorrow.length > 0) {
              const formDataDetail = new FormData();
              if (!editData?.id) {
                toast.error("ไม่พบข้อมูลรายการยืม-คืน");
                return;
              }

              formDataDetail.append(
                "borrow_list_id",
                editData?.id.toString() || "",
              );
              selectedEquipmentBorrow.forEach((equipmentId) => {
                formDataDetail.append(
                  "equipment_id[]",
                  equipmentId.id.toString(),
                );
              });
              try {
                const responseDetail = await fetch(
                  `${process.env.NEXT_PUBLIC_API_URL}/borrow-list-detail`,
                  {
                    method: "POST",
                    body: formDataDetail,
                  },
                );

                if (!response.ok) {
                  throw new Error("Failed to update borrow-list-detail");
                }
              } catch (error) {
                throw error;
              }
            }
            fetchData();
            resetEdit();
          }
        } catch (error) {
          throw error;
        }
      })(),
      {
        loading: "กำลังแก้ไขข้อมูล...",
        success: "แก้ไขรายการยืม-คืนสำเร็จ",
        error: "แก้ไขรายการยืม-คืนล้มเหลว",
      },
    );

    closeModalEdit();
  };

  const fetchBorrowListDetail = async (id?: number) => {
    try {
      const idBorrow = id ? id : editData?.id;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/borrow-list-detail/${idBorrow}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch borrow list detail");
      }
      const detailData = await response.json();
      setSelectedEquipmentBorrowEdit(detailData.data);
    } catch (error) {
      console.error("Error fetching borrow list detail:", error);
      toast.error("เกิดข้อผิดพลาดในการดึงข้อมูลรายละเอียดการยืม");
      return;
    }
  };

  const handleEdit = (data: BorrowList) => {
    const dateBorrow =
      data.date_borrow instanceof Date
        ? data.date_borrow
        : new Date(data.date_borrow);
    const dateReturn =
      data.date_return instanceof Date
        ? data.date_return
        : new Date(data.date_return);

    dateBorrow.setDate(dateBorrow.getDate() + 1);
    dateReturn.setDate(dateReturn.getDate() + 1);

    setEditData(data);
    setValueEdit("date_borrow", dateBorrow.toISOString().split("T")[0]);
    setValueEdit(
      "date_return",
      data.date_return ? dateReturn.toISOString().split("T")[0] : "",
    );

    fetchBorrowListDetail(data.id);
    fetchEquipment();
    setSelectedEquipmentBorrow([]);
    setOpenEditData(true);
  };

  const handleDel = (index: number, id_equipment: string) => {
    console.log("del index: ", index);
    setDelData({
      index: index,
      id_equipment: String(index),
    });
    setOpenDelData(true);
  };

  const closeModalDel = () => {
    setOpenDelData(false);
  };

  const perPageSelectorHandler = (perPage: number) => {
    setCurrentPage(1);
    setPerPage(perPage);
  };

  const pageDirectHandler = (index: number) => {
    setCurrentPage(index + 1);
  };

  useEffect(() => {
    if (openInsertData) {
      setSelectedEquipment("");
      resetInsert();
    }
  }, [openInsertData]);

  //dialog curd
  const onDel = async () => {
    console.log(delData.index);
    toast.promise(
      (async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/borrow-list/${delData.id_equipment}`,
            {
              method: "DELETE",
            },
          );

          if (!response.ok) {
            throw new Error("Failed to delete item");
          }

          setFilteredData((prev) =>
            prev.filter((item) => item.id !== delData.index),
          );
          closeModalDel();
        } catch (error) {
          throw error;
        }
      })(),
      {
        loading: "กำลังลบข้อมูล...",
        success: "ลบรายการยืม-คืนสำเร็จ",
        error: "ลบรายการยืม-คืนล้มเหลว",
      },
    );
  };

  const closeModalEdit = () => {
    setOpenEditData(false);
  };

  const closeModalInsert = () => {
    setOpenInsertData(false);
  };

  const openModalInsert = () => {
    setOpenInsertData(true);
    setSelectedEquipmentBorrow([]);
  };

  // ปรับปรุงฟังก์ชันการกรองข้อมูล
  useEffect(() => {
    let results = data;

    // กรองตามคำค้นหา
    if (searchTerm) {
      results = results.filter(
        (item) =>
          item.user.name &&
          item.user.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // กรองตามช่วงวันที่
    if (filterDateStart && filterDateEnd) {
      const startDate = new Date(filterDateStart);
      const endDate = new Date(filterDateEnd);
      // ตั้งเวลาของ endDate เป็น 23:59:59 เพื่อให้รวมวันสุดท้ายด้วย
      endDate.setHours(23, 59, 59);

      results = results.filter((item) => {
        const itemStartDate =
          item.date_borrow instanceof Date
            ? item.date_borrow
            : new Date(item.date_borrow);

        return itemStartDate >= startDate && itemStartDate <= endDate;
      });
    }

    setFilteredData(results);
  }, [searchTerm, data, filterDateStart, filterDateEnd]);

  // เพิ่มฟังก์ชันสำหรับล้างตัวกรองวันที่
  const clearDateFilter = () => {
    setFilterDateStart("");
    setFilterDateEnd("");
  };

  const handleSelectEquipment = (value: Equipment) => {
    if (selectedEquipmentBorrow.map((item) => item.id).includes(value.id)) {
      setSelectedEquipmentBorrow(
        selectedEquipmentBorrow.filter((item) => item.id !== value.id),
      );
    } else {
      setSelectedEquipmentBorrow([...selectedEquipmentBorrow, value]);
    }
  };

  const handleDelListEquipmentBorrowDetail = async (value: string[]) => {
    try {
      const formData = new FormData();
      value.forEach((item) => formData.append("id[]", item));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/borrow-list-detail`,
        {
          method: "DELETE",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete equipment borrow details");
      }

      // อัปเดตข้อมูลที่แสดงผลหลังจากลบ
      fetchBorrowListDetail();
      fetchEquipment();

      toast.success("ลบข้อมูลสำเร็จ");
    } catch (error) {
      console.error("Error deleting equipment borrow details:", error);
      toast.error("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };

  const handleShowDetail = (id: number) => {
    setOpenDetail(true);
    fetchBorrowListDetail(id);
  };

  const closeModalDetail = () => {
    setOpenDetail(false);
  };

  const handleViewPDF = async (docBorrow: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/borrow-list/pdf/${docBorrow}`,
        {
          method: "GET",
        },
      );

      console.log(response);

      if (!response.ok) {
        throw new Error("ไม่พบไฟล์เอกสาร");
      }

      // สร้าง Blob จาก response
      const blob = await response.blob();

      // สร้าง URL สำหรับ Blob
      const url = window.URL.createObjectURL(blob);

      // เปิดไฟล์ PDF ในแท็บใหม่
      window.open(url, "_blank");

      // ล้าง URL object เพื่อป้องกันการรั่วไหลของหน่วยความจำ
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error:", error);
      toast.error("ไม่สามารถดูเอกสารได้");
    }
  };

  const handleUpdateStatusBorrow = (status: string) => {
    if (status === "success") {
      fetchData();
    }
  };
  return (
    <Layout>
      <div className="container">
        <Toaster position="bottom-right" reverseOrder={false} />
        <h1 className="title lg text-font_color">ประวัติการยืม-คืน สาขา{user.branch.name}</h1>
        <div className="mt-8 flex flex-col gap-4">
          <div className="flex justify-between">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="ค้นหา..."
                className="w-[300px] bg-white"
                value={searchTerm}
                onChange={handleSearch}
              />
              <button
                onClick={() => setShowDateFilter(!showDateFilter)}
                className="flex w-fit items-center gap-2 rounded-md border bg-gray-100 px-4 text-gray-700 transition-all hover:bg-gray-200"
              >
                <span>กรองตามวันที่ยืม</span>
                <IoIosArrowDown
                  className={`transition-transform ${showDateFilter ? "rotate-180" : ""}`}
                />
              </button>
            </div>
          </div>
          {/* ส่วนของตัวกรองวันที่ */}
          {showDateFilter && (
            <div className="flex items-end gap-4 rounded-lg bg-gray-50 p-4">
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
                  {new Date(filterDateStart).toLocaleDateString("th-TH")} ถึง{" "}
                  {new Date(filterDateEnd).toLocaleDateString("th-TH")}
                </div>
              )}
            </div>
          )}
          <Table className="rounded-lg border">
            <TableHeader>
              <TableRow className="">
                <TableHead className="whitespace-nowrap">#</TableHead>
                <TableHead className="whitespace-nowrap">วันที่ยืม</TableHead>
                <TableHead className="whitespace-nowrap">วันที่คืน</TableHead>
                <TableHead className="whitespace-nowrap">ผู้ยืม</TableHead>
                <TableHead className="whitespace-nowrap text-center">
                  สถานะการยืม
                </TableHead>
                <TableHead className="whitespace-nowrap text-center w-[20%]">
                  เอกสารการยืม
                </TableHead>
                <TableHead className="whitespace-nowrap text-center w-[20%]">
                  เอกสารการคืน
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData
                ?.slice(currentPage * perPage - perPage, currentPage * perPage)
                .map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {item.date_borrow
                        ? new Date(item.date_borrow).toLocaleDateString("th-TH")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {item.date_return
                        ? new Date(item.date_return).toLocaleDateString("th-TH")
                        : "-"}
                    </TableCell>
                    <TableCell>{item.user.name}</TableCell>
                    <TableCell>
                      <span className="flex justify-center text-center">
                        {item.date_return &&
                        item.approval_status_borrow.id === 1
                          ? `${item.approval_status_return.name}การคืน`
                          : `${item.approval_status_borrow.name}การยืม`}
                      </span>
                    </TableCell>
                    <TableCell>
                      {item.approval_status_borrow.id === 1 ? (
                        <button
                          onClick={() => handleViewPDF(item.doc_borrow)}
                          className="mx-auto w-[70%] flex justify-center rounded-md bg-primary_1 px-4 py-2 text-white hover:bg-dark"
                        >
                          ดูเอกสารการยืม
                        </button>
                      ) : item.approval_status_borrow.id != 2 ? (
                        <button
                          className="mx-auto w-[70%] flex justify-center rounded-md bg-yellow-500 px-4 py-2 text-white outline-none hover:bg-yellow-600"
                          onClick={() => handleShowDetail(item.id)}
                        >
                          รออนุมัติ
                        </button>
                      ) : (
                        <button
                          disabled
                          className="mx-auto w-[70%] flex justify-center rounded-md bg-gray-500 px-4 py-2 text-white"
                        >
                          ไม่อนุมัติ
                        </button>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.approval_status_return.id === 1 ? (
                        <button className="mx-auto w-[70%] flex justify-center rounded-md bg-primary_1 px-4 py-2 text-white hover:bg-dark">
                          ดูเอกสารการคืน
                        </button>
                      ) : item.approval_status_borrow.id != 2 ? (
                        <button
                          className="mx-auto w-[70%] flex justify-center rounded-md bg-yellow-500 px-4 py-2 text-white outline-none hover:bg-yellow-600"
                          onClick={() => handleShowDetail(item.id)}
                        >
                          รออนุมัติ
                        </button>
                      ) : (
                        <button
                          disabled
                          className="mx-auto w-[70%] flex justify-center rounded-md bg-gray-500 px-4 py-2 text-white"
                        >
                          ไม่อนุมัติ
                        </button>
                      )}
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
      <DialogDel
        title="ลบรายการยืม-คืน"
        detail={
          <>
            คุณต้องการลบรายการยืม-คืน รหัสครุภัณฑ์:{" "}
            <b>{delData.id_equipment}</b> หรือไม่
          </>
        }
        onClose={closeModalDel}
        open={openDelData}
        idDel={delData.id_equipment}
        onDel={onDel}
      />
      <DialogShowBorrowApproval
        title="เอกสารคำร้องขอยืมรายการครุภัณฑ์"
        data={selectedEquipmentBorrowEdit}
        onClose={closeModalDetail}
        open={openDetail}
        handleResponse={handleUpdateStatusBorrow}
      />
    </Layout>
  );
};

export default EquipmentBow;
