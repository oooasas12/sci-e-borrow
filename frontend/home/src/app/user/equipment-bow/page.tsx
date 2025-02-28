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
import { FaCheck, FaCircleExclamation, FaXmark } from 'react-icons/fa6';
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
import { BorrowList, BorrowListDetail } from '@/types/borrowList';
import { Equipment } from '@/types/equipment';
import { useSelector } from 'react-redux';
import DialogInsertBorrow from '@/components/dialog/DialogInsertBorrow';
import DialogEditBorrow from '@/components/dialog/DialogEditBorrow';
import { persistStore } from 'redux-persist';
import { store } from '@/store/store';
import DialogShowBorrow from '@/components/dialog/DialogShowBorrow';

const EquipmentBow: React.FC = () => {
    const {
        register: registerInsert,
        handleSubmit: handleSubmitInsert,
        watch: watchInsert,
        setValue: setValueInsert,
        reset: resetInsert,
        formState: { errors: errorsInsert },
    } = useForm<BorrowList>()

    // สร้าง interface ใหม่สำหรับฟอร์มแก้ไขที่รองรับ string สำหรับวันที่
    interface EditBorrowListForm extends Omit<BorrowList, 'date_borrow' | 'date_return'> {
        date_borrow: string;
        date_return: string;
    }
    const {
        register: registerEdit,
        handleSubmit: handleSubmitEdit,
        watch: watchEdit,
        setValue: setValueEdit,
        reset: resetEdit,
        formState: { errors: errorsEdit },
    } = useForm<EditBorrowListForm>()

    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState<BorrowList[]>([]);
    const [filteredData, setFilteredData] = useState<BorrowList[]>([]);
    const [openInsertData, setOpenInsertData] = useState(false);
    const [openEditData, setOpenEditData] = useState(false);
    const [openDelData, setOpenDelData] = useState(false);
    const [selectGroup, setSelectGroup] = useState<string[]>([]);
    const [selectedEquipment, setSelectedEquipment] = useState('');
    const [filterEquipment, setFilterEquipment] = useState('');
    const [errorInput, setErrorInput] = useState({
        equipment_id: false
    });
    const [editData, setEditData] = useState<BorrowList>();
    const [delData, setDelData] = useState({
        index: 0,
        id_equipment: ''
    });
    const [currentPage, setCurrentPage] = useState(1)
    const [perPage, setPerPage] = useState(10)
    // เพิ่ม state สำหรับเก็บวันที่เริ่มต้นและวันที่สิ้นสุดที่ต้องการกรอง
    const [filterDateStart, setFilterDateStart] = useState<string>('');
    const [filterDateEnd, setFilterDateEnd] = useState<string>('');
    const [showDateFilter, setShowDateFilter] = useState<boolean>(false);
    const [equipmentBorrow, setEquipmentBorrow] = useState<Equipment[]>([]);
    const [selectedEquipmentBorrow, setSelectedEquipmentBorrow] = useState<Equipment[]>([]);
    const [searchEquipmentBorrow, setSearchEquipmentBorrow] = useState<string>('');
    const [equipmentBorrowFilter, setEquipmentBorrowFilter] = useState<Equipment[]>([]);
    const [selectedEquipmentBorrowEdit, setSelectedEquipmentBorrowEdit] = useState<BorrowListDetail[]>([]);
    const user = useSelector((state: any) => state.auth.user);
    const [openDetail, setOpenDetail] = useState(false);

    // เพิ่ม function สำหรับดึงข้อมูล
    const fetchData = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/borrow-list/user/${user.id}`);
            const result = await response.json();
            setData(result.data);
            setFilteredData(result.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchEquipment = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/equipment/find-data-free`);
            const result = await response.json();
            setEquipmentBorrow(result.data);
            setEquipmentBorrowFilter(result.data);
        } catch (error) {
            console.error('Error fetching equipment:', error);
        }
    }

    useEffect(() => {
        fetchData();
        fetchEquipment();
    }, []);

    useEffect(() => {
        if (searchEquipmentBorrow) {
            setEquipmentBorrowFilter(equipmentBorrow.filter((item) =>
                item.equipment_name.name.toLowerCase().includes(searchEquipmentBorrow.toLowerCase()) ||
                item.code.toLowerCase().includes(searchEquipmentBorrow.toLowerCase())
            ));
        } else {
            setEquipmentBorrowFilter(equipmentBorrow);
        }
    }, [searchEquipmentBorrow]);

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

    const onSubmit = async (data: BorrowList) => {
        console.log(data);
        if (selectedEquipmentBorrow.length === 0) {
            toast.error('โปรดเลือกอุปกรณ์');
            setErrorInput({
                equipment_id: true
            });
            return;
        }
        const formData = new FormData();
        const dateBorrow = data.date_borrow instanceof Date ? data.date_borrow : new Date(data.date_borrow);

        if (data.date_return) {
            const dateReturn = data.date_return instanceof Date ? data.date_return : new Date(data.date_return);
            formData.append('date_return', dateReturn.toISOString().split('T')[0]);
        }

        formData.append('date_borrow', dateBorrow.toISOString().split('T')[0]);
        formData.append('approval_status_borrow_id', '3');
        formData.append('approval_status_return_id', '3');
        formData.append('user_id', user.id.toString());
        selectedEquipmentBorrow.forEach(equipmentId => {
            formData.append('equipment_id[]', equipmentId.id.toString());
        });

        toast.promise(
            (async () => {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/borrow-list`, {
                        method: 'POST',
                        body: formData,
                    });

                    if (!response.ok) {
                        throw new Error('Failed to save settings');
                    }


                    fetchData();
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
        closeModalInsert();
    };

    const onSubmitEdit = async (data: EditBorrowListForm) => {

        const formData = new FormData();

        formData.append('date_borrow', data.date_borrow);
        formData.append('date_return', data.date_return);

        toast.promise(
            (async () => {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/borrow-list/${editData?.id}`, {
                        method: 'PATCH',
                        body: formData,
                    });

                    if (!response.ok) {
                        throw new Error('Failed to update borrow-list');
                    }

                    if (response.ok) {
                        if (selectedEquipmentBorrow.length > 0) {
                            const formDataDetail = new FormData();
                            if (!editData?.id) {
                                toast.error('ไม่พบข้อมูลรายการยืม-คืน');
                                return;
                            }

                            formDataDetail.append('borrow_list_id', editData?.id.toString() || '');
                            selectedEquipmentBorrow.forEach(equipmentId => {
                                formDataDetail.append('equipment_id[]', equipmentId.id.toString());
                            });
                            try {
                                const responseDetail = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/borrow-list-detail`, {
                                    method: 'POST',
                                    body: formDataDetail,
                                });

                                if (!response.ok) {
                                    throw new Error('Failed to update borrow-list-detail');
                                }

                            } catch (error) {
                                throw error;
                            }
                        }
                        fetchData();
                        resetEdit();
                    }
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

        closeModalEdit();
    }

    const fetchBorrowListDetail = async (id?: number) => {
        try {
            const idBorrow = id ? id : editData?.id;
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/borrow-list-detail/${idBorrow}`);
            if (!response.ok) {
                throw new Error('Failed to fetch borrow list detail');
            }
            const detailData = await response.json();
            setSelectedEquipmentBorrowEdit(detailData.data);
        } catch (error) {
            console.error('Error fetching borrow list detail:', error);
            toast.error('เกิดข้อผิดพลาดในการดึงข้อมูลรายละเอียดการยืม');
            return;
        }
    };

    const handleEdit = (data: BorrowList) => {
        const dateBorrow = data.date_borrow instanceof Date ? data.date_borrow : new Date(data.date_borrow);
        const dateReturn = data.date_return instanceof Date ? data.date_return : new Date(data.date_return);

        dateBorrow.setDate(dateBorrow.getDate() + 1);
        dateReturn.setDate(dateReturn.getDate() + 1);

        setEditData(data);
        setValueEdit('date_borrow', dateBorrow.toISOString().split('T')[0]);
        setValueEdit('date_return', data.date_return ? dateReturn.toISOString().split('T')[0] : '');

        fetchBorrowListDetail(data.id);
        setSelectedEquipmentBorrow([]);
        setOpenEditData(true);
    }

    const handleDel = (index: number, id_equipment: string) => {
        console.log("del index: ", index);
        setDelData({
            index: index,
            id_equipment: String(index)
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
            resetInsert()
        }
    }, [openInsertData]);

    //dialog curd
    const onDel = async () => {
        console.log(delData.index);
        toast.promise(
            (async () => {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/borrow-list/${delData.id_equipment}`, {
                        method: 'DELETE',
                    });

                    if (!response.ok) {
                        throw new Error('Failed to delete item');
                    }

                    setFilteredData((prev) => prev.filter((item) => item.id !== delData.index));
                    closeModalDel();
                } catch (error) {
                    throw error;
                }
            })(),
            {
                loading: 'กำลังลบข้อมูล...',
                success: 'ลบรายการยืม-คืนสำเร็จ',
                error: 'ลบรายการยืม-คืนล้มเหลว',
            }
        );
    }

    const closeModalEdit = () => {
        setOpenEditData(false)
    }

    const closeModalInsert = () => {
        setOpenInsertData(false)
    }

    const openModalInsert = () => {
        setOpenInsertData(true)
        setSelectedEquipmentBorrow([])
    }

    // ปรับปรุงฟังก์ชันการกรองข้อมูล
    useEffect(() => {
        let results = data;

        // กรองตามคำค้นหา
        if (searchTerm) {
            results = results.filter((item) =>
                (item.user.name && item.user.name.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // กรองตามช่วงวันที่
        if (filterDateStart && filterDateEnd) {
            const startDate = new Date(filterDateStart);
            const endDate = new Date(filterDateEnd);
            // ตั้งเวลาของ endDate เป็น 23:59:59 เพื่อให้รวมวันสุดท้ายด้วย
            endDate.setHours(23, 59, 59);

            results = results.filter((item) => {
                const itemStartDate = item.date_borrow instanceof Date
                    ? item.date_borrow
                    : new Date(item.date_borrow);

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

    const handleSelectEquipment = (value: Equipment) => {
        if (selectedEquipmentBorrow.map((item) => item.id).includes(value.id)) {
            setSelectedEquipmentBorrow(selectedEquipmentBorrow.filter((item) => item.id !== value.id));
        } else {
            setSelectedEquipmentBorrow([...selectedEquipmentBorrow, value]);
        }
    }

    const handleDelListEquipmentBorrowDetail = async (value: string[]) => {
        try {
            const formData = new FormData();
            value.forEach(item => formData.append('id[]', item));

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/borrow-list-detail`, {
                method: 'DELETE',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to delete equipment borrow details');
            }

            // อัปเดตข้อมูลที่แสดงผลหลังจากลบ
            fetchBorrowListDetail();
            fetchEquipment();

            toast.success('ลบข้อมูลสำเร็จ');
        } catch (error) {
            console.error('Error deleting equipment borrow details:', error);
            toast.error('เกิดข้อผิดพลาดในการลบข้อมูล');
        }
    }

    const handleShowDetail = (id: number) => {
        setOpenDetail(true);
        fetchBorrowListDetail(id);
    }

    const closeModalDetail = () => {
        setOpenDetail(false);
    }

    return (
        <Layout>
            <div className='container'>
                <Toaster
                    position="bottom-right"
                    reverseOrder={false}
                />
                <h1 className='title lg text-font_color'>ประวัติการยืม-คืน</h1>
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
                            <button
                                onClick={() => setShowDateFilter(!showDateFilter)}
                                className='bg-gray-100 border hover:bg-gray-200 rounded-md flex items-center gap-2 px-4 text-gray-700 w-fit transition-all'
                            >
                                <span>กรองตามวันที่ยืม</span>
                                <IoIosArrowDown className={`transition-transform ${showDateFilter ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                        <div className='flex'>
                            <button onClick={() => openModalInsert()} className='bg-primary_1 hover:bg-dark rounded-lg flex items-center gap-2 px-6  text-white w-fit transition-all'>
                                <span>แจ้งการยืม-คืน</span>
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
                                <TableHead className=' whitespace-nowrap'>วันที่ยืม</TableHead>
                                <TableHead className=' whitespace-nowrap'>วันที่คืน</TableHead>
                                <TableHead className=' whitespace-nowrap'>สถานะการยืม</TableHead>
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
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item.date_borrow ? new Date(item.date_borrow).toLocaleDateString('th-TH') : '-'}</TableCell>
                                    <TableCell>{item.date_return ? new Date(item.date_return).toLocaleDateString('th-TH') : '-'}</TableCell>
                                    <TableCell>{item.date_return ? item.approval_status_return.name : item.approval_status_borrow.name}</TableCell>
                                    <TableCell>Download</TableCell>
                                    <TableCell>Download</TableCell>
                                    <TableCell className='flex gap-2' >
                                        <FaCircleExclamation className='text-blue-500 cursor-pointer' size={20} onClick={() => handleShowDetail(item.id)} />
                                        {item.approval_status_borrow.id != 1 ?
                                            <MdEditSquare className={`text-yellow-500 cursor-pointer`} size={20} onClick={() => handleEdit(item)} />
                                            :
                                            <MdEditSquare className={`text-gray-500 cursor-not-allowed`} size={20} />
                                        }
                                        {item.approval_status_borrow.id != 1 ?
                                            <MdDelete className='text-red-600 cursor-pointer' onClick={() => handleDel(item.id, item.id.toString())} size={20} />
                                            :
                                            <MdDelete className='text-gray-500 cursor-not-allowed' size={20} />
                                        }
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
            <DialogInsertBorrow title='เพิ่มรายการยืม-คืน' onClose={closeModalInsert} open={openInsertData} tableData={selectedEquipmentBorrow} handleDelSelectData={handleSelectEquipment}>
                <form onSubmit={handleSubmitInsert(onSubmit)} className='flex flex-col gap-4 w-full md:w-[30%] lg:w-[40%]'>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="borrowing_date" className='text-sm text-font_color'>วันที่ยืม</label>
                        <Input type="date" id='borrowing_date' defaultValue={new Date().toISOString().split('T')[0]} className='w-full' {...registerInsert('date_borrow', { required: 'โปรดเลือกวันที่ยืม' })} />
                        {errorsInsert.date_borrow && (
                            <span className="text-red-500 text-sm">{errorsInsert.date_borrow.message}</span>
                        )}
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="return_date" className='text-sm text-font_color'>วันที่คืน</label>
                        <Input type="date" id='return_date' className='w-full' {...registerInsert('date_return')}
                            min={watchInsert('date_borrow') ? new Date(watchInsert('date_borrow')).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label className='text-sm text-font_color'>เลือกอุปกรณ์</label>
                        <Listbox>
                            {({ open }) => (
                                <div className={`relative ${open ? 'z-20' : 'z-10'} my-scroll`}>
                                    {/* Listbox Button */}
                                    <ListboxButton className="w-full px-2 h-9 py-1 flex items-center justify-between gap-3 rounded-md border border-gray-200 hover:bg-gray-100 text-center bg-white shadow-sm focus:outline-none">
                                        <span className="text-sm">เลือกอุปกรณ์</span>
                                        <IoIosArrowDown />
                                    </ListboxButton>

                                    {/* Listbox Options */}
                                    <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <div className='w-full p-1'>
                                            <Input
                                                type="text"
                                                id='search_equipment'
                                                placeholder="ค้นหาอุปกรณ์..."
                                                className='w-full'
                                                onChange={(e) => setSearchEquipmentBorrow(e.target.value)}
                                            />
                                        </div>
                                        {equipmentBorrowFilter.map((item, index) => (
                                            <ListboxOption
                                                key={index}
                                                value={item.id.toString()}
                                                className={({ active }) =>
                                                    `cursor-pointer flex justify-between items-center gap-2 select-none py-2 px-4 ${active ? 'bg-gray-100' : 'text-gray-900'
                                                    }`
                                                }
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    handleSelectEquipment(item);
                                                }}
                                            >
                                                <div className={`w-4 h-4 rounded-sm border border-gray-300 ${selectedEquipmentBorrow.map((item) => item.id).includes(item.id) ? 'bg-primary_1' : ''}`}>
                                                    <FaCheck className={`text-white ${selectedEquipmentBorrow.map((item) => item.id).includes(item.id) ? 'block' : 'hidden'}`} />
                                                </div>
                                                <div className='flex gap-1 mr-auto my-auto'>
                                                    <span className='text-gray-500'>{item.code}: </span>
                                                    <span>{item.equipment_name.name}</span>
                                                </div>
                                            </ListboxOption>
                                        ))}
                                    </ListboxOptions>

                                    {/* Error Message */}
                                    {errorInput.equipment_id && <span className="text-red-500 text-sm">**โปรดเลือกอุปกรณ์</span>}
                                </div>
                            )}
                        </Listbox>
                    </div>
                    <ButtonPrimary data='เพิ่มรายการ' type='submit' size='small' className='ml-auto' />
                </form>
            </DialogInsertBorrow>
            <DialogEditBorrow title='แก้ไขรายการยืม-คืน' onClose={closeModalEdit} open={openEditData} tableData={selectedEquipmentBorrowEdit} tableDataInsert={selectedEquipmentBorrow} handleDelSelectData={handleDelListEquipmentBorrowDetail} handleDelSelectDataInsert={handleSelectEquipment}>
                <form onSubmit={handleSubmitEdit(onSubmitEdit)} className='flex flex-col gap-4 w-full md:w-[30%] lg:w-[40%]'>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="borrowing_date" className='text-sm text-font_color'>วันที่ยืม</label>
                        <Input type="date" id='borrowing_date' value={watchEdit("date_borrow") as string || editData?.date_borrow as string} className='w-full' {...registerEdit('date_borrow', { required: 'โปรดเลือกวันที่ยืม' })} />
                        {errorsEdit.date_borrow && (
                            <span className="text-red-500 text-sm">{errorsEdit.date_borrow.message}</span>
                        )}
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="return_date" className='text-sm text-font_color'>วันที่คืน</label>
                        <Input type="date" id='return_date' value={watchEdit("date_return") as string || editData?.date_return as string} className='w-full' {...registerEdit('date_return')} />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label className='text-sm text-font_color'>เลือกอุปกรณ์</label>
                        <Listbox>
                            {({ open }) => (
                                <div className={`relative ${open ? 'z-20' : 'z-10'} my-scroll`}>
                                    {/* Listbox Button */}
                                    <ListboxButton className="w-full px-2 h-9 py-1 flex items-center justify-between gap-3 rounded-md border border-gray-200 hover:bg-gray-100 text-center bg-white shadow-sm focus:outline-none">
                                        <span className="text-sm">เลือกอุปกรณ์</span>
                                        <IoIosArrowDown />
                                    </ListboxButton>

                                    {/* Listbox Options */}
                                    <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <div className='w-full p-1'>
                                            <Input
                                                type="text"
                                                id='search_equipment'
                                                placeholder="ค้นหาอุปกรณ์..."
                                                className='w-full'
                                                onChange={(e) => setSearchEquipmentBorrow(e.target.value)}
                                            />
                                        </div>
                                        {equipmentBorrowFilter.map((item, index) => (
                                            <ListboxOption
                                                key={index}
                                                value={item.id.toString()}
                                                className={({ active }) =>
                                                    `cursor-pointer flex justify-between items-center gap-2 select-none py-2 px-4 ${active ? 'bg-gray-100' : 'text-gray-900'
                                                    }`
                                                }
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    handleSelectEquipment(item);
                                                }}
                                            >
                                                <div className={`w-4 h-4 rounded-sm border border-gray-300 ${selectedEquipmentBorrow.map((item) => item.id).includes(item.id) ? 'bg-primary_1' : ''}`}>
                                                    <FaCheck className={`text-white ${selectedEquipmentBorrow.map((item) => item.id).includes(item.id) ? 'block' : 'hidden'}`} />
                                                </div>
                                                <div className='flex gap-1 mr-auto my-auto'>
                                                    <span className='text-gray-500'>{item.code}: </span>
                                                    <span>{item.equipment_name.name}</span>
                                                </div>
                                            </ListboxOption>
                                        ))}
                                    </ListboxOptions>

                                    {/* Error Message */}
                                    {errorInput.equipment_id && <span className="text-red-500 text-sm">**โปรดเลือกอุปกรณ์</span>}
                                </div>
                            )}
                        </Listbox>
                    </div>
                    <ButtonPrimary data='ยืนยัน' type='submit' size='small' className='ml-auto' />
                </form>
            </DialogEditBorrow>
            <DialogDel title='ลบรายการยืม-คืน' detail={
                <>
                    คุณต้องการลบรายการยืม-คืน รหัสครุภัณฑ์: <b>{delData.id_equipment}</b> หรือไม่
                </>
            } onClose={closeModalDel} open={openDelData} idDel={delData.id_equipment} onDel={onDel} />
            <DialogShowBorrow title='รายละเอียดรายการยืม-คืน' onClose={closeModalDetail} open={openDetail} tableData={selectedEquipmentBorrowEdit.map((item: BorrowListDetail) => item.equipment)} />
        </Layout>
    );
};

export default EquipmentBow;