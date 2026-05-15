import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    page: "cart",
    path: "/cart",
    noIndex: true,
  });
}

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
