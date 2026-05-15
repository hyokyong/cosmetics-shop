import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    page: "wishlist",
    path: "/wishlist",
    noIndex: true,
  });
}

export default function WishlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
