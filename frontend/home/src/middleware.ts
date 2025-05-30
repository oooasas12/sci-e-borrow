import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { handleLogout } from "./app/logout";
// ฟังก์ชันสำหรับตรวจสอบว่าเป็น path ที่ยกเว้นการยืนยันตัวตนหรือไม่
function isPublicPath(pathname: string): boolean {
  // เพิ่ม path ที่ไม่ต้องยืนยันตัวตน
  const publicPaths = [
    "/login",
    "/register",
    "/images", // อนุญาตให้เข้าถึงรูปภาพ
    "/_next", // อนุญาตให้เข้าถึงไฟล์ static ของ Next.js
    "/favicon.ico",
  ];
  return publicPaths.some((route) => pathname.startsWith(route));
}

// ฟังก์ชันสำหรับตรวจสอบความถูกต้องของ JWT token
async function verifyToken(token: string): Promise<boolean> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

// ฟังก์ชันสำหรับเพิ่ม Security Headers
function addSecurityHeaders(response: NextResponse): NextResponse {
  // ป้องกัน XSS attacks
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // ป้องกัน Clickjacking
  response.headers.set("X-Frame-Options", "DENY");

  // ป้องกัน MIME type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");

  // กำหนด Content Security Policy
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https:; " +
      "font-src 'self' data:; " +
      "connect-src 'self' http://localhost:* https://localhost:* http://127.0.0.1:* https://127.0.0.1:*;", // อนุญาตการเชื่อมต่อ API
  );

  // ป้องกัน CSRF attacks
  response.headers.set("X-CSRF-Protection", "1; mode=block");

  // กำหนด Referrer Policy
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // เพิ่ม HSTS
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains",
  );

  return response;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // สร้าง response เริ่มต้น
  let response = NextResponse.next();

  // เพิ่ม Security Headers สำหรับทุก request
  response = addSecurityHeaders(response);

  // ถ้าเป็น path ที่ไม่ต้องยืนยันตัวตน
  if (isPublicPath(pathname)) {
    return response;
  }

  // ตรวจสอบ token และ user data
  const token = request.cookies.get("auth_token")?.value;
  const sessionId = request.cookies.get("session_id")?.value;
  const userData = request.cookies.get("user_data")?.value;

  // ตรวจสอบว่ามีข้อมูลครบหรือไม่
  if (!token || !userData || !sessionId) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ตรวจสอบความถูกต้องของ token
  const isValidToken = await verifyToken(token);
  if (!isValidToken) {
    // ถ้า token ไม่ถูกต้อง ให้ลบ cookies และ redirect ไปหน้า login
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("auth_token");
    response.cookies.delete("user_data");
    response.cookies.delete("session_id");
    return response;
  }

  try {
    // ตรวจสอบความถูกต้องของ user data และ permission
    const parsedUserData = JSON.parse(userData);
    if (
      !parsedUserData.id ||
      !parsedUserData.username ||
      !parsedUserData.position_branch
    ) {
      throw new Error("Invalid user data");
    }

    // ตรวจสอบ permission ตาม path
    const branchId = parsedUserData.position_branch.id;
    const positionFacId = parsedUserData.position_fac.id;

    // เช็คการเข้าถึงหน้า admin
    if (pathname.startsWith("/admin")) {
      if (branchId !== 1 && branchId !== 2 && positionFacId !== 2 && positionFacId !== 3) {
        console.log("not admin");
        handleLogout();
        return NextResponse.redirect(new URL("/login?not_admin=true", request.url));
      }
    }

    // เช็คการเข้าถึงหน้า approval
    if (pathname.startsWith("/approval")) {
      if (branchId !== 2) {
        console.log("not approval");
        handleLogout();
        return NextResponse.redirect(new URL("/login?not_approval=true", request.url));
      }
    }

    // ถ้าไม่ใช่ทั้ง admin และ approval จะเข้าถึงได้เฉพาะหน้า user เท่านั้น
    if (pathname.startsWith("/user")) {
      if (branchId == 1 || branchId == 2 || positionFacId == 1 || positionFacId == 2 || positionFacId == 3) {
        handleLogout();
        return NextResponse.redirect(new URL("/login?not_user=true", request.url));
      }
    }
  } catch {
    // ถ้า user data ไม่ถูกต้อง ให้ redirect ไปหน้า login
    return NextResponse.redirect(new URL("/login?not_user=true", request.url));
  }

  return response;
}

// กำหนด path ที่ต้องการให้ middleware ทำงาน
export const config = {
  matcher: [
    // ไม่ตรวจสอบ path ที่เป็น static files และ images
    "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
  ],
};
