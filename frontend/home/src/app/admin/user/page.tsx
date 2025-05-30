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
import { useForm } from "react-hook-form";
import { CheckIcon } from "lucide-react";
import ButtonPrimary from "@/components/button/buttonPrimary";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete, MdEditSquare } from "react-icons/md";
import PaginationList from "@/components/pagination/PaginationList";
import FilterListBox from "@/components/ListBox/FilterListBox";
import ListBoxComponent from "@/components/ListBox/ListBox";
import { User } from "@/types/user";
import {
  Branch,
  Faculty,
  Group,
  PositionFac,
  PositionBranch,
} from "@/types/general";
import DialogInsert from "@/components/dialog/DialogInsert";
import DialogEdit from "@/components/dialog/DialogEdit";
import DialogDel from "@/components/dialog/DialogDel";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

const defaultValueOption = {
  id: 0,
  name: "",
};

const UserPage: React.FC = () => {
  const {
    register: registerInsert,
    handleSubmit: handleSubmitInsert,
    formState: { errors: errorsInsert },
  } = useForm<User>();
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    formState: { errors: errorsEdit },
    reset: resetEdit,
    setValue,
  } = useForm<User>();

  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<User[]>([]);
  const [filteredData, setFilteredData] = useState<User[]>([]);
  const user = useSelector((state: any) => state.auth.user);

  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result = await response.json();

      const setDataUser = result?.data?.filter(
        (item: User) => item.id != user.id,
      );
      setData(setDataUser);
      setFilteredData(setDataUser);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("ไม่สามารถดึงข้อมูลได้");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [openInsertData, setOpenInsertData] = useState(false);
  const [openEditData, setOpenEditData] = useState(false);
  const [openDelData, setOpenDelData] = useState(false);
  const [selectedFilterGroup, setSelectedFilterGroup] = useState<string[]>([]);
  const [selectedFilterFac, setSelectedFilterFac] = useState<string[]>([]);
  const [selectedFilterBranch, setSelectedFilterBranch] = useState<string[]>(
    [],
  );
  const [selectedGroup, setSelectedGroup] = useState<Group>(defaultValueOption);
  const [selectedFac, setSelectedFac] = useState<Faculty>(defaultValueOption);
  const [selectedBranch, setSelectedBranch] =
    useState<Branch>(defaultValueOption);
  const [errorInput, setErrorInput] = useState({
    fac: false,
    group: false,
    branch: false,
  });
  const [delData, setDelData] = useState({
    index: 0,
    name: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [positionFac, setPositionFac] = useState<PositionFac[]>([]);
  const [positionBranch, setPositionBranch] = useState<PositionBranch[]>([]);
  const [branch, setBranch] = useState<Branch[]>([]);

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [branchRes, positionBranchRes, positionFacRes] =
          await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/branch`),
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/position-branch`),
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/position-fac`),
          ]);

        const [branchData, positionBranchData, positionFacData] =
          await Promise.all([
            branchRes.json(),
            positionBranchRes.json(),
            positionFacRes.json(),
          ]);

        setBranch(branchData.data);
        setPositionBranch(positionBranchData.data);
        setPositionFac(positionFacData.data);
      } catch (error) {
        console.error("Error fetching master data:", error);
        toast.error("ไม่สามารถดึงข้อมูลพื้นฐานได้");
      }
    };

    fetchMasterData();
  }, []);

  useEffect(() => {
    let results = data;
    if (selectedFilterGroup.length != 0) {
      results = results.filter((item) =>
        selectedFilterGroup.includes(item.branch.name.toLowerCase()),
      );
    }
    if (selectedFilterFac.length != 0) {
      results = results.filter((item) =>
        selectedFilterFac.includes(item.position_fac.name.toLowerCase()),
      );
    }
    if (selectedFilterBranch.length != 0) {
      results = results.filter((item) =>
        selectedFilterBranch.includes(item.position_branch.name.toLowerCase()),
      );
    }
    results = results.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.username.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredData(results);
  }, [
    searchTerm,
    selectedFilterGroup,
    selectedFilterFac,
    selectedFilterBranch,
  ]);

  useEffect(() => {
    resetEdit();
  }, [openInsertData]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

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

  const filterFac = (value: string) => {
    if (value === "all") {
      setSelectedFilterFac([]); // ถ้าเลือก 'ทั้งหมด' จะล้างการเลือกทั้งหมด
      return []; // ถ้าเลือก 'ทั้งหมด' จะล้างการเลือกทั้งหมด
    }
    if (selectedFilterFac.includes(value)) {
      setSelectedFilterFac(
        selectedFilterFac.filter((item) => item !== value.toLowerCase()),
      );
    } else {
      setSelectedFilterFac([...selectedFilterFac, value]);
    }
  };

  const filterBranch = (value: string) => {
    if (value === "all") {
      setSelectedFilterBranch([]); // ถ้าเลือก 'ทั้งหมด' จะล้างการเลือกทั้งหมด
      return []; // ถ้าเลือก 'ทั้งหมด' จะล้างการเลือกทั้งหมด
    }
    if (selectedFilterBranch.includes(value)) {
      setSelectedFilterBranch(
        selectedFilterBranch.filter((item) => item !== value.toLowerCase()),
      );
    } else {
      setSelectedFilterBranch([...selectedFilterBranch, value]);
    }
  };

  const onSubmit = async (data: User) => {
    if (!selectedBranch) {
      setErrorInput({ ...errorInput, branch: true });
      return;
    }
    if (!selectedFac) {
      setErrorInput({ ...errorInput, fac: true });
      return;
    }
    if (!selectedGroup) {
      setErrorInput({ ...errorInput, group: true });
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("username", data.username);
    formData.append("password", data.password);
    formData.append("position_fac_id", String(selectedFac.id));
    formData.append("position_branch_id", String(selectedBranch.id));
    formData.append("branch_id", String(selectedGroup.id));

    await toast.promise(
      (async () => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users`,
          {
            method: "POST",
            body: formData,
          },
        );

        if (!response.ok) {
          throw new Error("Failed to create user");
        }

        const result = await response.json();

        setErrorInput({
          branch: false,
          fac: false,
          group: false,
        });
        setSelectedGroup(defaultValueOption);
        setSelectedFac(defaultValueOption);
        setSelectedBranch(defaultValueOption);
        setOpenInsertData(false);
        resetEdit();
        await fetchData();

        return result;
      })(),
      {
        loading: "กำลังเพิ่มผู้ใช้...",
        success: "เพิ่มผู้ใช้สำเร็จ",
        error: "ไม่สามารถเพิ่มผู้ใช้ได้",
      },
    );
  };

  const onSubmitEdit = async (data: User) => {
    if (!selectedBranch) {
      setErrorInput({ ...errorInput, branch: true });
      return;
    }
    if (!selectedFac) {
      setErrorInput({ ...errorInput, fac: true });
      return;
    }
    if (!selectedGroup) {
      setErrorInput({ ...errorInput, group: true });
      return;
    }

    toast.promise(
      (async () => {
        const formData = new FormData();
        formData.append("id", String(data.id));
        formData.append("name", data.name);
        formData.append("username", data.username);
        formData.append("position_fac_id", String(selectedFac.id));
        formData.append("position_branch_id", String(selectedBranch.id));
        formData.append("branch_id", String(selectedGroup.id));

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${data.id}`,
          {
            method: "PATCH",
            body: formData,
          },
        );

        if (!response.ok) {
          throw new Error("Failed to update user");
        }

        const result = await response.json();

        setErrorInput({
          branch: false,
          fac: false,
          group: false,
        });
        setSelectedGroup(defaultValueOption);
        setSelectedFac(defaultValueOption);
        setSelectedBranch(defaultValueOption);
        setOpenEditData(false);
        resetEdit();
        await fetchData();

        return result;
      })(),
      {
        loading: "กำลังแก้ไขผู้ใช้...",
        success: "แก้ไขผู้ใช้สำเร็จ",
        error: "ไม่สามารถแก้ไขผู้ใช้ได้",
      },
    );
  };

  const handleEdit = (data: User) => {
    resetEdit();
    setValue("id", data.id);
    setValue("name", data.name);
    setValue("username", data.username);
    setValue("password", data.password);
    setValue("position_fac", data.position_fac);
    setValue("position_branch", data.position_branch);
    setValue("branch", data.branch);
    setOpenEditData(true);
    setSelectedBranch(data.position_branch);
    setSelectedFac(data.position_fac);
    setSelectedGroup(data.branch);
  };

  const handleDel = (index: number, name: string) => {
    console.log("del index: ", index);
    setDelData({
      index: index,
      name: name,
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

  const handleSlectGroup = (value: Branch) => {
    setSelectedGroup(value);
    setValue("branch", value);
  };

  const handleSlectFac = (value: PositionFac) => {
    setSelectedFac(value);
    setValue("position_fac", value);
  };
  const handleSlectBranch = (value: PositionBranch) => {
    setSelectedBranch(value);
    setValue("position_branch", value);
  };

  //dialog curd
  const onDel = async () => {
    await toast.promise(
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${delData.index}`, {
        method: "DELETE",
      }).then((response) => {
        if (response.ok) {
          setFilteredData((prev) =>
            prev.filter((item) => item.id !== delData.index)
          );
          closeModalDel();
          return response;
        }
        throw new Error("ลบข้อมูลไม่สำเร็จ");
      }),
      {
        loading: "กำลังลบข้อมูล...",
        success: "ลบข้อมูลสำเร็จ",
        error: "เกิดข้อผิดพลาดในการลบข้อมูล",
      }
    );
  };

  return (
    <Layout>
      <div className="container">
        <Toaster position="bottom-right" reverseOrder={false} />
        <h1 className="title lg text-font_color">บัญชีผู้ใช้</h1>
        <div className="mt-8 flex flex-col gap-4">
          <div className="flex justify-between flex-col md:flex-row gap-4">
            <div className="flex flex-col lg:flex-row gap-2">
              <Input
                type="text"
                placeholder="ค้นหา..."
                className="w-[300px] min-w-[250px] bg-white"
                value={searchTerm}
                onChange={handleSearch}
              />
              <FilterListBox
                placeholder="กลุ่มงาน"
                selected={selectedFilterGroup}
                item={branch}
                filter={filterGroup}
              />
              <FilterListBox
                placeholder="ตำแหน่งระดับคณะ"
                selected={selectedFilterFac}
                item={positionFac}
                filter={filterFac}
              />
              <FilterListBox
                placeholder="ตำแหน่งระดับสาขา"
                selected={selectedFilterBranch}
                item={positionBranch}
                filter={filterBranch}
              />
            </div>
            <div className="flex">
              <button
                onClick={() => setOpenInsertData(true)}
                className="flex w-fit h-9 items-center gap-2 whitespace-nowrap rounded-lg bg-primary_1 px-6 py-1.5 text-white transition-all hover:bg-dark"
              >
                <span>เพิ่มรายการ</span>
              </button>
            </div>
          </div>
          <Table className="rounded-lg border">
            <TableHeader>
              <TableRow className="">
                <TableHead className="whitespace-nowrap">#</TableHead>
                <TableHead className="whitespace-nowrap">ชื่อ-สกุล</TableHead>
                <TableHead className="whitespace-nowrap">username</TableHead>
                <TableHead className="whitespace-nowrap">
                  กลุ่มงาน / สาขา
                </TableHead>
                <TableHead className="whitespace-nowrap">
                  ตำแหน่งระดับคณะ
                </TableHead>
                <TableHead className="whitespace-nowrap">
                  ตำแหน่งระดับสาขา
                </TableHead>
                <TableHead className="whitespace-nowrap"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData
                ?.slice(currentPage * perPage - perPage, currentPage * perPage)
                .map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.username}</TableCell>
                    <TableCell>{item.branch.name}</TableCell>
                    <TableCell>{item.position_fac.name}</TableCell>
                    <TableCell>{item.position_branch.name}</TableCell>
                    <TableCell className="flex justify-end gap-2">
                      <MdEditSquare
                        className="cursor-pointer text-yellow-500"
                        size={20}
                        onClick={() => handleEdit(item)}
                      />
                      <MdDelete
                        className="cursor-pointer text-red-600"
                        onClick={() => handleDel(item.id as number, item.name)}
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
      <DialogInsert
        title="เพิ่มรายการผู้ใช้"
        onClose={() => setOpenInsertData(false)}
        open={openInsertData}
      >
        <form
          onSubmit={handleSubmitInsert(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm text-font_color">
              ชื่อ-สกุล
            </label>
            <Input
              type="text"
              placeholder="ชื่อ-สกุล"
              {...registerInsert("name", { required: "โปรดกรอกชื่อ-สกุล" })}
            />
            {errorsInsert.name && (
              <span className="text-sm text-red-500">
                {errorsInsert.name.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="text-sm text-font_color">
              Username
            </label>
            <Input
              type="text"
              placeholder="username"
              {...registerInsert("username", { required: "โปรดกรอก Username" })}
            />
            {errorsInsert.username && (
              <span className="text-sm text-red-500">
                {errorsInsert.username.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm text-font_color">
              Password
            </label>
            <Input
              type="text"
              placeholder="password"
              {...registerInsert("password", { required: "โปรดกรอก Password" })}
            />
            {errorsInsert.password && (
              <span className="text-sm text-red-500">
                {errorsInsert.password.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="group" className="text-sm text-font_color">
              กลุ่มงาน / สาขา
            </label>
            <ListBoxComponent
              placeholder="กลุ่มงาน"
              selectedValue={selectedGroup}
              options={[{ id: 0, name: "เลือกกลุ่มงาน" }, ...branch]}
              onChange={handleSlectGroup}
            />
            {errorInput.group && (
              <p className="text-sm text-red-500">**โปรดเลือกกลุ่มงาน</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="fac" className="text-sm text-font_color">
              ตำแหน่งระดับคณะ
            </label>
            <ListBoxComponent
              placeholder="ตำแหน่งระดับคณะ"
              selectedValue={selectedFac}
              options={[
                { id: 0, name: "เลือกตำแหน่งระดับคณะ" },
                ...positionFac,
              ]}
              onChange={handleSlectFac}
            />
            {errorInput.fac && (
              <p className="text-sm text-red-500">**โปรดเลือกตำแหน่งระดับคณะ</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="branch" className="text-sm text-font_color">
              ตำแหน่งระดับสาขา
            </label>
            <ListBoxComponent
              placeholder="ตำแหน่งระดับสาขา"
              selectedValue={selectedBranch}
              options={[
                { id: 0, name: "เลือกตำแหน่งระดับสาขา" },
                ...positionBranch,
              ]}
              onChange={handleSlectBranch}
            />
            {errorInput.branch && (
              <p className="text-sm text-red-500">
                **โปรดเลือกตำแหน่งระดับสาขา
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
      </DialogInsert>
      <DialogEdit
        title="แก้ไขรายการผู้ใช้"
        onClose={() => setOpenEditData(false)}
        open={openEditData}
      >
        <form
          onSubmit={handleSubmitEdit(onSubmitEdit)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm text-font_color">
              ชื่อ-สกุล
            </label>
            <Input
              type="text"
              placeholder="ชื่อ-สกุล"
              {...registerEdit("name", { required: "โปรดกรอกชื่อ-สกุล" })}
            />
            {errorsEdit.name && (
              <span className="text-sm text-red-500">
                {errorsEdit.name.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="text-sm text-font_color">
              Username
            </label>
            <Input
              type="text"
              placeholder="username"
              {...registerEdit("username", { required: "โปรดกรอก Username" })}
            />
            {errorsEdit.username && (
              <span className="text-sm text-red-500">
                {errorsEdit.username.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="group" className="text-sm text-font_color">
              กลุ่มงาน / สาขา
            </label>
            <ListBoxComponent
              placeholder="กลุ่มงาน"
              selectedValue={selectedGroup}
              options={[{ id: 0, name: "เลือกกลุ่มงาน" }, ...branch]}
              onChange={handleSlectGroup}
            />
            {errorInput.group && (
              <p className="text-sm text-red-500">**โปรดเลือกกลุ่มงาน</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="fac" className="text-sm text-font_color">
              ตำแหน่งระดับคณะ
            </label>
            <ListBoxComponent
              placeholder="ตำแหน่งระดับคณะ"
              selectedValue={selectedFac}
              options={[
                { id: 0, name: "เลือกตำแหน่งระดับคณะ" },
                ...positionFac,
              ]}
              onChange={handleSlectFac}
            />
            {errorInput.fac && (
              <p className="text-sm text-red-500">**โปรดเลือกตำแหน่งระดับคณะ</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="branch" className="text-sm text-font_color">
              ตำแหน่งระดับสาขา
            </label>
            <ListBoxComponent
              placeholder="ตำแหน่งระดับสาขา"
              selectedValue={selectedBranch}
              options={[
                { id: 0, name: "เลือกตำแหน่งระดับสาขา" },
                ...positionBranch,
              ]}
              onChange={handleSlectBranch}
            />
            {errorInput.branch && (
              <p className="text-sm text-red-500">
                **โปรดเลือกตำแหน่งระดับสาขา
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
      </DialogEdit>
      <DialogDel
        title="ลบรายการผู้ใช้"
        detail={
          <>
            คุณต้องการลบรายการผู้ใช้ รหัสผู้ใช้: <b>{delData.name}</b> หรือไม่
          </>
        }
        onClose={closeModalDel}
        open={openDelData}
        idDel={String(delData.index)}
        onDel={onDel}
      />
    </Layout>
  );
};

export default UserPage;
