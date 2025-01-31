"use client";

import React from "react";
import { useRouter } from 'next/navigation'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { FaXmark } from "react-icons/fa6";
import ButtonSelectColor from "../button/buttonSelectColor";

type DialogData = {
    onClick?: () => void; // ฟังก์ชันที่จะเรียกเมื่อคลิก
    className?: string; // รองรับคลาสเพิ่มเติม
    onClose: () => void;
    idDel?: string;
    open: boolean;
    title: string;
    children: React.ReactNode
};

export const DialogEdit = ({
    onClick,
    className,
    onClose,
    open,
    title,
    children
}: DialogData) => {

    return (
        <Dialog open={open} onClose={onClose} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex gap-4 min-h-full items-start justify-center p-4 sm:items-center text-center sm:p-0">
                    <DialogPanel
                        transition
                        className="relative transform overflow-visible rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-xl sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                    >
                        <div className='flex flex-col gap-4'>
                            <div className='flex justify-between'>
                                <DialogTitle as="h2" className="text-base font-semibold text-gray-900">
                                    {title}
                                </DialogTitle>
                                <FaXmark className=' cursor-pointer text-gray-400 hover:text-gray-600' onClick={onClose} />
                            </div>
                            {children}
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
};

export default DialogEdit;
