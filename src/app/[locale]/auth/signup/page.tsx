"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "@/i18n/navigation";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { useSignup, useEmailCheck } from "@/react-query/queries/useAuth";
import { toast } from "@hooks/useToast";
import { CheckCircle2, XCircle } from "lucide-react";

const schema = z
  .object({
    email: z.string().email("올바른 이메일 형식이 아닙니다"),
    password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다"),
    passwordConfirm: z.string(),
  })
  .refine((d) => d.password === d.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["passwordConfirm"],
  });
type FormData = z.infer<typeof schema>;

export default function SignupPage() {
  const router = useRouter();
  const { mutate: signup, isPending: isSigningUp } = useSignup();
  const { mutate: checkEmail, isPending: isChecking } = useEmailCheck();
  const [emailStatus, setEmailStatus] = useState<"idle" | "ok" | "duplicate">(
    "idle",
  );

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const handleEmailCheck = () => {
    const email = getValues("email");
    if (!email) return;
    checkEmail(email, {
      onSuccess: (data) => {
        setEmailStatus(data.isDuplicate ? "duplicate" : "ok");
      },
      onError: () => {
        // 백엔드 없을 때는 ok로 처리
        setEmailStatus("ok");
      },
    });
  };

  const onSubmit = (data: FormData) => {
    signup(
      { email: data.email, password: data.password },
      {
        onSuccess: () => {
          toast({ title: "회원가입 완료!", description: "로그인해주세요" });
          router.push("/auth/login");
        },
        onError: () => {
          toast({
            title: "회원가입 실패",
            description: "다시 시도해주세요",
            variant: "destructive",
          });
        },
      },
    );
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/">
            <span className="text-2xl font-bold text-rose-600">GLOW</span>
            <span className="text-2xl font-light text-gray-700">shop</span>
          </Link>
          <h1 className="mt-4 text-xl font-bold text-gray-900">회원가입</h1>
          <p className="mt-1 text-sm text-gray-500">새 계정을 만들어보세요</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          {/* 이메일 + 중복체크 */}
          <div className="space-y-1.5">
            <Label htmlFor="email">이메일</Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                autoComplete="email"
                {...register("email")}
                onChange={() => setEmailStatus("idle")}
                className={errors.email ? "border-red-400" : ""}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleEmailCheck}
                disabled={isChecking}
                className="shrink-0"
              >
                {isChecking ? "확인중" : "중복확인"}
              </Button>
            </div>
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
            {emailStatus === "ok" && (
              <p className="flex items-center gap-1 text-xs text-green-600">
                <CheckCircle2 className="h-3 w-3" /> 사용 가능한 이메일입니다
              </p>
            )}
            {emailStatus === "duplicate" && (
              <p className="flex items-center gap-1 text-xs text-red-500">
                <XCircle className="h-3 w-3" /> 이미 사용 중인 이메일입니다
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              placeholder="8자 이상 입력해주세요"
              autoComplete="new-password"
              {...register("password")}
              className={errors.password ? "border-red-400" : ""}
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="passwordConfirm">비밀번호 확인</Label>
            <Input
              id="passwordConfirm"
              type="password"
              placeholder="비밀번호를 다시 입력해주세요"
              autoComplete="new-password"
              {...register("passwordConfirm")}
              className={errors.passwordConfirm ? "border-red-400" : ""}
            />
            {errors.passwordConfirm && (
              <p className="text-xs text-red-500">
                {errors.passwordConfirm.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-rose-600 hover:bg-rose-700"
            disabled={isSigningUp || emailStatus === "duplicate"}
          >
            {isSigningUp ? "가입 중..." : "회원가입"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          이미 계정이 있으신가요?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-rose-600 hover:underline"
          >
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
