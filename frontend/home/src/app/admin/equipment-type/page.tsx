"use client";
import React, { useEffect, useState } from 'react';
import Layout from '@/Layouts/default';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FaCheck, FaXmark } from 'react-icons/fa6';
import { useForm, SubmitHandler } from "react-hook-form"
import { CheckIcon } from 'lucide-react';
import ButtonPrimary from '@/components/button/buttonPrimary';
import { FaRegEdit } from 'react-icons/fa';
import { MdDelete, MdEditSquare } from "react-icons/md";
import PaginationList from '@/components/pagination/PaginationList';
import { IoIosArrowDown } from 'react-icons/io';
import ListBoxComponent from '@/components/ListBox/ListBox';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import { EquipmentGroup } from '@/types/general';

const EquipmentTypePage: React.FC = () => {
    // แยก useForm สำหรับการเพิ่มและแก้ไขข้อมูล
    const {
        register: registerInsert,
        handleSubmit: handleSubmitInsert,
        formState: { errors: errorsInsert },
        reset: resetInsert,
    } = useForm<EquipmentGroup>();

    const {
        register: registerEdit,
        handleSubmit: handleSubmitEdit,
        setValue: setValueEdit,
        formState: { errors: errorsEdit },
        reset: resetEdit,
    } = useForm<EquipmentGroup>();

    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState<EquipmentGroup[]>([]);
    const [filteredData, setFilteredData] = useState(data);
    const [openInsertData, setOpenInsertData] = useState(false);
    const [openEditData, setOpenEditData] = useState(false);
    const [openDelData, setOpenDelData] = useState(false);
    const [editData, setEditData] = useState<EquipmentGroup>();
    const [delData, setDelData] = useState({
        index: 0,
        name: ''
    });
    const [currentPage, setCurrentPage] = useState(1)
    const [perPage, setPerPage] = useState(10)

    // เพิ่ม function สำหรับดึงข้อมูล
    const fetchData = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/equipment-group`);
            const result = await response.json();
            setData(result.data);
            setFilteredData(result.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        let results = data;
        results = results.filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.id.toString().includes(searchTerm)
        );
        setFilteredData(results);
    }, [searchTerm, data]);

    // แก้ไข onSubmit function สำหรับเพิ่มข้อมูล
    const onSubmit = async (data: EquipmentGroup) => {
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('code', data.code);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/equipment-group`, {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                setOpenInsertData(false);
                fetchData();
                toast.success('เพิ่มข้อมูลสำเร็จ');
                resetInsert();
            }
        } catch (error) {
            console.error('Error adding equipment type:', error);
            toast.error('เพิ่มข้อมูลไม่สำเร็จ');
        }
    };

    // เพิ่ม function สำหรับแก้ไขข้อมูล
    const onSubmitEdit = async (data: EquipmentGroup) => {
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('code', data.code);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/equipment-group/${data.id}`, {
                method: 'PUT',
                body: formData
            });
            if (response.ok) {
                setOpenEditData(false);
                fetchData();
                toast.success('แก้ไขข้อมูลสำเร็จ');
                resetEdit();
            }
        } catch (error) {
            console.error('Error editing equipment type:', error);
            toast.error('แก้ไขข้อมูลไม่สำเร็จ');
        }
    };

    const handleEdit = (data: EquipmentGroup) => {
        setEditData(data);
        setValueEdit('id', data.id);
        setValueEdit('name', data.name);
        setValueEdit('code', data.code);
        setOpenEditData(true);
    };

    // แก้ไข function สำหรับลบข้อมูล
    const confirmDelete = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/equipment-group/${delData.index}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setOpenDelData(false);
                fetchData();
                toast.success('ลบข้อมูลสำเร็จ');
            }
        } catch (error) {
            console.error('Error deleting equipment type:', error);
            toast.error('ลบข้อมูลไม่สำเร็จ');
        }
    };

    const handleDel = (index: number, name: string) => {
        setDelData({
            index: index,
            name: name
        });
        setOpenDelData(true);
    }
    const perPageSelectorHandler = (perPage: number) => {
        setCurrentPage(1)
        setPerPage(perPage)
    }

    const pageDirectHandler = (index: number) => {
        setCurrentPage(index + 1)
    }
    return (
        <Layout>
            <div className='container'>
                <Toaster
                    position="bottom-right"
                    reverseOrder={false}
                />
                <h1 className='title lg text-font_color'>รายการประเภทครุภัณฑ์</h1>
                <div className='flex flex-col gap-4 mt-8'>
                    <div className='flex justify-between'>
                        <div className='flex gap-2 '>
                            <Input
                                type="text"
                                placeholder="ค้นหา..."
                                className='min-w-[250px] w-[300px] bg-white'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className='flex'>
                            <button onClick={() => setOpenInsertData(true)} className='bg-primary_1 whitespace-nowrap hover:bg-dark rounded-lg flex items-center gap-2 px-6  text-white w-fit transition-all'>
                                <span>เพิ่มรายการ</span>
                            </button>
                        </div>
                    </div>
                    <Table className='rounded-lg border'>
                        <TableHeader>
                            <TableRow className=''>
                                <TableHead className=' whitespace-nowrap'>#</TableHead>
                                <TableHead className=' whitespace-nowrap'>รหัสประเภทครุภัณฑ์</TableHead>
                                <TableHead className=' whitespace-nowrap'>ประเภทครุภัณฑ์</TableHead>
                                <TableHead className=' whitespace-nowrap'></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData?.slice(
                                currentPage * perPage - perPage,
                                currentPage * perPage
                            ).map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.id}</TableCell>
                                    <TableCell>{item.code}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell className='flex gap-2 justify-end' >
                                        <MdEditSquare
                                            className='text-yellow-500 cursor-pointer'
                                            onClick={() => handleEdit(item)}
                                            size={20}
                                        />
                                        <MdDelete
                                            className='text-red-600 cursor-pointer'
                                            onClick={() => handleDel(item.id, item.name)}
                                            size={20}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className='flex justify-between w-full'>
                        <PaginationList
                            current_page={currentPage}
                            items_per_page={perPage}
                            total_item={filteredData.length}
                            onPerPageSelector={perPageSelectorHandler}
                            pageDirectHandler={pageDirectHandler} />
                    </div>
                </div>
            </div>
            <Dialog open={openInsertData} onClose={() => setOpenInsertData(false)} className="relative z-10">
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
                                        เพิ่มรายการประเภทครุภัณฑ์
                                    </DialogTitle>
                                    <FaXmark className=' cursor-pointer text-gray-400 hover:text-gray-600' onClick={() => setOpenInsertData(false)} />
                                </div>
                                <form onSubmit={handleSubmitInsert(onSubmit)} className='flex flex-col gap-4'>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="code" className='text-sm text-font_color'>รหัสประเภทครุภัณฑ์</label>
                                        <Input
                                            type="text"
                                            placeholder="รหัสประเภทครุภัณฑ์"
                                            {...registerInsert('code', { required: 'โปรดกรอก รหัสประเภทครุภัณฑ์' })}
                                        />
                                        {errorsInsert.code && (
                                            <span className="text-red-500 text-sm">{errorsInsert.code.message}</span>
                                        )}
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="name" className='text-sm text-font_color'>ชื่อประเภทครุภัณฑ์</label>
                                        <Input
                                            type="text"
                                            placeholder="ชื่อประเภทครุภัณฑ์"
                                            {...registerInsert('name', { required: 'โปรดกรอก ชื่อประเภทครุภัณฑ์' })}
                                        />
                                        {errorsInsert.name && (
                                            <span className="text-red-500 text-sm">{errorsInsert.name.message}</span>
                                        )}
                                    </div>
                                    <ButtonPrimary data='เพิ่มรายการ' type='submit' size='small' className='ml-auto' />
                                </form>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
            <Dialog open={openEditData} onClose={() => setOpenEditData(false)} className="relative z-10">
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
                                        แก้ไขรายการประเภทครุภัณฑ์
                                    </DialogTitle>
                                    <FaXmark className=' cursor-pointer text-gray-400 hover:text-gray-600' onClick={() => setOpenEditData(false)} />
                                </div>
                                <form onSubmit={handleSubmitEdit(onSubmitEdit)} className='flex flex-col gap-4'>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="code" className='text-sm text-font_color'>รหัสประเภทครุภัณฑ์</label>
                                        <Input
                                            type="text"
                                            placeholder="รหัสประเภทครุภัณฑ์"
                                            {...registerEdit('code', { required: 'โปรดกรอก รหัสประเภทครุภัณฑ์' })}
                                        />
                                        {errorsEdit.code && (
                                            <span className="text-red-500 text-sm">{errorsEdit.code.message}</span>
                                        )}
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="name" className='text-sm text-font_color'>ชื่อประเภทครุภัณฑ์</label>
                                        <Input
                                            type="text"
                                            placeholder="ชื่อประเภทครุภัณฑ์"
                                            {...registerEdit('name', { required: 'โปรดกรอก ชื่อประเภทครุภัณฑ์' })}
                                        />
                                        {errorsEdit.name && (
                                            <span className="text-red-500 text-sm">{errorsEdit.name.message}</span>
                                        )}
                                    </div>
                                    <ButtonPrimary data='ยืนยัน' type='submit' size='small' className='ml-auto' />
                                </form>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
            <Dialog open={openDelData} onClose={() => setOpenDelData(false)} className="relative z-10">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                />

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex gap-4 min-h-full items-start justify-center p-4 sm:items-center text-center sm:p-0">
                        <DialogPanel
                            transition
                            className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-xl sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                        >
                            <div className='flex flex-col gap-4'>
                                <div className='flex justify-between'>
                                    <DialogTitle as="h2" className="text-base font-semibold text-gray-900">
                                        ลบรายการประเภทครุภัณฑ์
                                    </DialogTitle>
                                    <FaXmark className=' cursor-pointer text-gray-400 hover:text-gray-600' onClick={() => setOpenDelData(false)} />
                                </div>
                                <div className='flex flex-col gap-4'>
                                    <span className='text-font_color'>คุณต้องการลบรายการประเภทครุภัณฑ์ ชื่อ: <b>{delData.name}</b> หรือไม่</span>
                                    <div className='flex gap-4 justify-end'>
                                        <ButtonPrimary
                                            data='ยืนยัน'
                                            size='small'
                                            className='bg-red-500 hover:bg-red-600'
                                            onClick={confirmDelete}
                                        />
                                        <ButtonPrimary
                                            data='ยกเลิก'
                                            size='small'
                                            className='bg-gray-500 hover:bg-gray-600'
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

export default EquipmentTypePage;