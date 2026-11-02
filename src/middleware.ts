import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { searchParams, pathname } = request.nextUrl;

  if (pathname !== "/productos") {
    return NextResponse.next();
  }

  const categories = searchParams.getAll("category");
  const hasOtherParams = [...searchParams.keys()].some(
    (key) => key !== "category",
  );

  if (categories.length !== 1 || hasOtherParams) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/categorias/${encodeURIComponent(categories[0])}`;
  url.search = "";

  return NextResponse.redirect(url, 301);
}

export const config = {
  matcher: ["/productos"],
};
