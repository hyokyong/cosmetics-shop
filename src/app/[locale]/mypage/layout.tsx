import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    page: "mypage",
    path: "/mypage",
    noIndex: true,
  });
}

export default function MypageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
