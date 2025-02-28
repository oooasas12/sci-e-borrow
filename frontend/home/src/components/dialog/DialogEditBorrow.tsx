"use client";

import React, { useEffect } from "react";
import { useRouter } from 'next/navigation'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { FaCheck, FaCircleNotch, FaXmark } from "react-icons/fa6";
import ButtonSelectColor from "../button/buttonSelectColor";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Equipment } from "@/types/equipment";
import { MdDelete } from "react-icons/md";
import { useState } from "react";
import { BorrowListDetail } from "@/types/borrowList";

type DialogData = {
    onClick?: () => void; // ฟังก์ชันที่จะเรียกเมื่อคลิก
    className?: string; // รองรับคลาสเพิ่มเติม
    onClose: () => void;
    idDel?: string;
    open: boolean;
    title: string;
    children: React.ReactNode;
    tableData: BorrowListDetail[];
    tableDataInsert: Equipment[];
    handleDelSelectData: (value: string[]) => void;
    handleDelSelectDataInsert: (value: Equipment) => void;
};

export const DialogEdit = ({
    onClick,
    className,
    onClose,
    open,
    title,
    children,
    tableData,
    tableDataInsert,
    handleDelSelectData,
    handleDelSelectDataInsert
}: DialogData) => {

    const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
    const SelectedDelData = (value: string) => {
        if (selectedEquipment.includes(value)) {
            setSelectedEquipment(selectedEquipment.filter((item) => item !== value));
        } else {
            setSelectedEquipment([...selectedEquipment, value]);
        }
    }

    useEffect(() => {
        setSelectedEquipment([]);
    }, [tableData]);
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
                            <div className='flex flex-col md:flex-row gap-4 overflow-hidden h-full '>
                                {children}
                                <div className='flex flex-col gap-4 w-full p-[1px]'>
                                    <Table className='rounded-xl border relative '>
                                        <TableHeader className="sticky top-0 bg-white z-10 outline outline-1 outline-gray-200">
                                            <TableRow>
                                                <TableHead>

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
                                                <TableHead className="w-[10%]">
                                                    หน่วยนับ
                                                </TableHead>
                                                <TableHead>
                                                    สถานที่
                                                </TableHead>
                                                <TableHead></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {tableData.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={8} className="h-24 text-center">
                                                        <FaCircleNotch className="text-primary_1 text-4xl animate-spin mx-auto" />
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                tableData.map((item) => (
                                                    <TableRow key={item.id} className={`cursor-pointer`} onClick={() => SelectedDelData(item.id.toString())}>
                                                        <TableCell>
                                                            <div className={`w-4 h-4 rounded-sm border border-gray-300 ${selectedEquipment.includes(item.id.toString()) ? 'bg-primary_1' : ''}`}>
                                                                <FaCheck className={`text-white ${selectedEquipment.includes(item.id.toString()) ? 'block' : 'hidden'}`} />
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{item.equipment.code}</TableCell>
                                                        <TableCell>{item.equipment.equipment_name.name}</TableCell>
                                                        <TableCell>{item.equipment.value}</TableCell>
                                                        <TableCell >{item.equipment.unit.name}</TableCell>
                                                        <TableCell colSpan={2}>{item.equipment.location}</TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                            {tableDataInsert && tableDataInsert.length > 0 && (
                                                <TableRow className="bg-gray-100">
                                                    <TableCell colSpan={7}>
                                                        <div className="flex flex-col gap-2">
                                                            <span className="text-sm text-gray-500 text-center">เพิ่มครุภัณฑ์</span>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                            {tableDataInsert && tableDataInsert.length > 0 && (
                                                tableDataInsert.map(item => (
                                                    <TableRow key={item.id}>
                                                        <TableCell></TableCell>
                                                        <TableCell>{item.code}</TableCell>
                                                        <TableCell>{item.equipment_name.name}</TableCell>
                                                        <TableCell>{item.value}</TableCell>
                                                        <TableCell>{item.unit.name}</TableCell>
                                                        <TableCell>{item.location}</TableCell>
                                                        <TableCell>
                                                            <MdDelete className="text-red-600 cursor-pointer" size={24} onClick={() => handleDelSelectDataInsert(item)} />
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                    <div className={`flex justify-end ${selectedEquipment.length === 0 ? 'hidden' : ''}`}>
                                        <MdDelete className="text-white bg-red-600 rounded-sm cursor-pointer p-1" size={32} onClick={() => handleDelSelectData(selectedEquipment)} />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
};

export default DialogEdit;
