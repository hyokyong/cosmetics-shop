import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    page: "adminProducts",
    path: "/admin/products",
    noIndex: true,
  });
}

export default function AdminProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
