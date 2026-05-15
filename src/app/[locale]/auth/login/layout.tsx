import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildPageMetadata({ locale, page: "login", path: "/auth/login" });
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
