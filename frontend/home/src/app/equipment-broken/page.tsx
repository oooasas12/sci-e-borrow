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
import toast, { Toaster } from 'react-hot-toast';
import DialogInsert from '@/components/dialog/DialogInsert';
import DialogEdit from '@/components/dialog/DialogEdit';
import FilterListBox from '@/components/ListBox/FilterListBox';
import DialogDel from '@/components/dialog/DialogDel';

type Inputs = {
    id: number,
    id_equipment: string,
    equipment_name: string,
    user_name: string,
    equipment_type: string,
    group: string,
    status_broken: string,
    date_start: string,
    date_end: string,
    detail: string,
}

const EquipmentBrokenPage: React.FC = () => {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<Inputs>()

    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState<Inputs[]>([
        { id: 1, id_equipment: 'equipment 1', equipment_name: 'name 1', group: 'group 1', equipment_type: 'type 1', status_broken: 'ส่งซ่อม', date_start: '2024-12-26', date_end: '2024-12-30', user_name: 'user 1', detail: 'detail 1' },
        { id: 2, id_equipment: 'equipment 2', equipment_name: 'name 2', group: 'group 2', equipment_type: 'type 2', status_broken: 'ส่งซ่อม', date_start: '2024-12-26', date_end: '2024-12-30', user_name: 'user 2', detail: 'detail 1' },
        { id: 3, id_equipment: 'equipment 3', equipment_name: 'name 3', group: 'group 3', equipment_type: 'type 3', status_broken: 'ส่งซ่อม', date_start: '2024-12-26', date_end: '2024-12-30', user_name: 'user 3', detail: 'detail 1' },
        { id: 4, id_equipment: 'equipment 4', equipment_name: 'name 4', group: 'group 4', equipment_type: 'type 4', status_broken: 'ส่งซ่อม', date_start: '2024-12-26', date_end: '2024-12-30', user_name: 'user 3', detail: 'detail 1' },
        { id: 5, id_equipment: 'equipment 5', equipment_name: 'name 5', group: 'group 5', equipment_type: 'type 5', status_broken: 'ส่งซ่อม', date_start: '2024-12-26', date_end: '2024-12-30', user_name: 'user 2', detail: 'detail 1' },
        { id: 6, id_equipment: 'equipment 6', equipment_name: 'name 6', group: 'group 6', equipment_type: 'type 6', status_broken: 'ส่งซ่อม', date_start: '2024-12-26', date_end: '2024-12-30', user_name: 'user 3', detail: 'detail 1' },
        { id: 7, id_equipment: 'equipment 7', equipment_name: 'name 7', group: 'group 7', equipment_type: 'type 7', status_broken: 'ส่งซ่อม', date_start: '2024-12-26', date_end: '2024-12-30', user_name: 'user 1', detail: 'detail 1' },
        { id: 8, id_equipment: 'equipment 8', equipment_name: 'name 8', group: 'group 8', equipment_type: 'type 8', status_broken: 'ส่งซ่อม', date_start: '2024-12-26', date_end: '2024-12-30', user_name: 'user 1', detail: 'detail 1' },
    ]);

    const [filteredData, setFilteredData] = useState<Inputs[]>(data);
    const [openInsertData, setOpenInsertData] = useState(false);
    const [openEditData, setOpenEditData] = useState(false);
    const [openDelData, setOpenDelData] = useState(false);
    const [selectGroup, setSelectGroup] = useState<string>();
    const [selectStatus, setSelectStatus] = useState<string>();
    const [selectedEquipment, setSelectedEquipment] = useState<string>();
    const [selectType, setSelectType] = useState<string>();
    const [selectedFilterGroup, setSelectedFilterGroup] = useState<string[]>([]);
    const [selectedFilterStatus, setSelectedFilterStatus] = useState<string[]>([]);
    const [selectedFilterType, setSelectedFilterType] = useState<string[]>([]);
    const [selectedGroup, setSelectedGroup] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [errorInput, setErrorInput] = useState({
        fac: false,
        group: false,
        branch: false
    });
    const [editData, setEditData] = useState<Inputs>();
    const [delData, setDelData] = useState({
        index: 0,
        name: ''
    });
    const [currentPage, setCurrentPage] = useState(1)
    const [perPage, setPerPage] = useState(10)

    const equipment = [
        { id: 1, name: 'Laptop' },
        { id: 2, name: 'Projector' },
        { id: 3, name: 'Microphone' },
    ];
    const status = [
        { id: 1, name: 'ส่งซ่อม' },
        { id: 2, name: 'ซ่อมแล้ว' },
        { id: 3, name: 'เสื่อมสภาพ' },
    ];
    const group = [
        { id: '1', name: 'test group 1' },
        { id: '2', name: 'test group 2' }
    ];
    const type = [
        { id: '1', name: 'type 1' },
        { id: '3', name: 'type 2' },
        { id: '2', name: 'type 3' }
    ]

    useEffect(() => {
        let results = data

        if (selectedFilterGroup.length != 0) {
            results = results.filter(item => selectedFilterGroup.includes(item.group.toLowerCase()))
        }
        if (selectedFilterStatus.length != 0) {
            results = results.filter(item => selectedFilterStatus.includes(item.status_broken.toLowerCase()))
        }
        if (selectedFilterType.length != 0) {
            results = results.filter(item => selectedFilterType.includes(item.equipment_type.toLowerCase()))
        }

        results = results.filter(item =>
            item.equipment_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.id_equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.user_name.toLowerCase().includes(searchTerm.toLowerCase())
        )

        setFilteredData(results);
    }, [searchTerm, selectedFilterGroup, selectedFilterType, selectedFilterStatus]);

    const filterGroup = (value: string) => {
        if (value === 'all') {
            setSelectedFilterGroup([]); // ถ้าเลือก 'ทั้งหมด' จะล้างการเลือกทั้งหมด
            return []; // ถ้าเลือก 'ทั้งหมด' จะล้างการเลือกทั้งหมด
        }
        if (selectedFilterGroup.includes(value)) {
            setSelectedFilterGroup(selectedFilterGroup.filter((item) => item !== value.toLowerCase()));
        } else {
            setSelectedFilterGroup([...selectedFilterGroup, value]);
        }
    }

    const filterStatus = (value: string) => {
        if (value === 'all') {
            setSelectedFilterStatus([]); // ถ้าเลือก 'ทั้งหมด' จะล้างการเลือกทั้งหมด
            return []; // ถ้าเลือก 'ทั้งหมด' จะล้างการเลือกทั้งหมด
        }
        if (selectedFilterStatus.includes(value)) {
            setSelectedFilterStatus(selectedFilterStatus.filter((item) => item !== value.toLowerCase()));
        } else {
            setSelectedFilterStatus([...selectedFilterStatus, value]);
        }
    }

    const filterType = (value: string) => {
        if (value === 'all') {
            setSelectedFilterType([]); // ถ้าเลือก 'ทั้งหมด' จะล้างการเลือกทั้งหมด
            return []; // ถ้าเลือก 'ทั้งหมด' จะล้างการเลือกทั้งหมด
        }
        if (selectedFilterType.includes(value)) {
            setSelectedFilterType(selectedFilterType.filter((item) => item !== value.toLowerCase()));
        } else {
            setSelectedFilterType([...selectedFilterType, value]);
        }
    }

    const onSubmit = (data: Inputs) => {
        if (!data.equipment_name) {
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
                loading: 'กำลังเพิ่มข้อมูล...',
                success: 'เพิ่มรายการครุภัณฑ์ชำรุดสำเร็จ',
                error: 'เพิ่มรายการครุภัณฑ์ชำรุดล้มเหลว',
            }
        );
        closeModalInsert()
    };

    const onSubmitEdit = (data: Inputs) => {
        if (!data.equipment_name) {
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
                success: 'แก้ไขรายการครุภัณฑ์ชำรุดสำเร็จ',
                error: 'แก้ไขรายการครุภัณฑ์ชำรุดล้มเหลว',
            }
        );
        closeModalEdit()
    }

    const perPageSelectorHandler = (perPage: number) => {
        setCurrentPage(1)
        setPerPage(perPage)
    }

    const pageDirectHandler = (index: number) => {
        setCurrentPage(index + 1)
    }

    const handleDel = (index: number, name: string) => {
        setDelData({
            index: index,
            name: name
        });
        setOpenDelData(true);
    }

    useEffect(() => {
        if (openInsertData) {
            setSelectedEquipment('')
        }
    }, [openInsertData]);

    const closeModalInsert = () => {
        setOpenInsertData(false)
    }

    const closeModalEdit = () => {
        setOpenEditData(false)
    }

    const handleSlectEquipment = (value: string) => {
        setSelectedEquipment(value)
        setValue('equipment_name', value)
    }

    const handleEdit = (data: Inputs) => {
        console.log("Edit data: ", data);
        setEditData(data);
        setOpenEditData(true);
        setSelectedEquipment(data.equipment_name as string)
    }

    const closeModalDel = () => {

        setOpenDelData(false);
    }

    const onDel = () => {
        console.log(delData.index);
        setFilteredData((prev) => prev.filter((item) => item.id !== delData.index))
        closeModalDel()
        toast.success('ลบสำเร็จ')
    }
    return (
        <Layout>
            <div className='container'>
                <Toaster
                    position="bottom-right"
                    reverseOrder={false}
                />
                <h1 className='title lg text-font_color'>รายการครุภัณฑ์ชำรุด</h1>
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
                            <FilterListBox placeholder='กลุ่มงาน' selected={selectedFilterGroup} item={group} filter={filterGroup} />
                            <FilterListBox placeholder='สถานะ' selected={selectedFilterStatus} item={status} filter={filterStatus} />
                            <FilterListBox placeholder='ประเภท' selected={selectedFilterType} item={type} filter={filterType} />
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
                                <TableHead className=' whitespace-nowrap'>รหัสครุภัณฑ์</TableHead>
                                <TableHead className=' whitespace-nowrap'>ชื่อครุภัณฑ์</TableHead>
                                <TableHead className=' whitespace-nowrap'>รายละเอียด</TableHead>
                                <TableHead className=' whitespace-nowrap'>ประเภทครุภัณฑ์</TableHead>
                                <TableHead className=' whitespace-nowrap'>สาขา</TableHead>
                                <TableHead className=' whitespace-nowrap'>สถานะครุภัณฑ์ชำรุดชำรุด</TableHead>
                                <TableHead className=' whitespace-nowrap'>ผู้ดำเนินการ</TableHead>
                                <TableHead className=' whitespace-nowrap'>วันที่เริ่มดำเนินการ</TableHead>
                                <TableHead className=' whitespace-nowrap'>วันที่สิ้นสุดการดำเนินการ</TableHead>
                                <TableHead className=' whitespace-nowrap'></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData?.slice(
                                currentPage * perPage - perPage,
                                currentPage * perPage
                            ).map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{item.id as number}</TableCell>
                                    <TableCell>{item.id_equipment}</TableCell>
                                    <TableCell>{item.equipment_name}</TableCell>
                                    <TableCell>{item.detail}</TableCell>
                                    <TableCell>{item.equipment_type}</TableCell>
                                    <TableCell>{item.group}</TableCell>
                                    <TableCell>{item.status_broken}</TableCell>
                                    <TableCell>{item.user_name}</TableCell>
                                    <TableCell>{item.date_start}</TableCell>
                                    <TableCell>{item.date_end}</TableCell>
                                    <TableCell className='flex gap-2' >
                                        <MdEditSquare className='text-yellow-500 cursor-pointer' onClick={() => handleEdit(item)} size={20} />
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
            <DialogInsert title='เพิ่มรายการครุภัณฑ์ชำรุด' onClose={closeModalInsert} open={openInsertData}>
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="equipment" className='text-sm text-font_color'>ครุภัณฑ์</label>
                        <ListBoxComponent placeholder='รายการครุภัณฑ์' selectedValue={selectedEquipment as string} options={equipment} onChange={handleSlectEquipment} />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="borrowing_date" className='text-sm text-font_color'>วันที่ชำรุด</label>
                        <Input type="date" id='borrowing_date' defaultValue={new Date().toISOString().split('T')[0]} className='w-full' {...register('date_start', { required: 'โปรดเลือกวันที่' })} />
                    </div>
                    <ButtonPrimary data='เพิ่มรายการ' type='submit' size='small' className='ml-auto' />
                </form>
            </DialogInsert>
            <DialogEdit title='แก้ไขรายการครุภัณฑ์ชำรุด' onClose={closeModalEdit} open={openEditData}>
                <form onSubmit={handleSubmit(onSubmitEdit)} className='flex flex-col gap-4'>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="equipment" className='text-sm text-font_color'>ครุภัณฑ์</label>
                        <ListBoxComponent placeholder='รายการครุภัณฑ์' selectedValue={selectedEquipment as string} options={equipment} onChange={handleSlectEquipment} />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="borrowing_date" className='text-sm text-font_color'>วันที่ชำรุด</label>
                        <Input type="date" id='borrowing_date' value={watch("date_start") || editData?.date_start as string} className='w-full' {...register('date_start', { required: 'โปรดเลือกวันที่' })} />
                    </div>
                    <ButtonPrimary data='ยืนยัน' type='submit' size='small' className='ml-auto' />
                </form>
            </DialogEdit>
            <DialogDel title='ลบรายการครุภัณฑ์ชำรุด' detail={
                <>
                    คุณต้องการลบรายกาครุภัณฑ์ชำรุด รหัสครุภัณฑ์: <b>{delData.name}</b> หรือไม่
                </>
            } 
            onClose={closeModalDel} open={openDelData} onDel={onDel} />
        </Layout>
    );
};

export default EquipmentBrokenPage;