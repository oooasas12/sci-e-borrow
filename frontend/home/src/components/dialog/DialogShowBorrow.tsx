"use client";

import React from "react";
import { useRouter } from 'next/navigation'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { FaCircleNotch, FaXmark } from "react-icons/fa6";
import ButtonSelectColor from "../button/buttonSelectColor";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Equipment } from "@/types/equipment";
import { MdDelete } from "react-icons/md";

type DialogData = {
    onClick?: () => void; // ฟังก์ชันที่จะเรียกเมื่อคลิก
    className?: string; // รองรับคลาสเพิ่มเติม
    onClose: () => void;
    idDel?: string;
    open: boolean;
    title: string;
    tableData: Equipment[];
};

export const DialogEdit = ({
    onClick,
    className,
    onClose,
    open,
    title,
    tableData
}: DialogData) => {

    return (
        <Dialog open={open} onClose={onClose} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex gap-4 min-h-full items-start justify-center p-4 sm:items-center text-center sm:p-0 h-full">
                    <DialogPanel
                        transition
                        className="relative transform overflow-visible rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-[80%] sm:max-h-[80%] h-full sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                    >
                        <div className='flex flex-col gap-4 h-full'>
                            <div className='flex justify-between'>
                                <DialogTitle as="h2" className="text-base font-semibold text-gray-900">
                                    {title}
                                </DialogTitle>
                                <FaXmark className=' cursor-pointer text-gray-400 hover:text-gray-600' onClick={onClose} />
                            </div>
                            <div className="text-base">
                                จำนวนครุภัณฑ์ที่ยีมคืน: {tableData.length}
                            </div>
                            <div className='flex flex-col md:flex-row gap-4 overflow-hidden h-full p-[1px]'>
                                    <Table className='rounded-xl border p-1'>
                                        <TableHeader className=" sticky top-0 bg-white z-10 outline outline-1 outline-gray-200">
                                            <TableRow >
                                                <TableHead>
                                                    #
                                                </TableHead>
                                                <TableHead>
                                                    รหัสอุปกรณ์
                                                </TableHead>
                                                <TableHead>
                                                    ชื่ออุปกรณ์
                                                </TableHead>
                                                <TableHead>
                                                    มูลค่า
                                                </TableHead>
                                                <TableHead>
                                                    หน่วยนับ
                                                </TableHead>
                                                <TableHead>
                                                    สถานที่
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {tableData.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="h-24 text-center">
                                                        <FaCircleNotch className="text-primary_1 text-4xl animate-spin mx-auto" />
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                tableData.map((item, index) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell>{index + 1}</TableCell>
                                                        <TableCell>{item.code}</TableCell>
                                                        <TableCell>{item.equipment_name.name}</TableCell>
                                                        <TableCell>{item.value}</TableCell>
                                                        <TableCell>{item.unit.name}</TableCell>
                                                        <TableCell>{item.location}</TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
};

export default DialogEdit;
