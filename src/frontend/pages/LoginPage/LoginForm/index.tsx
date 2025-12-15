"use client";

import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { Button } from "@/components/ui/button";
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { InputField } from "@/shared/components/InputField";
import { PasswordField } from "@/shared/components/PasswordField";
import Link from "next/link";
// IMPORT THÊM USELOGINGOOGLE
import { useLogin, useLoginGoogle } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

const profileFormSchema = z.object({
  email: z.string().email("Email không hợp lệ").nonempty("Email is required."),
  password: z.string().nonempty("Password is required."),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const LoginForm = () => {
  // 1. Hook Login thường
  const { mutate: login, isPending: isLoginPending } = useLogin();

  // 2. Hook Login Google
  const { mutate: loginGoogle, isPending: isGooglePending } = useLoginGoogle();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: ProfileFormValues) {
    login({
      email: data.email,
      password: data.password,
    });
  }

  return (
    <div className="flex flex-col space-y-6 min-h-screen justify-center max-w-md mx-auto px-4">
      <Heading className="text-[#10069d] text-center text-3xl font-bold">
        Login
      </Heading>

      {/* --- LOGIN BY GOOGLE BUTTON --- */}
      <Button
        type="button"
        variant="outline"
        onClick={() => loginGoogle()} // This triggers the mutation chain
        disabled={isGooglePending || isLoginPending}
        className="bg-white text-black space-y-2 w-full border-slate-200 shadow-sm relative h-11"
      >
        {isGooglePending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting Google...
          </>
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png"
              alt="Google"
              className="w-4 h-4 mr-2"
            />
            Login with Google
          </>
        )}
      </Button>

      {/* or continute with */}
      <div className="flex justify-around items-center space-x-4">
        <div className="border-t w-full h-[1px] border-slate-200" />
        <Text className="text-slate-500 text-xs whitespace-nowrap">
          Or continue with
        </Text>
        <div className="border-t w-full h-[1px] border-slate-200" />
      </div>

      {/* login form  */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <InputField
            control={form.control}
            name="email"
            label="Email"
            placeholder="Enter your email"
            // Disable input khi đang login google
            disabled={isLoginPending || isGooglePending}
          />

          <PasswordField
            control={form.control}
            name="password"
            label="Password"
            placeholder="Enter your password"
            disabled={isLoginPending || isGooglePending}
          />

          <div className="space-y-4">
            <div className="flex justify-end">
              <Link href="/forgot-password">
                <Text className="text-sm hover:underline cursor-pointer text-[#10069d] font-medium">
                  Forgot Your Password?
                </Text>
              </Link>
            </div>

            <Button
              className="w-full bg-[#10069d] hover:bg-[#0d0585] text-white font-bold py-2 h-11 transition-all"
              type="submit"
              disabled={isLoginPending || isGooglePending}
            >
              {isLoginPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging
                  in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </div>

          {/* ... phần footer giữ nguyên ... */}
          <Text className="text-center text-xs text-gray-500 leading-relaxed">
            By logging in, you agree to our's{" "}
            <Link
              href={"/terms"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#10069d] font-semibold hover:underline"
            >
              terms and conditions
            </Link>
          </Text>

          <div className="text-center text-sm">
            <Text as="span" className="text-slate-600">
              Don't have an account?{" "}
            </Text>
            <Link
              href={"/signup"}
              className="text-[#10069d] font-bold hover:underline ml-1"
            >
              Sign Up
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
