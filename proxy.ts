import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ADMIN_EMAIL = "admin@wakefieldpropertylettings.co.uk";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isLoginPage = pathname === "/admin/login";
  const isAdminRoute = pathname.startsWith("/admin");

  if (isLoginPage) {
    if (user?.email?.toLowerCase() === ADMIN_EMAIL) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return response;
  }

  if (isAdminRoute) {
    if (!user) {
      return NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
    }

    if (user.email?.toLowerCase() !== ADMIN_EMAIL) {
      await supabase.auth.signOut();

      return NextResponse.redirect(
        new URL("/admin/login?error=unauthorised", request.url)
      );
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};