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
import html2pdf from 'html2pdf.js';
import PaginationList from "../pagination/PaginationList";

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
    const [perPage, setPerPage] = useState(12)
    const [currentPage, setCurrentPage] = useState(1)

    const perPageSelectorHandler = (perPage: number) => {
        setCurrentPage(1)
        setPerPage(perPage)
    }

    const pageDirectHandler = (index: number) => {
        setCurrentPage(index + 1)
    }

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

    const handleDeleteSignature = async (signatureId: number) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/signature/${signatureId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchSignatures(user.id);
            }
        } catch (error) {
            console.error('Error deleting signature:', error);
        }
    };

    const handleGeneratePDF = async () => {
        // คำนวณจำนวนหน้าทั้งหมด
        const itemsPerPage = 12;
        const totalPages = Math.ceil(data.length / itemsPerPage);

        // แปลง base64 ของโลโก้
        const logoUrl = '/images/logo-sru.png';
        const logoResponse = await fetch(logoUrl);
        const logoBlob = await logoResponse.blob();
        const logoBase64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(logoBlob);
        });

        const opt = {
            margin: [10, 10, 10, 10],
            filename: `คำร้องขอยืมครุภัณฑ์_${data[0].borrow_list.id}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                logging: true
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: 'avoid-all', before: '.page-break' }
        };

        // สร้าง element ชั่วคราวสำหรับแต่ละหน้า
        const tempContainer = document.createElement('div');
        tempContainer.style.cssText = 'font-family: sarabun, sans-serif; color: black;';
        document.body.appendChild(tempContainer);

        let pdfContent = '';

        for (let page = 0; page < totalPages; page++) {
            const startIdx = page * itemsPerPage;
            const endIdx = Math.min((page + 1) * itemsPerPage, data.length);
            const pageItems = data.slice(startIdx, endIdx);

            pdfContent += `
                <div class="${page > 0 ? 'page-break' : ''}" style="width: 100%; padding: 20px;">
                    <div style="display: flex; margin-bottom: 20px;">
                        <div style="display: flex; width: 100%;">
                            <img src="${logoBase64}" alt="Logo" style="height: 100px;" />
                            <div style="margin-left: 20px;">
                                <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">คำร้องขอยืมรายการครุภัณฑ์</h2>
                                <h3 style="font-size: 18px; font-weight: bold;">คณะวิทยาศาสตร์และเทคโนโลยี มหาวิทยาลัยราชภัฏสุราษฎร์ธานี</h3>
                                <div style="text-align: right; margin-top: 20px;">
                                    <p>วันที่ ${new Date().getDate()} เดือน ${new Date().toLocaleString('th-TH', { month: 'long' })} พ.ศ. ${new Date().getFullYear() + 543}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style="margin: 20px 0;">
                        <p style="font-size: 16px;">รายการยืมครุภัณฑ์ที่ ${data[0].borrow_list.id} (หน้า ${page + 1}/${totalPages})</p>
                    </div>

                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <thead>
                            <tr>
                                <th style="border: 1px solid #ccc; padding: 8px; text-align: center;">ลำดับ</th>
                                <th style="border: 1px solid #ccc; padding: 8px; text-align: center;">เลขที่ครุภัณฑ์</th>
                                <th style="border: 1px solid #ccc; padding: 8px; text-align: center;">รายการ</th>
                                <th style="border: 1px solid #ccc; padding: 8px; text-align: center;">วันที่ใช้งาน</th>
                                <th style="border: 1px solid #ccc; padding: 8px; text-align: center;">วันที่ส่งคืน</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${pageItems.map((item, index) => `
                                <tr>
                                    <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">${startIdx + index + 1}</td>
                                    <td style="border: 1px solid #ccc; padding: 8px;">${item.equipment.code}</td>
                                    <td style="border: 1px solid #ccc; padding: 8px;">${item.equipment.equipment_name.name}</td>
                                    <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">${new Date(item.borrow_list.date_borrow).toLocaleDateString('th-TH')}</td>
                                    <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">${new Date(item.borrow_list.date_return).toLocaleDateString('th-TH')}</td>
                                </tr>
                            `).join('')}
                            ${Array(itemsPerPage - pageItems.length).fill(0).map((_, index) => `
                                <tr>
                                    <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">${startIdx + pageItems.length + index + 1}</td>
                                    <td style="border: 1px solid #ccc; padding: 8px;">&nbsp;</td>
                                    <td style="border: 1px solid #ccc; padding: 8px;">&nbsp;</td>
                                    <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">&nbsp;</td>
                                    <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">&nbsp;</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <div style="display: flex; justify-content: space-between; margin-top: auto; height: 100%;">
                        <div style="text-align: center; margin-top: auto;">
                            <p>ลงชื่อ ${data[0].borrow_list.user.name} ผู้ยืม</p>
                            <p style="margin-top: 5px;">( ${data[0].borrow_list.user.name} )</p>
                        </div>
                        <div style="text-align: center;">
                            ${selectedSignature ? `
                                <img 
                                    src="${selectedSignature}"
                                    alt="ลายเซ็นผู้อนุมัติ"
                                    style="width: 80px; height: 80px; object-fit: contain; margin: 0 auto -12px;"
                                />
                            ` : ''}
                            <p>ลงชื่อ...........................................................ผู้อนุมัติ</p>
                            <p style="margin-top: 5px;">( ${selectedSignature ? data[0].borrow_list.user.name : '......................................................'} )</p>
                        </div>
                    </div>
                </div>
            `;
        }

        tempContainer.innerHTML = pdfContent;

        try {
            await html2pdf()
                .set(opt)
                .from(tempContainer)
                .toPdf()
                .get('pdf')
                .then((pdf: any) => {
                    const totalPages = pdf.internal.getNumberOfPages();
                    for (let i = 1; i <= totalPages; i++) {
                        pdf.setPage(i);
                        pdf.setFontSize(10);
                        pdf.text(`หน้า ${i} จาก ${totalPages}`, pdf.internal.pageSize.getWidth() - 30, pdf.internal.pageSize.getHeight() - 10);
                    }
                })
                .save();
        } catch (error) {
            console.error('Error generating PDF:', error);
        } finally {
            document.body.removeChild(tempContainer);
        }
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
                                <div id="pdf-content" className="w-full p-12">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-start w-full">
                                            <img src="/images/logo-sru.png" alt="Logo" className="h-32" />
                                            <div className="flex flex-col gap-6 w-full">
                                                <div className="ml-4 flex flex-col gap-2">
                                                    <h2 className="text-lg font-semibold">คำร้องขอยืมรายการครุภัณฑ์</h2>
                                                    <h3 className="text-lg font-semibold">คณะวิทยาศาสตร์และเทคโนโลยี มหาวิทยาลัยราชภัฏสุราษฎร์ธานี</h3>
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
                                        <p className="text-lg ">รายการยืมครุภัณฑ์ที่ {data[0].borrow_list.id}</p>
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
                                            {data?.slice(
                                                currentPage * perPage - perPage,
                                                currentPage * perPage
                                            ).map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="border border-gray-300 p-2">{index + 1}</TableCell>
                                                    <TableCell className="border border-gray-300 p-2">{item.equipment.code}</TableCell>
                                                    <TableCell className="border border-gray-300 p-2">{item.equipment.equipment_name.name}</TableCell>
                                                    <TableCell className="border border-gray-300 p-2">{new Date(item.borrow_list.date_borrow).toLocaleDateString('th-TH')}</TableCell>
                                                    <TableCell className="border border-gray-300 p-2">{new Date(item.borrow_list.date_return).toLocaleDateString('th-TH')}</TableCell>
                                                </TableRow>
                                            ))}
                                            {data?.slice(
                                                currentPage * perPage - perPage,
                                                currentPage * perPage
                                            ).length < 12 && Array(12 - data?.slice(
                                                currentPage * perPage - perPage,
                                                currentPage * perPage
                                            ).length).fill(0).map((_, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="border border-gray-300 p-2">&nbsp;</TableCell>
                                                    <TableCell className="border border-gray-300 p-2">&nbsp;</TableCell>
                                                    <TableCell className="border border-gray-300 p-2">&nbsp;</TableCell>
                                                    <TableCell className="border border-gray-300 p-2">&nbsp;</TableCell>
                                                    <TableCell className="border border-gray-300 p-2">&nbsp;</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    <div className='flex justify-between w-full'>
                                        <PaginationList
                                            current_page={currentPage}
                                            total_item={data.length}
                                            onPerPageSelector={perPageSelectorHandler}
                                            pageDirectHandler={pageDirectHandler} />
                                    </div>

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
                                                        className="w-20 h-20 object-contain mx-auto -mt-3"
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
                            <div className="grid grid-cols-2 gap-4 overflow-y-auto">
                                {signatures.map((sig) => (
                                    <div key={sig.id} className="relative group cursor-pointer">
                                        <img
                                            src={signatureUrls[sig.image_path] || ''}
                                            alt="ลายเซ็น"
                                            className={`w-full h-32 object-contain border rounded-lg p-2 ${selectedSignature === signatureUrls[sig.image_path] ? 'border-primary_1 border-2' : ''}`}
                                            loading="lazy"
                                            onClick={() => handleSignatureSelect(signatureUrls[sig.image_path])}
                                        />
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteSignature(sig.id);
                                                }}
                                                className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                            >
                                                <MdDelete size={20} />
                                            </button>
                                        </div>
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
                            <div className="flex justify-end mt-auto gap-4">
                                <button
                                    onClick={handleGeneratePDF}
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                                >
                                    ไม่อนุมัติ
                                </button>
                                <button
                                    onClick={handleGeneratePDF}
                                    className="bg-primary_1 hover:bg-dark text-white px-4 py-2 rounded-lg"
                                >
                                    อนุมัติ
                                </button>
                            </div>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
};

export default DialogShowBorrowApproval;

