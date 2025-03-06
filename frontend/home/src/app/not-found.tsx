import Link from 'next/link'
import { FaHome } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center space-y-6">
        <h1 className="text-9xl font-bold text-gray-800">404</h1>
        <h2 className="text-3xl font-semibold text-gray-700">ไม่พบหน้าที่คุณต้องการ</h2>
        <p className="text-gray-600">ขออภัย เราไม่พบหน้าที่คุณกำลังค้นหา</p>
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaHome />
          กลับหน้าหลัก
        </Link>
      </div>
    </div>
  )
} 