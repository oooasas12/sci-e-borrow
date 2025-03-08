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
import { FaCheck, FaXmark } from "react-icons/fa6";
import { useForm, SubmitHandler } from "react-hook-form";
import { CheckIcon } from "lucide-react";
import ButtonPrimary from "@/components/button/buttonPrimary";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete, MdEditSquare } from "react-icons/md";
import PaginationList from "@/components/pagination/PaginationList";
import { IoIosArrowDown } from "react-icons/io";
import ListBoxComponent from "@/components/ListBox/ListBox";
import toast, { Toaster } from "react-hot-toast";
import DialogInsert from "@/components/dialog/DialogInsert";
import DialogEdit from "@/components/dialog/DialogEdit";
import FilterListBox from "@/components/ListBox/FilterListBox";
import DialogDel from "@/components/dialog/DialogDel";
import { EquipmentBroken } from "@/types/equipmentBroken";
import { Equipment } from "@/types/equipment";
import {
  EquipmentName,
  EquipmentGroup,
  EquipmentStatus,
  BudgetSource,
  Unit,
} from "@/types/general";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import ListBoxStatus from "@/components/ListBox/ListBoxStatus";
import DialogChangeStatus from "@/components/dialog/DialogChageStatus";

const EquipmentBrokenPage: React.FC = () => {
  const router = useRouter();
  const {
    register: registerInsert,
    handleSubmit: handleSubmitInsert,
    watch: watchInsert,
    reset: resetInsert,
    formState: { errors: errorsInsert },
  } = useForm<EquipmentBroken>();

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    watch: watchEdit,
    setValue,
    formState: { errors: errorsEdit },
  } = useForm<EquipmentBroken>();

  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<EquipmentBroken[]>([]);
  const [filteredData, setFilteredData] = useState<EquipmentBroken[]>([]);
  const [openInsertData, setOpenInsertData] = useState(false);
  const [openEditData, setOpenEditData] = useState(false);
  const [openDelData, setOpenDelData] = useState(false);
  const [equipmentName, setEquipmentName] = useState<EquipmentName[]>([]);
  const [equipmentGroup, setEquipmentGroup] = useState<EquipmentGroup[]>([]);
  const [equipmentStatus, setEquipmentStatus] = useState<EquipmentStatus[]>([]);
  const [budgetSource, setBudgetSource] = useState<BudgetSource[]>([]);
  const [unit, setUnit] = useState<Unit[]>([]);
  const [selectGroup, setSelectGroup] = useState<string>();
  const [selectStatus, setSelectStatus] = useState<string>();
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(
    null,
  );
  const [selectType, setSelectType] = useState<string>();
  const [selectedFilterGroup, setSelectedFilterGroup] = useState<string[]>([]);
  const [selectedFilterStatus, setSelectedFilterStatus] = useState<string[]>(
    [],
  );
  const [selectedFilterType, setSelectedFilterType] = useState<string[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [errorInput, setErrorInput] = useState({
    equipment: false,
  });
  const [editData, setEditData] = useState<EquipmentBroken>();
  const [delData, setDelData] = useState({
    index: 0,
    name: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const user = useSelector((state: any) => state.auth.user);
  const [openChangeStatus, setOpenChangeStatus] = useState(false);

  const fetchMasterData = async () => {
    try {
      const [
        equipmentNameRes,
        equipmentGroupRes,
        equipmentStatusRes,
        equipmentRes,
      ] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/equipment-name`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/equipment-group`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/equipment-status`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/equipment/find-data-free`),
      ]);

      const [
        equipmentNameData,
        equipmentGroupData,
        equipmentStatusData,
        equipmentData,
      ] = await Promise.all([
        equipmentNameRes.json(),
        equipmentGroupRes.json(),
        equipmentStatusRes.json(),
        equipmentRes.json(),
      ]);

      setEquipmentName(equipmentNameData.data);
      setEquipmentGroup(equipmentGroupData.data);
      setEquipmentStatus(equipmentStatusData.data);
      setEquipment(equipmentData.data);
    } catch (error) {
      console.error("Error fetching master data:", error);
      toast.error("ไม่สามารถดึงข้อมูลพื้นฐานได้");
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/equipment-broken/user/${user.id}`,
      );
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setData(result.data);
      setFilteredData(result.data);
      console.log(result.data);
    } catch (error) {
      toast.error("ไม่สามารถดึงข้อมูลได้");
    }
  };

  useEffect(() => {
    fetchData();
    fetchMasterData();
  }, []);

  useEffect(() => {
    let results = data;

    if (selectedFilterGroup.length != 0) {
      results = results.filter((item) =>
        selectedFilterGroup.includes(
          item.equipment.equipment_group.name.toLowerCase(),
        ),
      );
    }
    if (selectedFilterStatus.length != 0) {
      results = results.filter((item) =>
        selectedFilterStatus.includes(item.equipment_status.name.toLowerCase()),
      );
    }
    if (selectedFilterType.length != 0) {
      results = results.filter((item) =>
        selectedFilterType.includes(
          item.equipment.equipment_name.name.toLowerCase(),
        ),
      );
    }

    results = results.filter(
      (item) =>
        item.equipment.equipment_name.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.equipment.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.detail.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    setFilteredData(results);
  }, [
    searchTerm,
    selectedFilterGroup,
    selectedFilterType,
    selectedFilterStatus,
    data,
  ]);

  const filterGroup = (value: string) => {
    if (value === "all") {
      setSelectedFilterGroup([]); // ถ้าเลือก 'ทั้งหมด' จะล้างการเลือกทั้งหมด
      return []; // ถ้าเลือก 'ทั้งหมด' จะล้างการเลือกทั้งหมด
    }
    if (selectedFilterGroup.includes(value)) {
      setSelectedFilterGroup(
        selectedFilterGroup.filter((item) => item !== value.toLowerCase()),
      );
    } else {
      setSelectedFilterGroup([...selectedFilterGroup, value]);
    }
  };

  const filterStatus = (value: string) => {
    if (value === "all") {
      setSelectedFilterStatus([]); // ถ้าเลือก 'ทั้งหมด' จะล้างการเลือกทั้งหมด
      return []; // ถ้าเลือก 'ทั้งหมด' จะล้างการเลือกทั้งหมด
    }
    if (selectedFilterStatus.includes(value)) {
      setSelectedFilterStatus(
        selectedFilterStatus.filter((item) => item !== value.toLowerCase()),
      );
    } else {
      setSelectedFilterStatus([...selectedFilterStatus, value]);
    }
  };

  const filterType = (value: string) => {
    if (value === "all") {
      setSelectedFilterType([]); // ถ้าเลือก 'ทั้งหมด' จะล้างการเลือกทั้งหมด
      return []; // ถ้าเลือก 'ทั้งหมด' จะล้างการเลือกทั้งหมด
    }
    if (selectedFilterType.includes(value)) {
      setSelectedFilterType(
        selectedFilterType.filter((item) => item !== value.toLowerCase()),
      );
    } else {
      setSelectedFilterType([...selectedFilterType, value]);
    }
  };

  const onSubmit = async (data: EquipmentBroken) => {
    if (!selectedEquipment) {
      toast.error("โปรดเลือกครุภัณฑ์");
      setErrorInput({
        equipment: true,
      });
      return;
    }

    const dateBroken =
      data.date_broken instanceof Date
        ? data.date_broken
        : new Date(data.date_broken);
    const formData = new FormData();
    formData.append("date_broken", dateBroken.toISOString().split("T")[0]);
    formData.append("detail", data.detail);
    formData.append("equipment_id", selectedEquipment.id.toString());
    formData.append("equipment_status_id", "3"); // สถานะชำรุด
    formData.append("user_id", user?.id.toString() || ""); // ใช้ ID จาก Redux

    await toast.promise(
      (async () => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/equipment-broken`,
          {
            method: "POST",
            body: formData,
          },
        );

        if (!response.ok) throw new Error("Failed to add data");

        await fetchData();
        fetchMasterData();
        closeModalInsert();
      })(),
      {
        loading: "กำลังเพิ่มรายการครุภัณฑ์ชำรุด...",
        success: "เพิ่มรายการครุภัณฑ์ชำรุดสำเร็จ",
        error: "เพิ่มรายการครุภัณฑ์ชำรุดล้มเหลว",
      },
    );
  };

  const onSubmitEdit = async (data: EquipmentBroken) => {
    if (!selectedEquipment) {
      toast.error("โปรดเลือกครุภัณฑ์");
      return;
    }

    await toast.promise(
      (async () => {
        const formData = new FormData();
        formData.append("date_broken", data.date_broken.toString());
        if (data.date_end_repair) {
          formData.append("date_end_repair", data.date_end_repair.toString());
        }
        formData.append("detail", data.detail);
        formData.append("equipment_id", selectedEquipment.id.toString());

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/equipment-broken/${editData?.id}`,
          {
            method: "PATCH",
            body: formData,
          },
        );

        if (!response.ok) throw new Error("Failed to update data");

        await fetchData();
        fetchMasterData();
        closeModalEdit();
      })(),
      {
        loading: "กำลังแก้ไขรายการครุภัณฑ์ชำรุด...",
        success: "แก้ไขรายการครุภัณฑ์ชำรุดสำเร็จ",
        error: "แก้ไขรายการครุภัณฑ์ชำรุดล้มเหลว",
      },
    );
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

  useEffect(() => {
    if (openInsertData) {
      setSelectedEquipment(null);
    }
  }, [openInsertData]);

  const closeModalInsert = () => {
    setOpenInsertData(false);
  };

  const openModalInsert = () => {
    resetInsert();
    setOpenInsertData(true);
  };

  const closeModalEdit = () => {
    setOpenEditData(false);
  };

  const handleSlectEquipment = (value: Equipment) => {
    setSelectedEquipment(value);
    setValue("equipment", value);
  };

  const handleEdit = (data: EquipmentBroken) => {
    const dateBroken =
      data.date_broken instanceof Date
        ? data.date_broken
        : new Date(data.date_broken);
    const dateEndRepair =
      data.date_end_repair instanceof Date
        ? data.date_end_repair
        : new Date(data.date_end_repair);

    // ย้อนกลับไป 1 วัน
    dateBroken.setDate(dateBroken.getDate() + 1);
    dateEndRepair.setDate(dateEndRepair.getDate() + 1);

    setEditData(data);
    setValue("id", data.id);
    setOpenEditData(true);
    setSelectedEquipment(data.equipment);
    setValue("equipment", data.equipment);
    setValue("date_broken", dateBroken.toISOString().split("T")[0]);
    setValue("date_end_repair", dateEndRepair.toISOString().split("T")[0]);
    setValue("detail", data.detail);
    setValue("equipment_status", data.equipment_status);
  };

  const closeModalDel = () => {
    setOpenDelData(false);
  };

  const onDel = async () => {
    toast.promise(
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/equipment-broken/${delData.index}`,
        {
          method: "DELETE",
        },
      ).then((response) => {
        if (!response.ok) throw new Error("Failed to delete data");
        return fetchData().then(() => {
          closeModalDel();
        });
      }),
      {
        loading: "กำลังลบข้อมูล...",
        success: "ลบสำเร็จ",
        error: "ลบข้อมูลล้มเหลว",
      },
    );
  };

  const openModalChangeStatus = () => {
    setOpenChangeStatus(true);
  };

  const closeModalChangeStatus = () => {
    setOpenChangeStatus(false);
  };

  const handleChangeStatus = async (status: number, equipment_id: string[]) => {
    if (status == 0) {
      toast.error("โปรดเลือกสถานะ");
      return;
    }
    if (equipment_id.length == 0) {
      toast.error("โปรดเลือกครุภัณฑ์");
      return;
    }

    const formData = new FormData();
    formData.append("equipment_status_id", status.toString());
    equipment_id.forEach((id) => {
      formData.append("id[]", id);
    });

    toast.promise(
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/equipment-broken/update-status`,
        {
          method: "PATCH",
          body: formData,
        },
      ),
      {
        loading: "กำลังอัปเดตสถานะ...",
        success: () => {
          closeModalChangeStatus();
          fetchData(); // รีเฟรชข้อมูลหลังจากอัปเดตสถานะ
          return "อัปเดตสถานะสำเร็จ";
        },
        error: "ไม่สามารถอัปเดตสถานะได้",
      },
    );
  };

  return (
    <Layout>
      <div className="container">
        <Toaster position="bottom-right" reverseOrder={false} />
        <h1 className="title lg text-font_color">
          ประวัติการแจ้งชำรุดครุภัณฑ์
        </h1>
        <div className="mt-8 flex flex-col gap-4">
          <div className="flex items-start justify-between">
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
                  selected={selectedFilterGroup}
                  item={equipmentGroup}
                  filter={filterGroup}
                />
                <FilterListBox
                  placeholder="สถานะครุภัณฑ์"
                  selected={selectedFilterStatus}
                  item={equipmentStatus.filter(
                    (item) =>
                      item.id == 3 ||
                      item.id == 4 ||
                      item.id == 5 ||
                      item.id == 6,
                  )}
                  filter={filterStatus}
                />
                <FilterListBox
                  placeholder="ชื่อครุภัณฑ์"
                  selected={selectedFilterType}
                  item={equipmentName}
                  filter={filterType}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => openModalChangeStatus()}
                className="flex min-h-[40px] w-fit items-center gap-2 whitespace-nowrap rounded-lg bg-primary_1 px-6 text-white transition-all hover:bg-dark"
              >
                <span>เปลี่ยนสถานะครุภัณฑ์</span>
              </button>
              <button
                onClick={() => openModalInsert()}
                className="flex min-h-[40px] w-fit items-center gap-2 whitespace-nowrap rounded-lg bg-primary_1 px-6 text-white transition-all hover:bg-dark"
              >
                <span>แจ้งชำรุด</span>
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
                  ชื่อครุภัณฑ์
                </TableHead>
                <TableHead className="whitespace-nowrap">
                  ประเภทครุภัณฑ์
                </TableHead>
                <TableHead className="whitespace-nowrap">รายละเอียด</TableHead>
                <TableHead className="whitespace-nowrap">
                  สถานะครุภัณฑ์ชำรุดชำรุด
                </TableHead>
                <TableHead className="whitespace-nowrap">
                  ผู้ดำเนินการ
                </TableHead>
                <TableHead className="whitespace-nowrap">วันที่ชำรุด</TableHead>
                <TableHead className="whitespace-nowrap">
                  วันที่ซ่อมเสร็จสิ้น
                </TableHead>
                <TableHead className="whitespace-nowrap"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData
                .slice(currentPage * perPage - perPage, currentPage * perPage)
                .map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.id as number}</TableCell>
                    <TableCell>{item.equipment.code}</TableCell>
                    <TableCell>{item.equipment.equipment_name.name}</TableCell>
                    <TableCell>{item.equipment.equipment_group.name}</TableCell>
                    <TableCell>{item.detail}</TableCell>
                    <TableCell>{item.equipment_status.name}</TableCell>
                    <TableCell>{item.user.name}</TableCell>
                    <TableCell>
                      {new Date(item.date_broken).toLocaleDateString("th-TH")}
                    </TableCell>
                    <TableCell>
                      {item.date_end_repair
                        ? new Date(item.date_end_repair).toLocaleDateString(
                            "th-TH",
                          )
                        : "-"}
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      {item.equipment_status.id == 3 ? (
                        <MdEditSquare
                          className="cursor-pointer text-yellow-500"
                          onClick={() => handleEdit(item)}
                          size={20}
                        />
                      ) : (
                        <MdEditSquare
                          className="cursor-not-allowed text-gray-500"
                          size={20}
                        />
                      )}
                      {item.equipment_status.id == 3 ? (
                        <MdDelete
                          className="cursor-pointer text-red-600"
                          onClick={() =>
                            handleDel(
                              item.id,
                              item.equipment.equipment_name.name,
                            )
                          }
                          size={20}
                        />
                      ) : (
                        <MdDelete
                          className="cursor-not-allowed text-gray-500"
                          size={20}
                        />
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
              total_item={filteredData?.length || 0}
              onPerPageSelector={perPageSelectorHandler}
              pageDirectHandler={pageDirectHandler}
            />
          </div>
        </div>
      </div>
      <DialogInsert
        title="เพิ่มรายการครุภัณฑ์ชำรุด"
        onClose={closeModalInsert}
        open={openInsertData}
      >
        <form
          onSubmit={handleSubmitInsert(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="equipment" className="text-sm text-font_color">
              ครุภัณฑ์
            </label>
            <ListBoxComponent
              placeholder="รายการครุภัณฑ์"
              selectedValue={selectedEquipment || null}
              options={equipment.map((item) => ({
                id: item.id,
                name: item.code + " - " + item.equipment_name.name,
              }))}
              onChange={handleSlectEquipment}
            />
            {errorInput.equipment && (
              <p className="text-sm text-red-500">**โปรดเลือกครุภัณฑ์</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="borrowing_date" className="text-sm text-font_color">
              วันที่ชำรุด
            </label>
            <Input
              type="date"
              id="borrowing_date"
              min={
                new Date(new Date().setDate(new Date().getDate() - 10))
                  .toISOString()
                  .split("T")[0]
              }
              max={new Date().toISOString().split("T")[0]}
              className="w-full"
              {...registerInsert("date_broken", {
                required: "**โปรดเลือกวันที่",
              })}
            />
            {errorsInsert.date_broken && (
              <p className="text-red-500">{errorsInsert.date_broken.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="detail" className="text-sm text-font_color">
              รายละเอียดการชำรุด
            </label>
            <Input
              type="text"
              id="detail"
              value={watchInsert("detail") || ""}
              className="w-full"
              {...registerInsert("detail", {
                required: "**โปรดกรอกรายละเอียด",
              })}
            />
            {errorsInsert.detail && (
              <p className="text-red-500">{errorsInsert.detail.message}</p>
            )}
          </div>
          <ButtonPrimary
            data="เพิ่มรายการ"
            type="submit"
            size="small"
            className="ml-auto"
          />
        </form>
      </DialogInsert>
      <DialogEdit
        title="แก้ไขรายการครุภัณฑ์ชำรุด"
        onClose={closeModalEdit}
        open={openEditData}
      >
        <form
          onSubmit={handleSubmitEdit(onSubmitEdit)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="equipment" className="text-sm text-font_color">
              ครุภัณฑ์
            </label>
            <ListBoxComponent
              placeholder={
                selectedEquipment?.code +
                " - " +
                selectedEquipment?.equipment_name?.name
              }
              selectedValue={selectedEquipment}
              options={equipment.map((item) => ({
                id: item.id,
                name: item.code + " - " + item.equipment_name.name,
              }))}
              onChange={handleSlectEquipment}
            />
            {errorInput.equipment && (
              <p className="text-sm text-red-500">**โปรดเลือกครุภัณฑ์</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="date_broken" className="text-sm text-font_color">
              วันที่ชำรุด
            </label>
            <Input
              type="date"
              min={
                watchEdit("date_broken")
                  ? watchEdit("date_broken").toString()
                  : undefined
              }
              {...registerEdit("date_broken", { required: "โปรดเลือกวันที่" })}
            />
            {errorsEdit.date_broken && (
              <p className="text-red-500">{errorsEdit.date_broken.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="detail" className="text-sm text-font_color">
              รายละเอียดการชำรุด
            </label>
            <Input
              type="text"
              id="detail"
              value={watchEdit("detail") || ""}
              className="w-full"
              {...registerEdit("detail", { required: "โปรดกรอกรายละเอียด" })}
            />
            {errorsEdit.detail && (
              <p className="text-red-500">{errorsEdit.detail.message}</p>
            )}
          </div>
          <ButtonPrimary
            data="ยืนยัน"
            type="submit"
            size="small"
            className="ml-auto"
          />
        </form>
      </DialogEdit>
      <DialogDel
        title="ลบรายการครุภัณฑ์ชำรุด"
        detail={
          <>
            คุณต้องการลบรายกาครุภัณฑ์ชำรุด รหัสครุภัณฑ์: <b>{delData.name}</b>{" "}
            หรือไม่
          </>
        }
        onClose={closeModalDel}
        open={openDelData}
        onDel={onDel}
      />
      <DialogChangeStatus
        title="เปลี่ยนสถานะครุภัณฑ์"
        onClose={closeModalChangeStatus}
        open={openChangeStatus}
        tableData={filteredData.filter((item) => item.equipment_status.id == 3)}
        handleChangeStatus={handleChangeStatus}
        status={equipmentStatus
          .filter((item) => item.id == 4 || item.id == 5 || item.id == 6)
          .map((item) => ({ id: item.id, name: item.name }))}
      />
    </Layout>
  );
};

export default EquipmentBrokenPage;
