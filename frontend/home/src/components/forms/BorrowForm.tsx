import React from 'react';
import { BorrowListDetail } from '@/types/borrowList';
interface BorrowFormProps {
  data: BorrowListDetail;
}

const BorrowForm: React.FC<BorrowFormProps> = ({ data }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-start">
          <img src="/images/logo-sru.png" alt="Logo" className="h-32" />
          <div className="ml-4 flex flex-col gap-2">
            <h2 className="text-xl font-semibold">คำร้องขอยืมรายการครุภัณฑ์</h2>
            <h3 className="text-xl font-semibold">คณะวิทยาศาสตร์และเทคโนโลยี มหาวิทยาลัยราชภัฏสุราษฎร์ธานี</h3>
          </div>
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

      <div className="mb-4">
        <p>รายการยืมครุภัณฑ์ที่ {data.id} รายการ</p>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">ลำดับ</th>
            <th className="border border-gray-300 p-2">เลขที่ครุภัณฑ์</th>
            <th className="border border-gray-300 p-2">รายการ</th>
            <th className="border border-gray-300 p-2">วันที่ใช้งาน</th>
            <th className="border border-gray-300 p-2">วันที่ส่งคืน</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(12)].map((_, index) => (
            <tr key={index}>
              <td className="border border-gray-300 p-2">{index + 1}</td>
              <td className="border border-gray-300 p-2"></td>
              <td className="border border-gray-300 p-2"></td>
              <td className="border border-gray-300 p-2"></td>
              <td className="border border-gray-300 p-2"></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between mt-16">
        <div className="text-center">
          <p>ลงชื่อ...........................................................ผู้ยืม</p>
          <p className="mt-1">(......................................................)</p>
        </div>
        <div className="text-center">
          <p>ลงชื่อ...........................................................ผู้อนุมัติ</p>
          <p className="mt-1">(......................................................)</p>
        </div>
      </div>
    </div>
  );
};

export default BorrowForm; 