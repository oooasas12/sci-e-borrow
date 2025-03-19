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
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { Unit } from "@/types/general";

const CountingUnit: React.FC = () => {
  const {
    register: registerInsert,
    handleSubmit: handleSubmitInsert,
    formState: { errors: errorsInsert },
    reset: resetInsert,
  } = useForm<Unit>();

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    setValue: setValueEdit,
    formState: { errors: errorsEdit },
    reset: resetEdit,
  } = useForm<Unit>();

  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<Unit[]>([]);
  const [filteredData, setFilteredData] = useState(data);
  const [openInsertData, setOpenInsertData] = useState(false);
  const [openEditData, setOpenEditData] = useState(false);
  const [openDelData, setOpenDelData] = useState(false);
  const [editData, setEditData] = useState<Unit>();
  const [delData, setDelData] = useState({
    index: 0,
    name: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/unit`);
      const result = await response.json();
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
    results = results.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toString().includes(searchTerm),
    );
    setFilteredData(results);
  }, [searchTerm, data]);

  const onSubmit = async (data: Unit) => {
    const formData = new FormData();
    formData.append("name", data.name);

    await toast.promise(
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/unit`, {
        method: "POST",
        body: formData,
      }).then((response) => {
        if (response.ok) {
          setOpenInsertData(false);
          fetchData();
          resetInsert();
          return response;
        }
        throw new Error("เพิ่มข้อมูลไม่สำเร็จ");
      }),
      {
        loading: "กำลังเพิ่มข้อมูล...",
        success: "เพิ่มข้อมูลสำเร็จ",
        error: "เพิ่มข้อมูลไม่สำเร็จ",
      },
    );
  };

  const onSubmitEdit = async (data: Unit) => {
    const formData = new FormData();
    formData.append("name", data.name);

    await toast.promise(
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/unit/${data.id}`, {
        method: "PUT",
        body: formData,
      }).then((response) => {
        if (response.ok) {
          setOpenEditData(false);
          fetchData();
          resetEdit();
          return response;
        }
        throw new Error("แก้ไขข้อมูลไม่สำเร็จ");
      }),
      {
        loading: "กำลังแก้ไขข้อมูล...",
        success: "แก้ไขข้อมูลสำเร็จ",
        error: "แก้ไขข้อมูลไม่สำเร็จ",
      },
    );
  };

  const handleEdit = (data: Unit) => {
    setEditData(data);
    setValueEdit("id", data.id);
    setValueEdit("name", data.name);
    setOpenEditData(true);
  };

  const confirmDelete = async () => {
    await toast.promise(
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/unit/${delData.index}`, {
        method: "DELETE",
      }).then((response) => {
        if (response.ok) {
          setOpenDelData(false);
          fetchData();
          return response;
        }
        throw new Error("ลบข้อมูลไม่สำเร็จ");
      }),
      {
        loading: "กำลังลบข้อมูล...",
        success: "ลบข้อมูลสำเร็จ",
        error: "ลบข้อมูลไม่สำเร็จ",
      },
    );
  };

  const handleDel = (index: number, name: string) => {
    setDelData({
      index: index,
      name: name,
    });
    setOpenDelData(true);
  };

  const perPageSelectorHandler = (perPage: number) => {
    setCurrentPage(1);
    setPerPage(perPage);
  };

  const pageDirectHandler = (index: number) => {
    setCurrentPage(index + 1);
  };
  return (
    <Layout>
      <div className="container">
        <Toaster position="bottom-right" reverseOrder={false} />
        <h1 className="title lg text-font_color">รายการหน่วยนับ</h1>
        <div className="mt-8 flex flex-col gap-4">
          <div className="flex justify-between flex-col md:flex-row gap-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="ค้นหา..."
                className="w-[300px] min-w-[250px] bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex">
              <button
                onClick={() => setOpenInsertData(true)}
                className="flex w-fit items-center gap-2 whitespace-nowrap rounded-lg bg-primary_1 px-6 py-1.5 text-white transition-all hover:bg-dark"
              >
                <span>เพิ่มรายการ</span>
              </button>
            </div>
          </div>
          <Table className="rounded-lg border">
            <TableHeader>
              <TableRow className="">
                <TableHead className="whitespace-nowrap">#</TableHead>
                <TableHead className="whitespace-nowrap">หน่วยนับ</TableHead>
                <TableHead className="whitespace-nowrap"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData
                ?.slice(currentPage * perPage - perPage, currentPage * perPage)
                .map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="flex justify-end gap-2">
                      <MdEditSquare
                        className="cursor-pointer text-yellow-500"
                        onClick={() => handleEdit(item)}
                        size={20}
                      />
                      <MdDelete
                        className="cursor-pointer text-red-600"
                        onClick={() => handleDel(item.id, item.name)}
                        size={20}
                      />
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
                    เพิ่มรายการหน่วยนับ
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
                      ชื่อหน่วยนับ
                    </label>
                    <Input
                      type="text"
                      placeholder="ชื่อหน่วยนับ"
                      {...registerInsert("name", {
                        required: "โปรดกรอก ชื่อหน่วยนับ",
                      })}
                    />
                    {errorsInsert.name && (
                      <span className="text-sm text-red-500">
                        {errorsInsert.name.message}
                      </span>
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
                    แก้ไขรายการหน่วยนับ
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
                      ชื่อหน่วยนับ
                    </label>
                    <Input
                      type="text"
                      placeholder="ชื่อหน่วยนับ"
                      {...registerEdit("name", {
                        required: "โปรดกรอก ชื่อหน่วยนับ",
                      })}
                    />
                    {errorsEdit.name && (
                      <span className="text-sm text-red-500">
                        {errorsEdit.name.message}
                      </span>
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
                    ลบรายการหน่วยนับ
                  </DialogTitle>
                  <FaXmark
                    className="cursor-pointer text-gray-400 hover:text-gray-600"
                    onClick={() => setOpenDelData(false)}
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <span className="text-font_color">
                    คุณต้องการลบรายการหน่วยนับ ชื่อ: <b>{delData.name}</b>{" "}
                    หรือไม่
                  </span>
                  <div className="flex justify-end gap-4">
                    <ButtonPrimary
                      data="ยืนยัน"
                      size="small"
                      className="bg-red-500 hover:bg-red-600"
                      onClick={confirmDelete}
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
    </Layout>
  );
};

export default CountingUnit;
