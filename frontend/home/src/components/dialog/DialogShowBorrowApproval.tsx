"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { FaCircleNotch, FaCirclePlus, FaXmark } from "react-icons/fa6";
import ButtonSelectColor from "../button/buttonSelectColor";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Equipment } from "@/types/equipment";
import { MdDelete } from "react-icons/md";
import BorrowForm from "../forms/BorrowForm";
import { BorrowListDetail } from "@/types/borrowList";
import ButtonPrimary from "../button/buttonPrimary";
import { useSelector } from 'react-redux';

type DialogData = {
    onClick?: () => void; // ฟังก์ชันที่จะเรียกเมื่อคลิก
    className?: string; // รองรับคลาสเพิ่มเติม
    onClose: () => void;
    idDel?: string;
    open: boolean;
    title: string;
    data: BorrowListDetail[];
};

type Signature = {
    id: number;
    image_path: string;
    image_name: string;
};

export const DialogShowBorrowApproval = ({
    onClick,
    className,
    onClose,
    open,
    title,
    data
}: DialogData) => {
    const [signatures, setSignatures] = useState<Signature[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | string | null>(null);
    const [selectedSignature, setSelectedSignature] = useState<string>('');
    const user = useSelector((state: any) => state.auth.user);
    const [signatureUrls, setSignatureUrls] = useState<{ [key: string]: string }>({});

    const fetchSignatures = async (userId: number) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/signature/user/${userId}`);
            const result = await response.json();
            if (result.data) {
                setSignatures(result.data);
            }
        } catch (error) {
            console.error('Error fetching signatures:', error);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        formData.append('user_id', user.id.toString()); // ต้องแก้เป็น user ID จริง

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/signature/upload`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                fetchSignatures(user.id); // ต้องแก้เป็น user ID จริง
            }
        } catch (error) {
            console.error('Error uploading signature:', error);
        }
    };

    const handleSignatureImage = async (imagePath: string) => {
        const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/signature/image/${imagePath}`;
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        
        return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result as string);
            };
            reader.readAsDataURL(blob);
        });
    };

    const handleSignatureSelect = (signatureUrl: string) => {
        setSelectedSignature(signatureUrl);
    };

    useEffect(() => {
        if (open) {
            fetchSignatures(user.id); // ต้องแก้เป็น user ID จริง
        }
    }, [open]);

    useEffect(() => {
        const loadSignatures = async () => {
            const urls: { [key: string]: string } = {};
            for (const sig of signatures) {
                urls[sig.image_path] = await handleSignatureImage(sig.image_path);
            }
            setSignatureUrls(urls);
        };
        
        if (signatures.length > 0) {
            loadSignatures();
        }
    }, [signatures]);

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
                        className="relative flex gap-4 transform overflow-visible  text-left  transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-[80%] sm:max-h-[99%] h-full sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                    >
                        <div className='flex flex-col gap-4 h-full w-4/5 bg-white rounded-lg  px-4 pt-5 pb-4 shadow-xl overflow-y-auto'>
                            <div className='flex justify-between'>
                                <DialogTitle as="h2" className="text-base font-semibold text-gray-900">
                                    {title}
                                </DialogTitle>
                                <FaXmark className=' cursor-pointer text-gray-400 hover:text-gray-600' onClick={onClose} />
                            </div>

                            {data.length > 0 && data[0].borrow_list && (
                                <div className="w-full">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-start w-full">
                                            <img src="/images/logo-sru.png" alt="Logo" className="h-32" />
                                            <div className="flex flex-col gap-6 w-full">
                                                <div className="ml-4 flex flex-col gap-2">
                                                    <h2 className="text-xl font-semibold">คำร้องขอยืมรายการครุภัณฑ์</h2>
                                                    <h3 className="text-xl font-semibold">คณะวิทยาศาสตร์และเทคโนโลยี มหาวิทยาลัยราชภัฏสุราษฎร์ธานี</h3>
                                                </div>
                                                <div className="text-right mt-auto">
                                                    {(() => {
                                                        const today = new Date();
                                                        const day = today.getDate();
                                                        const month = today.toLocaleString('th-TH', { month: 'long' });
                                                        const year = today.getFullYear() + 543; // แปลงเป็นปี พ.ศ.
                                                        return <p>วันที่ {day} เดือน {month} พ.ศ. {year}</p>;
                                                    })()}
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="mb-4 mt-10">
                                        <p className="text-lg ">รายการยืมครุภัณฑ์ที่ {data[0].borrow_list.id} รายการ</p>
                                    </div>

                                    <Table className="w-full border-collapse border border-gray-300">
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="border border-gray-300 p-2">ลำดับ</TableHead>
                                                <TableHead className="border border-gray-300 p-2">เลขที่ครุภัณฑ์</TableHead>
                                                <TableHead className="border border-gray-300 p-2">รายการ</TableHead>
                                                <TableHead className="border border-gray-300 p-2">วันที่ใช้งาน</TableHead>
                                                <TableHead className="border border-gray-300 p-2">วันที่ส่งคืน</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {data.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="border border-gray-300 p-2">{index + 1}</TableCell>
                                                    <TableCell className="border border-gray-300 p-2">{item.equipment.code}</TableCell>
                                                    <TableCell className="border border-gray-300 p-2">{item.equipment.equipment_name.name}</TableCell>
                                                    <TableCell className="border border-gray-300 p-2">{new Date(item.borrow_list.date_borrow).toLocaleDateString('th-TH')}</TableCell>
                                                    <TableCell className="border border-gray-300 p-2">{new Date(item.borrow_list.date_return).toLocaleDateString('th-TH')}</TableCell>
                                                </TableRow>
                                            ))}
                                            {data.length < 12 && (
                                                [...Array(12 - data.length)].map((_, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell className="border border-gray-300 p-4"></TableCell>
                                                        <TableCell className="border border-gray-300 p-4"></TableCell>
                                                        <TableCell className="border border-gray-300 p-4"></TableCell>
                                                        <TableCell className="border border-gray-300 p-4"></TableCell>
                                                        <TableCell className="border border-gray-300 p-4"></TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                            {data.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="border border-gray-300 p-2">ไม่พบข้อมูล</TableCell>
                                                </TableRow>
                                            )}

                                        </TableBody>
                                    </Table>

                                    <div className="flex justify-between items-end mt-20">
                                        <div className="text-center">
                                            <p>ลงชื่อ {data[0].borrow_list.user.name} ผู้ยืม</p>
                                            <p className="mt-1">( {data[0].borrow_list.user.name} )</p>
                                        </div>
                                        <div className="text-center">
                                            <div style={{ position: 'relative', minHeight: '50px' }}>
                                                {selectedSignature && (
                                                    <img 
                                                        src={selectedSignature} 
                                                        alt="ลายเซ็นผู้อนุมัติ" 
                                                        className="w-20 h-20 object-contain mx-auto"
                                                    />
                                                )}
                                                <p>ลงชื่อ...........................................................ผู้อนุมัติ</p>
                                            </div>
                                            <p className="mt-1">( {selectedSignature ? data[0].borrow_list.user.name : '......................................................'} )</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>

                        <div className="flex flex-col gap-4 w-1/5 h-full bg-white rounded-lg px-4 pt-5 pb-4 shadow-xl">
                            <h3 className="font-semibold">ลายเซ็น</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {signatures.map((sig) => (
                                    <div key={sig.id} className="relative group cursor-pointer" onClick={() => handleSignatureSelect(signatureUrls[sig.image_path])}>
                                        <img
                                            src={signatureUrls[sig.image_path] || ''}
                                            alt="ลายเซ็น"
                                            className="w-full h-32 object-contain border rounded-lg p-2"
                                            loading="lazy"
                                        />
                                    </div>
                                ))}
                                <label className="bg-gray-100 hover:bg-gray-200 p-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileUpload}
                                    />
                                    <FaCirclePlus size={20} className="text-gray-500" />
                                </label>
                            </div>
                            <div className="flex justify-end mt-auto">
                                <button className="bg-primary_1 hover:bg-dark text-white px-4 py-2 rounded-md">อนุมัติการยืม-คืน</button>
                            </div>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
};

export default DialogShowBorrowApproval;

