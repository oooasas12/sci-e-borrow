import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// ฟังก์ชันสำหรับตรวจสอบว่าเป็น path ที่ยกเว้นการยืนยันตัวตนหรือไม่
function isPublicPath(pathname: string): boolean {
  // เพิ่ม path ที่ไม่ต้องยืนยันตัวตน
  const publicPaths = [
    '/login',
    '/register',
    '/images', // อนุญาตให้เข้าถึงรูปภาพ
    '/_next',  // อนุญาตให้เข้าถึงไฟล์ static ของ Next.js
    '/favicon.ico'
  ]
  return publicPaths.some(route => pathname.startsWith(route))
}

// ฟังก์ชันสำหรับตรวจสอบความถูกต้องของ JWT token
async function verifyToken(token: string): Promise<boolean> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY)
    await jwtVerify(token, secret)
    return true
  } catch {
    return false
  }
}

// ฟังก์ชันสำหรับเพิ่ม Security Headers
function addSecurityHeaders(response: NextResponse): NextResponse {
  // ป้องกัน XSS attacks
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // ป้องกัน Clickjacking
  response.headers.set('X-Frame-Options', 'DENY')
  
  // ป้องกัน MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff')
  
  // กำหนด Content Security Policy
  response.headers.set('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "font-src 'self' data:; " +
    "connect-src 'self' http://localhost:* https://localhost:* http://127.0.0.1:* https://127.0.0.1:*;" // อนุญาตการเชื่อมต่อ API
  )
  
  // ป้องกัน CSRF attacks
  response.headers.set('X-CSRF-Protection', '1; mode=block')
  
  // กำหนด Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // เพิ่ม HSTS
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  
  return response
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // สร้าง response เริ่มต้น
  let response = NextResponse.next()
  
  // เพิ่ม Security Headers สำหรับทุก request
  console.log('aaaaaaaaaaaaaa')
  response = addSecurityHeaders(response)
  console.log('bbbbbbbbbbbbbbbbbbb')
  
  // ถ้าเป็น path ที่ไม่ต้องยืนยันตัวตน
  if (isPublicPath(pathname)) {
    return response
  }

  // ตรวจสอบ token และ user data
  const token = request.cookies.get('auth_token')?.value
  const userData = request.cookies.get('user_data')?.value
  const sessionId = request.cookies.get('session_id')?.value

  console.log('ccccccccccccccccccc')
  // ตรวจสอบว่ามีข้อมูลครบหรือไม่
  if (!token || !userData || !sessionId) {
    
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }
  console.log('dddddddddddddddddddd')

  // ตรวจสอบความถูกต้องของ token
  const isValidToken = await verifyToken(token)
  if (!isValidToken) {
    console.log('gggggggggggggggggggg')
    // ถ้า token ไม่ถูกต้อง ให้ลบ cookies และ redirect ไปหน้า login
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('auth_token')
    response.cookies.delete('user_data')
    response.cookies.delete('session_id')
    return response
  }
  console.log('ffffffffffffffffffffff')

  try {
    // ตรวจสอบความถูกต้องของ user data
    const parsedUserData = JSON.parse(userData)
    if (!parsedUserData.id || !parsedUserData.username) {
      throw new Error('Invalid user data')
    }
  } catch {
    // ถ้า user data ไม่ถูกต้อง ให้ redirect ไปหน้า login
    return NextResponse.redirect(new URL('/login', request.url))
  }

  console.log('eeeeeeeeeeeeeeeeeeee')

  return response
}

// กำหนด path ที่ต้องการให้ middleware ทำงาน
export const config = {
  matcher: [
    // ไม่ตรวจสอบ path ที่เป็น static files และ images
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
}