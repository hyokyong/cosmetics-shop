import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildPageMetadata({ locale, page: "products", path: "/products" });
}

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
