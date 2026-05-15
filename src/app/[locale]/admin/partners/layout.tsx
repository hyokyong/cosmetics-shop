import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    page: "adminPartners",
    path: "/admin/partners",
    noIndex: true,
  });
}

export default function AdminPartnersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
