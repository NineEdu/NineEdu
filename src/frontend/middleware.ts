import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export const config = {
  matcher: ["/admin/:path*", "/login", "/register"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // Lấy thêm cookie 'user' để fallback
  const userCookie = request.cookies.get("user")?.value;

  const authPaths = ["/login", "/register"];
  const isAuthPath = authPaths.includes(pathname);
  const isAdminPath = pathname.startsWith("/admin");

  if (token) {
    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || "secret"
      );
      const { payload } = await jwtVerify(token, secret);

      // --- ĐOẠN SỬA ---
      // 1. Thử lấy role từ Token
      let userRole = payload.role as string;

      // 2. Nếu Token không có role, thử lấy từ cookie 'user'
      if (!userRole && userCookie) {
        try {
          // Cookie user thường bị encode URL (%7B...), cần decode
          const parsedUser = JSON.parse(decodeURIComponent(userCookie));
          userRole = parsedUser.role; // Lấy role: "admin"
          console.log("👉 Lấy role từ cookie user:", userRole);
        } catch (e) {
          console.log("Lỗi parse cookie user");
        }
      }
      // ----------------

      if (isAuthPath) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      if (isAdminPath && userRole !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }

      return NextResponse.next();
    } catch (error) {
      if (isAdminPath) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
      return NextResponse.next();
    }
  }

  if (isAdminPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
