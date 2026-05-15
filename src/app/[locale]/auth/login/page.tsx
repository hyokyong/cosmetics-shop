"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { useLogin } from "@/react-query/queries/useAuth";
import { toast } from "@hooks/useToast";

const schema = z.object({
  email: z.string().email("올바른 이메일 형식이 아닙니다"),
  password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다"),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const t = useTranslations("auth");
  const tGnb = useTranslations("gnb");
  const router = useRouter();
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    login(data, {
      onSuccess: () => {
        toast({ title: t("loginSuccess") });
        router.push("/");
      },
      onError: () => {
        toast({
          title: t("loginFail"),
          description: t("loginFailDesc"),
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/">
            <span className="text-2xl font-bold text-rose-600">GLOW</span>
            <span className="text-2xl font-light text-gray-700">shop</span>
          </Link>
          <h1 className="mt-4 text-xl font-bold text-gray-900">{t("loginTitle")}</h1>
          <p className="mt-1 text-sm text-gray-500">{t("loginSubtitle")}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              autoComplete="email"
              {...register("email")}
              className={errors.email ? "border-red-400" : ""}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">{t("password")}</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              {...register("password")}
              className={errors.password ? "border-red-400" : ""}
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full whitespace-normal bg-rose-600 hover:bg-rose-700"
            disabled={isPending}
          >
            {isPending ? t("loginPending") : t("loginSubmit")}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          {t("noAccount")}{" "}
          <Link href="/auth/signup" className="font-medium text-rose-600 hover:underline">
            {tGnb("signup")}
          </Link>
        </p>
      </div>
    </div>
  );
}
