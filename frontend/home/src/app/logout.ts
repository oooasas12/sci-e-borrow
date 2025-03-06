import { useDispatch } from 'react-redux';
import { logout } from '@/store/features/authSlice';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export const handleLogout = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  // ลบข้อมูลใน Redux store
  dispatch(logout());

  // ลบ cookies ทั้งหมด
  Cookies.remove('auth_token');
  Cookies.remove('user_data');
  Cookies.remove('session_id');

  // redirect ไปหน้า login
  router.push('/login');
}; 