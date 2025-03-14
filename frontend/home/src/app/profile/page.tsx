"use client";
import React, { useEffect, useState } from "react";
import Layout from "@/Layouts/default";
import { useSelector } from "react-redux";
import { User } from "@/types/user";
import { MdEditSquare } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { toast, Toaster } from "react-hot-toast";

export default function ProfilePage() {
  const [user, setUser] = useState<User>();
  const [edit, setEdit] = useState(false);
  const [editInput, setEditInput] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [editName, setEditName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editPasswordOld, setEditPasswordOld] = useState("");
  const [editPasswordNew, setEditPasswordNew] = useState("");
  const [editPasswordConfirm, setEditPasswordConfirm] = useState("");
  const userProfile = useSelector((state: any) => state.auth.user);
  const fetchUser = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userProfile.id}`,
        {
          method: "GET",
        },
      );
      const data = await response.json();
      setUser(data.data[0]);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้:", error);
    }
  };
  useEffect(() => {
    fetchUser();
  }, [userProfile.id]);

  const fetchEditData = async () => {
    const formData = new FormData();
    if (editInput === 0) {
      formData.append("name", editName);
    } else if (editInput === 1) {
      formData.append("username", editUsername);
    }

    await toast.promise(
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userProfile.id}`, {
        method: "PATCH",
        body: formData,
      }),
      {
        loading: "กำลังบันทึกข้อมูล...",
        success: () => {
          fetchUser();
          return "บันทึกข้อมูลสำเร็จ";
        },
        error: "บันทึกข้อมูลไม่สำเร็จ",
      },
    );
  };

  const handleChangePassword = async () => {
    const formData = new FormData();
    if (editPasswordNew === editPasswordConfirm) {
      formData.append("old_password", editPasswordOld);
      formData.append("new_password", editPasswordNew);
      formData.append("confirm_password", editPasswordConfirm);

      await toast.promise(
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/password/${userProfile.id}`,
          {
            method: "PATCH",
            body: formData,
          },
        ),
        {
          loading: "กำลังเปลี่ยนรหัสผ่าน...",
          success: () => {
            setShowPassword(false);
            fetchUser();
            return "เปลี่ยนรหัสผ่านสำเร็จ";
          },
          error: "เปลี่ยนรหัสผ่านไม่สำเร็จ",
        },
      );
      return;
    } else {
      toast.error("รหัสผ่านใหม่ไม่ตรงกัน");
      return;
    }
  };
  const handleEdit = (indexInput: number) => {
    setEdit(true);
    setEditInput(indexInput);
  };

  const handleCheck = () => {
    setEdit(false);
    fetchEditData();
  };

  const handleCancel = () => {
    setEdit(false);
  };
  return (
    <Layout>
      <div className="container mx-auto p-4">
        <Toaster position="bottom-right" reverseOrder={false} />
        <h1 className="title lg text-font_color">แก้ไขโปรไฟล์</h1>
        <div className="mt-8 flex flex-col gap-4 rounded-md border border-gray-300 p-6">
          <div className="flex flex-col gap-2">
            <label className="block text-lg">ชื่อ-สกุล</label>
            <div className="grid w-fit grid-cols-2 gap-2">
              {edit && editInput === 0 ? (
                <Input
                  type="text"
                  className="w-full border p-2"
                  placeholder={user?.name}
                  onChange={(e) => setEditName(e.target.value)}
                />
              ) : (
                <span className="text-font_color">{user?.name}</span>
              )}
              {!edit || editInput != 0 ? (
                <MdEditSquare
                  size={20}
                  className="cursor-pointer text-yellow-500"
                  onClick={() => handleEdit(0)}
                />
              ) : (
                <div className="flex gap-2">
                  <FaCheck
                    size={20}
                    className="cursor-pointer rounded-sm bg-green-500 p-1 text-white"
                    onClick={() => handleCheck()}
                  />
                  <FaXmark
                    size={20}
                    className="cursor-pointer rounded-sm bg-red-500 p-1 text-white"
                    onClick={() => handleCancel()}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="block text-lg">username</label>
            <div className="grid w-fit grid-cols-2 gap-2">
              {edit && editInput === 1 ? (
                <Input
                  type="text"
                  className="w-full border p-2"
                  placeholder={user?.username}
                  onChange={(e) => setEditUsername(e.target.value)}
                />
              ) : (
                <span className="text-font_color">{user?.username}</span>
              )}
              {!edit || editInput != 1 ? (
                <MdEditSquare
                  size={20}
                  className="cursor-pointer text-yellow-500"
                  onClick={() => handleEdit(1)}
                />
              ) : (
                <div className="flex gap-2">
                  <FaCheck
                    size={20}
                    className="cursor-pointer rounded-sm bg-green-500 p-1 text-white"
                    onClick={() => handleCheck()}
                  />
                  <FaXmark
                    size={20}
                    className="cursor-pointer rounded-sm bg-red-500 p-1 text-white"
                    onClick={() => handleCancel()}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex w-fit flex-col gap-2">
            <button
              className="rounded-sm bg-primary_1 px-4 py-2 text-white"
              onClick={() => setShowPassword(true)}
            >
              เปลี่ยนรหัสผ่าน
            </button>
          </div>
        </div>
        <Dialog open={showPassword} onClose={() => setShowPassword(false)}>
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
                <div className="flex justify-between">
                  <DialogTitle
                    as="h2"
                    className="text-base font-semibold text-gray-900"
                  >
                    เปลี่ยนรหัสผ่าน
                  </DialogTitle>
                  <FaXmark
                    className="cursor-pointer text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(false)}
                  />
                </div>
                <div className="mt-6 flex flex-col gap-4">
                  <Input
                    type="password"
                    placeholder="รหัสผ่านเก่า"
                    onChange={(e) => setEditPasswordOld(e.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder="รหัสผ่านใหม่"
                    onChange={(e) => setEditPasswordNew(e.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder="ยืนยันรหัสผ่านใหม่"
                    onChange={(e) => setEditPasswordConfirm(e.target.value)}
                  />
                </div>
                <div className="mt-6 flex gap-2">
                  <button
                    type="submit"
                    className="rounded-sm bg-primary_1 px-4 py-2 text-white"
                    onClick={() => handleChangePassword()}
                  >
                    ยืนยัน
                  </button>
                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      </div>
    </Layout>
  );
}
