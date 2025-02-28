"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { FaCheck, FaXmark } from "react-icons/fa6";
import ButtonSelectColor from "../button/buttonSelectColor";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Equipment } from "@/types/equipment";
import { MdDelete } from "react-icons/md";
import { EquipmentBroken } from "@/types/equipmentBroken";
import ButtonPrimary from "../button/buttonPrimary";

type DialogData = {
    className?: string; // รองรับคลาสเพิ่มเติม
    onClose: () => void;
    idDel?: string;
    open: boolean;
    title: string;
    tableData: EquipmentBroken[];
    handleChangeStatus: (status: number, equipmet_id: string[]) => void;
    status: { id: number, name: string }[];
};

export const DialogEdit = ({
    className,
    onClose,
    open,
    title,
    tableData,
    handleChangeStatus,
    status
}: DialogData) => {
    const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<number>(0);

    const SelectedId = (value: string) => {
        if (selectedEquipment.includes(value)) {
            setSelectedEquipment(selectedEquipment.filter((item) => item !== value));
        } else {
            setSelectedEquipment([...selectedEquipment, value]);
        }
    }

    useEffect(() => {
        setSelectedEquipment([]);
        setSelectedStatus(0);
    }, [open]);

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
                        <div className='flex flex-col gap-4'>
                            <div className='flex justify-between'>
                                <DialogTitle as="h2" className="text-base font-semibold text-gray-900">
                                    {title}
                                </DialogTitle>
                                <FaXmark className=' cursor-pointer text-gray-400 hover:text-gray-600' onClick={onClose} />
                            </div>
                            <div className='flex flex-col md:flex-row gap-4'>
                                <div className='w-full md:w-1/3'>
                                    <div className='flex flex-col'>
                                        <label className='text-sm font-semibold mb-3'>เลือกสถานะ:</label>
                                        {status.map((statusItem) => (
                                            <label key={statusItem.id} className='flex items-center mb-2'>
                                                <input
                                                    type="radio"
                                                    value={statusItem.id}
                                                    checked={selectedStatus === statusItem.id}
                                                    onChange={() => setSelectedStatus(statusItem.id)}
                                                    className='mr-2'
                                                />
                                                {statusItem.name}
                                            </label>
                                        ))}
                                        <ButtonPrimary data='ยืนยัน' type='button' size='small' className='mr-auto mt-5' onClick={() => handleChangeStatus(selectedStatus, selectedEquipment)} />
                                    </div>
                                </div>
                                <Table className='rounded-xl border'>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead></TableHead>
                                            <TableHead>
                                                รหัสอุปกรณ์
                                            </TableHead>
                                            <TableHead>
                                                ชื่ออุปกรณ์
                                            </TableHead>
                                            <TableHead>
                                                ประเภทครุภัณฑ์
                                            </TableHead>
                                            <TableHead>
                                                รายละเอียด
                                            </TableHead>
                                            <TableHead>
                                                วันที่ชำรุด
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {tableData.map((item) => (
                                            <TableRow key={item.id} className={`cursor-pointer`} onClick={() => SelectedId(item.id.toString())}>
                                                <TableCell>
                                                    <div className={`w-4 h-4 rounded-sm border border-gray-300 ${selectedEquipment.includes(item.id.toString()) ? 'bg-primary_1' : ''}`}>
                                                        <FaCheck className={`text-white ${selectedEquipment.includes(item.id.toString()) ? 'block' : 'hidden'}`} />
                                                    </div>
                                                </TableCell>
                                                <TableCell>{item.equipment.code}</TableCell>
                                                <TableCell>{item.equipment.equipment_name.name}</TableCell>
                                                <TableCell>{item.equipment.equipment_group.name}</TableCell>
                                                <TableCell>{item.detail}</TableCell>
                                                <TableCell>{new Date(item.date_broken).toLocaleDateString('th-TH')}</TableCell>
                                            </TableRow>
                                        ))}
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
