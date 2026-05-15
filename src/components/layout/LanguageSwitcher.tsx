"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { type Locale } from "@/i18n/routing";
import { cn } from "@utils/cn";
import { Globe } from "lucide-react";

const LOCALES: { code: Locale; short: string }[] = [
  { code: "ko", short: "KO" },
  { code: "en", short: "EN" },
  { code: "ar", short: "AR" },
];

export default function LanguageSwitcher() {
  const t = useTranslations("language");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const onChange = (next: Locale) => {
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  };

  return (
    <div
      className="flex shrink-0 items-center gap-1"
      role="group"
      aria-label={t("label")}
    >
      <Globe className="hidden h-4 w-4 shrink-0 text-gray-500 sm:block" aria-hidden />
      <div className="flex flex-wrap items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50/80 p-0.5">
        {LOCALES.map(({ code, short }) => (
          <button
            key={code}
            type="button"
            onClick={() => onChange(code)}
            className={cn(
              "min-w-[2.25rem] rounded-md px-2 py-1 text-xs font-medium transition-colors sm:min-w-0 sm:px-2.5",
              "whitespace-nowrap",
              locale === code
                ? "bg-white text-primary-600 shadow-sm"
                : "text-gray-600 hover:text-primary-600",
            )}
            aria-pressed={locale === code}
            aria-label={t(code)}
            title={t(code)}
          >
            <span className="sm:hidden">{short}</span>
            <span className="hidden sm:inline">{t(code)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
