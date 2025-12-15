"use client";

import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

// components
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { InputField } from "@/shared/components/InputField";
import { PasswordField } from "@/shared/components/PasswordField";

import { useLoginGoogle } from "@/hooks/useAuth";
import { notifyError, notifySuccess } from "@/components/Notify";
import { authService } from "@/services/authServices";

const profileFormSchema = z
  .object({
    name: z.string().nonempty("Name is required.").min(2, "Name too short"),
    email: z
      .string()
      .nonempty("Email is required.")
      .email("Invalid email address."),
    password: z
      .string()
      .nonempty("Password is required.")
      .min(6, "Min 6 chars"),
    repeatPassword: z.string().nonempty("Please confirm your password."),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords do not match",
    path: ["repeatPassword"],
  });

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const SignUpForm = () => {
  const router = useRouter();

  const { mutate: loginGoogle, isPending: isGooglePending } = useLoginGoogle();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      repeatPassword: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: ProfileFormValues) {
    try {
      const payload = {
        fullName: data.name,
        email: data.email,
        password: data.password,
      };

      await authService.register(payload);

      notifySuccess("Account created successfully! Please login.");
      router.push("/login");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Registration failed";
      notifyError(errorMessage);
    }
  }

  return (
    <div className="flex flex-col space-y-6 min-h-screen justify-center max-w-md mx-auto px-4">
      <Heading className="text-[#10069d] text-center text-3xl font-bold">
        Sign Up
      </Heading>

      <Button
        type="button"
        variant="outline"
        onClick={() => loginGoogle()}
        disabled={isGooglePending || isSubmitting}
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
            Sign up with Google
          </>
        )}
      </Button>

      {/* Separator */}
      <div className="flex justify-around items-center space-x-4">
        <div className="border-t w-full h-[1px] border-slate-200" />
        <Text className="text-slate-500 text-xs whitespace-nowrap">
          Or sign up with email
        </Text>
        <div className="border-t w-full h-[1px] border-slate-200" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <InputField
            control={form.control}
            name="name"
            label="Display Name"
            placeholder="e.g. John Doe"
            disabled={isSubmitting || isGooglePending}
          />

          <InputField
            control={form.control}
            name="email"
            label="Email"
            placeholder="name@example.com"
            disabled={isSubmitting || isGooglePending}
          />

          <PasswordField
            control={form.control}
            name="password"
            label="Password"
            placeholder="Create a password"
            disabled={isSubmitting || isGooglePending}
          />

          <PasswordField
            control={form.control}
            name="repeatPassword"
            label="Confirm Password"
            placeholder="Confirm your password"
            disabled={isSubmitting || isGooglePending}
          />

          <Button
            className="w-full bg-[#10069d] hover:bg-[#0d0585] text-white font-bold py-2 h-11 transition-all mt-6"
            type="submit"
            disabled={isSubmitting || isGooglePending}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating
                Account...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>

          {/* terms */}
          <Text className="text-center text-xs text-gray-500 leading-relaxed mt-4">
            By signing up, you agree to our's{" "}
            <Link
              href={"/terms"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#10069d] font-semibold hover:underline"
            >
              terms and conditions
            </Link>
          </Text>

          {/* switch to login */}
          <div className="text-center text-sm">
            <Text as="span" className="text-slate-600">
              Already have an account?{" "}
            </Text>
            <Link
              href={"/login"}
              className="text-[#10069d] font-bold hover:underline ml-1"
            >
              Login
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SignUpForm;
