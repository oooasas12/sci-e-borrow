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
import { FaArrowAltCircleDown, FaRegEdit } from 'react-icons/fa';
import { MdDelete, MdEditSquare } from "react-icons/md";
import PaginationList from '@/components/pagination/PaginationList';
import { IoIosArrowDown } from 'react-icons/io';
import toast, { Toaster } from 'react-hot-toast';
import ButtonSelectColor from '@/components/button/buttonSelectColor';
import DialogDel from '@/components/dialog/DialogDel';
import DialogEdit from '@/components/dialog/DialogEdit';
import DialogInsert from '@/components/dialog/DialogInsert';
import FilterListBox from '@/components/ListBox/FilterListBox';
import ListBoxComponent from '@/components/ListBox/ListBox';

type Inputs = {
    equipment_name: String,
    borrowing_date: String
}

const EquipmentBow: React.FC = () => {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<Inputs>()

    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState([
        { id: 1, id_equipment: '1-asws', equipment_name: 'Laptop', borrowing_date: '2023-01-01', return_date: '2023-01-04', location: 'test Location', group: 'test Group 1' },
        { id: 2, id_equipment: '2-asws', equipment_name: 'Laptop', borrowing_date: '2023-01-02', return_date: '2023-01-04', location: 'test Location', group: 'test Group 1' },
        { id: 3, id_equipment: '3-asws', equipment_name: 'test 3', borrowing_date: '2023-01-01', return_date: '2023-01-04', location: 'test Location', group: 'test Group 2' },
        { id: 4, id_equipment: '5-asws', equipment_name: 'test 4', borrowing_date: '2023-01-02', return_date: '2023-01-04', location: 'test Location', group: 'test Group 2' },
        { id: 5, id_equipment: '4-asws', equipment_name: 'test 5', borrowing_date: '2023-01-01', return_date: '2023-01-04', location: 'test Location', group: 'test Group 1' },
        { id: 6, id_equipment: '6-asws', equipment_name: 'test 6', borrowing_date: '2023-01-02', return_date: '2023-01-04', location: 'test Location', group: 'test Group 2' },
        { id: 7, id_equipment: '7-asws', equipment_name: 'test 7', borrowing_date: '2023-01-01', return_date: '2023-01-04', location: 'test Location', group: 'test Group 2' },
        { id: 8, id_equipment: '8-asws', equipment_name: 'test 8', borrowing_date: '2023-01-02', return_date: '2023-01-04', location: 'test Location', group: 'test Group 1' },
        // Add more data as needed
    ]);
    const [filteredData, setFilteredData] = useState(data);
    const [openInsertData, setOpenInsertData] = useState(false);
    const [openEditData, setOpenEditData] = useState(false);
    const [openDelData, setOpenDelData] = useState(false);
    const [selectGroup, setSelectGroup] = useState<string[]>([]);
    const [selectedEquipment, setSelectedEquipment] = useState('');
    const [filterEquipment, setFilterEquipment] = useState('');
    const [errorInput, setErrorInput] = useState(false);
    const [editData, setEditData] = useState<Inputs>();
    const [delData, setDelData] = useState({
        index: 0,
        id_equipment: ''
    });
    const [currentPage, setCurrentPage] = useState(1)
    const [perPage, setPerPage] = useState(10)

    const group = [
        { id: '1', name: 'test group 1' },
        { id: '2', name: 'test group 2' }
    ];

    const equipment = [
        { id: 1, name: 'Laptop' },
        { id: 2, name: 'Projector' },
        { id: 3, name: 'Microphone' },
    ];

    useEffect(() => {
        let results = data
        if (selectGroup.length != 0) {
            results = results.filter(item => selectGroup.includes(item.group.toLowerCase()))
        }
        results = results.filter(item =>
            item.equipment_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.id_equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.location.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredData(results);
    }, [searchTerm, selectGroup]);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const filterGroup = (value: string) => {
        if (value === 'all') {
            setSelectGroup([]); // ถ้าเลือก 'ทั้งหมด' จะล้างการเลือกทั้งหมด
            return []; // ถ้าเลือก 'ทั้งหมด' จะล้างการเลือกทั้งหมด
        }
        if (selectGroup.includes(value)) {
            setSelectGroup(selectGroup.filter((item) => item !== value.toLowerCase()));
        } else {
            setSelectGroup([...selectGroup, value]);
        }
    }

    const onSubmit = (data: Inputs) => {
        console.log(data);
        
        if (!data.equipment_name) {
            toast.error('โปรดเลือกครุภัณฑ์')
            return;
        }
        setErrorInput(false);
        toast.promise(
            (async () => {
                // ดึงข้อมูลจาก API จริง
                try {
                    // const response = await fetch('https://api.example.com/save-settings', {
                    //     method: 'POST',
                    //     headers: {
                    //         'Content-Type': 'application/json',
                    //     },
                    //     body: JSON.stringify(settings),
                    // });

                    // if (!response.ok) {
                    //     throw new Error('Failed to save settings');
                    // }

                    // const data = await response.json();
                    const data = {
                        id: '1',
                        test_name: 'donut'
                    }
                    return false;
                } catch (error) {
                    throw error;
                }
            })(),
            {
                loading: 'กำลังเพิ่มข้อมูล...',
                success: 'เพิ่มรายการยืม-คืนสำเร็จ',
                error: 'เพิ่มรายการยืม-คืนล้มเหลว',
            }
        );
        closeModalInsert()
    };

    const onSubmitEdit = (data: Inputs) => {
        if (!data.equipment_name && !selectedEquipment) {
            toast.error('โปรดเลือกครุภัณฑ์')
            return;
        }
        toast.promise(
            (async () => {
                // ดึงข้อมูลจาก API จริง
                try {
                    // const response = await fetch('https://api.example.com/save-settings', {
                    //     method: 'POST',
                    //     headers: {
                    //         'Content-Type': 'application/json',
                    //     },
                    //     body: JSON.stringify(settings),
                    // });

                    // if (!response.ok) {
                    //     throw new Error('Failed to save settings');
                    // }

                    // const data = await response.json();
                    const data = {
                        id: '1',
                        test_name: 'donut'
                    }
                    return false;
                } catch (error) {
                    throw error;
                }
            })(),
            {
                loading: 'กำลังแก้ไขข้อมูล...',
                success: 'แก้ไขรายการยืม-คืนสำเร็จ',
                error: 'แก้ไขรายการยืม-คืนล้มเหลว',
            }
        );
        closeModalEdit()
    }

    const handleEdit = (data: any) => {
        console.log("Edit data: ", data);
        setEditData(data);
        setValue('equipment_name', data.equipment_name)
        setValue('borrowing_date', data.borrowing_date);
        setOpenEditData(true);
        setSelectedEquipment(data.equipment_name)
    }

    const handleDel = (index: number, id_equipment: string) => {
        console.log("del index: ", index);
        setDelData({
            index: index,
            id_equipment: id_equipment
        });
        setOpenDelData(true);
    }

    const closeModalDel = () => {
        setOpenDelData(false);
    }

    const perPageSelectorHandler = (perPage: number) => {
        setCurrentPage(1)
        setPerPage(perPage)
    }

    const pageDirectHandler = (index: number) => {
        setCurrentPage(index + 1)
    }

    useEffect(() => {
        if (openInsertData) {
            setSelectedEquipment('')
            reset()
        }
    }, [openInsertData]);

    //dialog curd
    const onDel = () => {
        console.log(delData.index);
        setFilteredData((prev) => prev.filter((item) => item.id !== delData.index))
        closeModalDel()
        toast.success('ลบสำเร็จ')
    }

    const closeModalEdit = () => {
        setOpenEditData(false)
    }

    const closeModalInsert = () => {
        setOpenInsertData(false)
    }

    const handleSelectEquipment = (value: string) => {
        setSelectedEquipment(value);
        setValue('equipment_name', value); // Update useForm state
    }

    return (
        <Layout>
            <div className='container'>
                <Toaster
                    position="bottom-right"
                    reverseOrder={false}
                />
                <h1 className='title lg text-font_color'>รายงานการยืม-คืน</h1>
                <div className='flex flex-col gap-4 mt-8'>
                    <div className='flex justify-between'>
                        <div className='flex gap-2'>
                            <Input
                                type="text"
                                placeholder="ค้นหา..."
                                className='w-[300px] bg-white'
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                            <FilterListBox placeholder='กลุ่มงาน' selected={selectGroup} item={group} filter={filterGroup} />
                        </div>
                        <div className='flex'>
                            <button onClick={() => setOpenInsertData(true)} className='bg-primary_1 hover:bg-dark rounded-lg flex items-center gap-2 px-6  text-white w-fit transition-all'>
                                <span>เพิ่มรายการ</span>
                            </button>
                        </div>
                    </div>
                    <Table className='rounded-lg border'>
                        <TableHeader>
                            <TableRow className=''>
                                <TableHead className=' whitespace-nowrap'>#</TableHead>
                                <TableHead className=' whitespace-nowrap'>รหัสครุภัณฑ์</TableHead>
                                <TableHead className=' whitespace-nowrap'>ชื่ออุปกรณ์</TableHead>
                                <TableHead className=' whitespace-nowrap'>กลุ่มครุภัณฑ์</TableHead>
                                <TableHead className=' whitespace-nowrap'>วันที่ยืม</TableHead>
                                <TableHead className=' whitespace-nowrap'>วันที่คืน</TableHead>
                                <TableHead className=' whitespace-nowrap'>สถานที่ตั้ง/จัดเก็บ</TableHead>
                                <TableHead className=' whitespace-nowrap'>เอกสารการยืม</TableHead>
                                <TableHead className=' whitespace-nowrap'>เอกสารการคืน</TableHead>
                                <TableHead className=' whitespace-nowrap'></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData?.slice(
                                currentPage * perPage - perPage,
                                currentPage * perPage
                            ).map((item, index) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.id}</TableCell>
                                    <TableCell>{item.id_equipment}</TableCell>
                                    <TableCell>{item.equipment_name}</TableCell>
                                    <TableCell>{item.group}</TableCell>
                                    <TableCell>{item.borrowing_date}</TableCell>
                                    <TableCell>{item.return_date}</TableCell>
                                    <TableCell>{item.location}</TableCell>
                                    <TableCell>Download</TableCell>
                                    <TableCell>Download</TableCell>
                                    <TableCell className='flex gap-2' >
                                        <MdEditSquare className='text-yellow-500 cursor-pointer' size={20} onClick={() => handleEdit(item)} />
                                        <MdDelete className='text-red-600 cursor-pointer' onClick={() => handleDel(item.id, item.id_equipment)} size={20} />
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
            <DialogInsert title='เพิ่มรายการยืม-คืน' onClose={closeModalInsert} open={openInsertData}>
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="equipment" className='text-sm text-font_color'>ครุภัณฑ์</label>
                        <ListBoxComponent placeholder='เลือกครุภัณฑ์' options={equipment} onChange={handleSelectEquipment} selectedValue={selectedEquipment} />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="borrowing_date" className='text-sm text-font_color'>วันที่ยืม</label>
                        <Input type="date" id='borrowing_date' defaultValue={new Date().toISOString().split('T')[0]} className='w-full' {...register('borrowing_date', { required: 'โปรดเลือกวันที่ยืม' })} />
                        {errors.borrowing_date && (
                            <span className="text-red-500 text-sm">{errors.borrowing_date.message}</span>
                        )}
                    </div>
                    <ButtonPrimary data='เพิ่มรายการ' type='submit' size='small' className='ml-auto' />
                </form>
            </DialogInsert>
            <DialogEdit title='แก้ไขรายการยืม-คืน' onClose={closeModalEdit} open={openEditData}>
                <form onSubmit={handleSubmit(onSubmitEdit)} className='flex flex-col gap-4'>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="equipment" className='text-sm text-font_color'>ครุภัณฑ์</label>
                        <ListBoxComponent placeholder='เลือกครุภัณฑ์' options={equipment} onChange={handleSelectEquipment} selectedValue={selectedEquipment} />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="borrowing_date" className='text-sm text-font_color'>วันที่ยืม</label>
                        <Input type="date" id='borrowing_date' value={watch("borrowing_date") as string || editData?.borrowing_date as string} className='w-full' {...register('borrowing_date', { required: 'โปรดเลือกวันที่ยืม' })} />
                        {errors.borrowing_date && (
                            <span className="text-red-500 text-sm">{errors.borrowing_date.message}</span>
                        )}
                    </div>
                    <ButtonPrimary data='ยืนยัน' type='submit' size='small' className='ml-auto' />
                </form>
            </DialogEdit>
            <DialogDel title='ลบรายการยืม-คืน' detail={
                <>
                    คุณต้องการลบรายการยืม-คืน รหัสครุภัณฑ์: <b>{delData.id_equipment}</b> หรือไม่
                </>
            } onClose={closeModalDel} open={openDelData} idDel={delData.id_equipment} onDel={onDel} />
        </Layout>
    );
};

export default EquipmentBow;