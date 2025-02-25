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
import { useSelector } from 'react-redux';
import { SetTime } from '@/types/setTime';  

const Settime: React.FC = () => {
    // ดึงข้อมูล user จาก redux
    const user = useSelector((state: any) => state.auth.user);

    // แยก useForm สำหรับการเพิ่มและแก้ไขข้อมูล
    const {
        register: registerInsert,
        handleSubmit: handleSubmitInsert,
        formState: { errors: errorsInsert },
        reset: resetInsert,
        watch: watchInsert,
    } = useForm<SetTime>();

    // สร้าง interface ใหม่สำหรับฟอร์มแก้ไขที่รองรับ string สำหรับวันที่
    interface EditSetTimeForm extends Omit<SetTime, 'date_start' | 'date_stop'> {
        date_start: string;
        date_stop: string;
    }

    const {
        register: registerEdit,
        handleSubmit: handleSubmitEdit,
        setValue: setValueEdit,
        formState: { errors: errorsEdit },
        reset: resetEdit,
        watch: watchEdit,
    } = useForm<EditSetTimeForm>();

    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState<SetTime[]>([]);
    const [filteredData, setFilteredData] = useState(data);
    const [openInsertData, setOpenInsertData] = useState(false);
    const [openEditData, setOpenEditData] = useState(false);
    const [openDelData, setOpenDelData] = useState(false);
    const [editData, setEditData] = useState<SetTime>();
    const [delData, setDelData] = useState({
        index: 0,
        date: ''
    });
    const [currentPage, setCurrentPage] = useState(1)
    const [perPage, setPerPage] = useState(10)
    // เพิ่ม state สำหรับเก็บวันที่เริ่มต้นและวันที่สิ้นสุดที่ต้องการกรอง
    const [filterDateStart, setFilterDateStart] = useState<string>('');
    const [filterDateEnd, setFilterDateEnd] = useState<string>('');
    const [showDateFilter, setShowDateFilter] = useState<boolean>(false);

    // เพิ่ม function สำหรับดึงข้อมูล
    const fetchData = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/set-time`);
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

    // ปรับปรุงฟังก์ชันการกรองข้อมูล
    useEffect(() => {
        let results = data;
        
        // กรองตามคำค้นหา
        if (searchTerm) {
            results = results.filter((item) =>
                (item.date_start && item.date_start.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item.user.name && item.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item.note && item.note.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item.id && item.id.toString().includes(searchTerm))
            );
        }
        
        // กรองตามช่วงวันที่
        if (filterDateStart && filterDateEnd) {
            const startDate = new Date(filterDateStart);
            const endDate = new Date(filterDateEnd);
            // ตั้งเวลาของ endDate เป็น 23:59:59 เพื่อให้รวมวันสุดท้ายด้วย
            endDate.setHours(23, 59, 59);
            
            results = results.filter((item) => {
                const itemStartDate = item.date_start instanceof Date 
                    ? item.date_start 
                    : new Date(item.date_start);
                
                return itemStartDate >= startDate && itemStartDate <= endDate;
            });
        }
        
        setFilteredData(results);
    }, [searchTerm, data, filterDateStart, filterDateEnd]);
    
    // เพิ่มฟังก์ชันสำหรับล้างตัวกรองวันที่
    const clearDateFilter = () => {
        setFilterDateStart('');
        setFilterDateEnd('');
    };

    // แก้ไข onSubmit function สำหรับเพิ่มข้อมูล
    const onSubmit = async (data: SetTime) => {
        try {
            const formData = new FormData();
            // แปลงวันที่ให้อยู่ในรูปแบบ YYYY-MM-DD ตามที่ Go ต้องการ
            const dateStart = data.date_start instanceof Date ? data.date_start : new Date(data.date_start);
            const dateStop = data.date_stop instanceof Date ? data.date_stop : new Date(data.date_stop);
            
            formData.append('date_start', dateStart.toISOString().split('T')[0]); // YYYY-MM-DD
            formData.append('date_stop', dateStop.toISOString().split('T')[0]); // YYYY-MM-DD
            formData.append('time_start', data.time_start);
            formData.append('time_stop', data.time_stop);
            formData.append('note', data.note || '');
            formData.append('user_id', user.id.toString());

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/set-time`, {
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
            console.error('Error adding set time:', error);
            toast.error('เพิ่มข้อมูลไม่สำเร็จ');
        }
    };

    // เพิ่ม function สำหรับแก้ไขข้อมูล
    const onSubmitEdit = async (data: EditSetTimeForm) => {
        try {
            const formData = new FormData();
            // แปลงวันที่ให้อยู่ในรูปแบบ YYYY-MM-DD ตามที่ Go ต้องการ
            // ไม่จำเป็นต้องแปลงอีกเพราะ data.date_start และ data.date_stop เป็น string อยู่แล้ว
            
            formData.append('date_start', data.date_start); // YYYY-MM-DD
            formData.append('date_stop', data.date_stop); // YYYY-MM-DD
            formData.append('time_start', data.time_start);
            formData.append('time_stop', data.time_stop);
            formData.append('note', data.note || '');
            formData.append('user_id', user.id.toString());
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/set-time/${data.id}`, {
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
            console.error('Error editing set time:', error);
            toast.error('แก้ไขข้อมูลไม่สำเร็จ');
        }
    };

    const handleEdit = (data: SetTime) => {
        setEditData(data);
        setValueEdit('id', data.id);
        
        // แปลงวันที่เพื่อแสดงในฟอร์มแก้ไข
        const dateStart = data.date_start instanceof Date ? data.date_start : new Date(data.date_start);
        const dateStop = data.date_stop instanceof Date ? data.date_stop : new Date(data.date_stop);
        
        // กำหนดค่าให้กับฟอร์มแก้ไข โดยแปลงวันที่เป็นรูปแบบ YYYY-MM-DD สำหรับ input type="date"
        setValueEdit('date_start', dateStart.toISOString().split('T')[0]); // แปลงเป็น YYYY-MM-DD
        setValueEdit('date_stop', dateStop.toISOString().split('T')[0]); // แปลงเป็น YYYY-MM-DD
        setValueEdit('time_start', data.time_start);
        setValueEdit('time_stop', data.time_stop);
        setValueEdit('note', data.note || '');
        setOpenEditData(true);
    };

    // แก้ไข function สำหรับลบข้อมูล
    const confirmDelete = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/set-time/${delData.index}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setOpenDelData(false);
                fetchData();
                toast.success('ลบข้อมูลสำเร็จ');
            }
        } catch (error) {
            console.error('Error deleting set time:', error);
            toast.error('ลบข้อมูลไม่สำเร็จ');
        }
    };

    const handleDel = (index: number, date: string) => {
        setDelData({
            index: index,
            date: date
        });
        setOpenDelData(true);
    }

    const perPageSelectorHandler = (perPage: number) => {
    }

    const pageDirectHandler = (index: number) => {
    }

    return (
        <Layout>
            <div className='container'>
                <Toaster
                    position="bottom-right"
                    reverseOrder={false}
                />
                <h1 className='title lg text-font_color'>รายการตั้งเวลารักษาการแทนอธิการบดี</h1>
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
                            <button 
                                onClick={() => setShowDateFilter(!showDateFilter)} 
                                className='bg-gray-100 border hover:bg-gray-200 rounded-md flex items-center gap-2 px-4 text-gray-700 w-fit transition-all'
                            >
                                <span>กรองตามวันที่</span>
                                <IoIosArrowDown className={`transition-transform ${showDateFilter ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                        <div className='flex'>
                            <button onClick={() => setOpenInsertData(true)} className='bg-primary_1 whitespace-nowrap hover:bg-dark rounded-lg flex items-center gap-2 px-6  text-white w-fit transition-all'>
                                <span>เพิ่มรายการ</span>
                            </button>
                        </div>
                    </div>
                    
                    {/* ส่วนของตัวกรองวันที่ */}
                    {showDateFilter && (
                        <div className='flex gap-4 items-end bg-gray-50 p-4 rounded-lg'>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor="filter-date-start" className='text-sm text-gray-600'>ตั้งแต่วันที่</label>
                                <Input
                                    id="filter-date-start"
                                    type="date"
                                    value={filterDateStart}
                                    onChange={(e) => setFilterDateStart(e.target.value)}
                                    className='bg-white'
                                />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor="filter-date-end" className='text-sm text-gray-600'>ถึงวันที่</label>
                                <Input
                                    id="filter-date-end"
                                    type="date"
                                    value={filterDateEnd}
                                    min={filterDateStart}
                                    onChange={(e) => setFilterDateEnd(e.target.value)}
                                    className='bg-white'
                                />
                            </div>
                            <button 
                                onClick={clearDateFilter}
                                className='bg-gray-200 border hover:bg-gray-300 rounded-md px-4 py-2 text-gray-700 transition-all h-10'
                            >
                                ล้างตัวกรอง
                            </button>
                            {filterDateStart && filterDateEnd && (
                                <div className='text-sm text-gray-600 ml-2'>
                                    กำลังกรอง: {new Date(filterDateStart).toLocaleDateString('th-TH')} ถึง {new Date(filterDateEnd).toLocaleDateString('th-TH')}
                                </div>
                            )}
                        </div>
                    )}
                    <Table className='rounded-lg border'>
                        <TableHeader>
                            <TableRow className=''>
                                <TableHead className=' whitespace-nowrap'>#</TableHead>
                                <TableHead className=' whitespace-nowrap'>ตั้งแต่วันที่</TableHead>
                                <TableHead className=' whitespace-nowrap'>ถึงวันที่</TableHead>
                                <TableHead className=' whitespace-nowrap'>เวลาเริ่มต้น</TableHead>
                                <TableHead className=' whitespace-nowrap'>เวลาสิ้นสุด</TableHead>
                                <TableHead className=' whitespace-nowrap'>ตั้งโดย</TableHead>
                                <TableHead className=' whitespace-nowrap'>หมายเหตุ</TableHead>
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
                                    <TableCell>{new Date(item.date_start).toLocaleDateString('th-TH')}</TableCell>
                                    <TableCell>{new Date(item.date_stop).toLocaleDateString('th-TH')}</TableCell>
                                    <TableCell>{item.time_start}</TableCell>
                                    <TableCell>{item.time_stop}</TableCell>
                                    <TableCell>{item.user.name}</TableCell>
                                    <TableCell>{item.note}</TableCell>
                                    <TableCell className='flex gap-2 justify-end' >
                                        <MdEditSquare 
                                            className='text-yellow-500 cursor-pointer' 
                                            onClick={() => handleEdit(item)} 
                                            size={20} 
                                        />
                                        <MdDelete 
                                            className='text-red-600 cursor-pointer' 
                                            onClick={() => handleDel(item.id!, item.id.toString())} 
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
                                        เพิ่มรายการตั้งเวลารักษาการแทน
                                    </DialogTitle>
                                    <FaXmark className=' cursor-pointer text-gray-400 hover:text-gray-600' onClick={() => setOpenInsertData(false)} />
                                </div>
                                <form onSubmit={handleSubmitInsert(onSubmit)} className='flex flex-col gap-4'>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="date" className='text-sm text-font_color'>ตั้งแต่วันที่</label>
                                        <Input
                                            type="date"
                                            placeholder="ตั้งแต่วันที่"
                                            {...registerInsert('date_start', { required: 'โปรดกรอก ตั้งแต่วันที่' })}
                                        />
                                        {errorsInsert.date_start && (
                                            <span className="text-red-500 text-sm">{errorsInsert.date_start.message}</span>
                                        )}
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="date" className='text-sm text-font_color'>ถึงวันที่</label>
                                        <Input
                                            type="date"
                                            placeholder="ถึงวันที่"
                                            min={watchInsert('date_start') ? watchInsert('date_start').toString() : undefined}
                                            {...registerInsert('date_stop', { 
                                                required: 'โปรดกรอก ถึงวันที่',
                                                validate: value => {
                                                    const startDate = watchInsert('date_start');
                                                    if (!startDate) return true;
                                                    return new Date(value) >= new Date(startDate) || 'ถึงวันที่ต้องมากกว่าหรือเท่ากับตั้งแต่วันที่';
                                                }
                                            })}
                                        />
                                        {errorsInsert.date_stop && (
                                            <span className="text-red-500 text-sm">{errorsInsert.date_stop.message}</span>
                                        )}
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="time_start" className='text-sm text-font_color'>เวลาเริ่มต้น</label>
                                        <Input
                                            type="time"
                                            placeholder="เวลาเริ่มต้น"
                                            {...registerInsert('time_start', { required: 'โปรดกรอก เวลาเริ่มต้น' })}
                                        />
                                        {errorsInsert.time_start && (
                                            <span className="text-red-500 text-sm">{errorsInsert.time_start.message}</span>
                                        )}
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="time_stop" className='text-sm text-font_color'>เวลาสิ้นสุด</label>
                                        <Input
                                            type="time"
                                            placeholder="เวลาสิ้นสุด"
                                            {...registerInsert('time_stop', { required: 'โปรดกรอก เวลาสิ้นสุด' })}
                                        />
                                        {errorsInsert.time_stop && (
                                            <span className="text-red-500 text-sm">{errorsInsert.time_stop.message}</span>
                                        )}
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="note" className='text-sm text-font_color'>หมายเหตุ</label>
                                        <Input
                                            type="text"
                                            placeholder="หมายเหตุ"
                                            {...registerInsert('note')}
                                            />
                                            {errorsInsert.note && (
                                                <span className="text-red-500 text-sm">{errorsInsert.note.message}</span>
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
                                        แก้ไขรายการตั้งเวลารักษาการแทน
                                    </DialogTitle>
                                    <FaXmark className=' cursor-pointer text-gray-400 hover:text-gray-600' onClick={() => setOpenEditData(false)} />
                                </div>
                                <form onSubmit={handleSubmitEdit(onSubmitEdit)} className='flex flex-col gap-4'>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="date" className='text-sm text-font_color'>ตั้งแต่วันที่</label>
                                        <Input
                                            type="date"
                                            placeholder="ตั้งแต่วันที่"
                                            {...registerEdit('date_start', { required: 'โปรดกรอก วันที่' })}
                                        />
                                        {errorsEdit.date_start && (
                                            <span className="text-red-500 text-sm">{errorsEdit.date_start.message}</span>
                                        )}
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="date" className='text-sm text-font_color'>ถึงวันที่</label>
                                        <Input
                                            type="date"
                                            placeholder="ถึงวันที่"
                                            min={watchEdit('date_start') ? watchEdit('date_start').toString() : undefined}
                                            {...registerEdit('date_stop', { 
                                                required: 'โปรดกรอก ถึงวันที่',
                                                validate: value => {
                                                    const startDate = watchEdit('date_start');
                                                    if (!startDate) return true;
                                                    return new Date(value) >= new Date(startDate) || 'ถึงวันที่ต้องมากกว่าหรือเท่ากับตั้งแต่วันที่';
                                                }
                                            })}
                                        />
                                        {errorsEdit.date_stop && (
                                            <span className="text-red-500 text-sm">{errorsEdit.date_stop.message}</span>
                                        )}
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="time_start" className='text-sm text-font_color'>เวลาเริ่มต้น</label>
                                        <Input
                                            type="time"
                                            placeholder="เวลาเริ่มต้น"
                                            {...registerEdit('time_start', { required: 'โปรดกรอก เวลาเริ่มต้น' })}
                                        />
                                        {errorsEdit.time_start && (
                                            <span className="text-red-500 text-sm">{errorsEdit.time_start.message}</span>
                                        )}
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="time_stop" className='text-sm text-font_color'>เวลาสิ้นสุด</label>
                                        <Input
                                            type="time"
                                            placeholder="เวลาสิ้นสุด"
                                            {...registerEdit('time_stop', { required: 'โปรดกรอก เวลาสิ้นสุด' })}
                                        />
                                        {errorsEdit.time_stop && (
                                            <span className="text-red-500 text-sm">{errorsEdit.time_stop.message}</span>
                                        )}
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label htmlFor="note" className='text-sm text-font_color'>หมายเหตุ</label>
                                        <Input
                                            type="text"
                                            placeholder="หมายเหตุ"
                                            {...registerEdit('note')}
                                        />
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
                                        ลบรายการตั้งเวลารักษาการแทน
                                    </DialogTitle>
                                    <FaXmark className=' cursor-pointer text-gray-400 hover:text-gray-600' onClick={() => setOpenDelData(false)} />
                                </div>
                                <div className='flex flex-col gap-4'>
                                    <span className='text-font_color'>คุณต้องการลบรายการตั้งเวลารักษาการแทน ID: <b>{delData.date}</b> หรือไม่</span>
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

export default Settime;