import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildPageMetadata({ locale, page: "signup", path: "/auth/signup" });
}

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
