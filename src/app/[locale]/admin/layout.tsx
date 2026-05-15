import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    page: "admin",
    path: "/admin",
    noIndex: true,
  });
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
