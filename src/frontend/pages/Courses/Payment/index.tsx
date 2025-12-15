"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Loader2,
  ChevronLeft,
  Lock,
  Check,
  ShieldCheck,
  Ticket,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { notifyError, notifySuccess } from "@/components/Notify";

import { useCurrentUser } from "@/hooks/useAuth";
import useGetCourseById from "@/hooks/courses/useGetCourseById";
import usePaymentCourse from "@/hooks/payments/usePaymentCourse";
import formatCurrency from "@/utils/formatCurrency";

export default function CoursePaymentPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.courseId as string;
  const { data: user } = useCurrentUser();

  // state
  const [paymentMethod, setPaymentMethod] = useState("vnpay");
  const [couponCode, setCouponCode] = useState("");

  // fetch course data
  const queryParams = useMemo(() => ({ courseId }), [courseId]);
  const { data: course, isLoading: isCourseLoading } = useGetCourseById({
    queryKey: ["getCoursePayment", courseId],
    queryParams: queryParams,
  });

  // payment hook
  const { paymentCourse, isPending: isPaying } = usePaymentCourse({
    onSuccess: (data: any) => {
      if (data?.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        notifySuccess("Payment processed (Demo Free)");
      }
    },
    onError: (error: any) => {
      notifyError(error?.response?.data?.message || "Payment creation failed");
    },
  });

  // handlers
  const handlePayment = async () => {
    if (!user) {
      notifyError("Please login to proceed");
      return;
    }

    if (paymentMethod !== "vnpay") {
      notifySuccess("This gateway is under maintenance. Please choose VNPAY.");
      return;
    }

    await paymentCourse({
      courseId,
      amount: course.price,
    });
  };

  const handleBack = () => router.back();

  if (isCourseLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-slate-900" />
      </div>
    );
  }

  if (!course) return <div className="p-10 text-center">Course not found</div>;

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col lg:flex-row">
      {/* left column form */}
      <div className="flex-1 lg:w-[60%] xl:w-[65%] flex flex-col border-r border-slate-100">
        <main className="flex-1 px-6 lg:px-12 py-8 max-w-3xl mx-auto w-full">
          {/* back button */}
          <button
            onClick={handleBack}
            className="hidden lg:flex items-center text-sm text-slate-500 hover:text-slate-900 mb-8 transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to course
          </button>

          <div className="space-y-10">
            {/* account info */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                Billing Information
              </h2>
              {user ? (
                <div className="flex items-center gap-4 p-4 border rounded-lg bg-slate-50/50">
                  <Avatar className="h-12 w-12 border border-white">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.fullName?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">
                      {user.fullName}
                    </p>
                    <p className="text-sm text-slate-500">{user.email}</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 border border-dashed rounded-lg text-center bg-slate-50">
                  <p className="text-slate-600 mb-2">You are not logged in</p>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/login")}
                  >
                    Login now
                  </Button>
                </div>
              )}
            </section>

            {/* payment methods */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                Payment Method
              </h2>
              <div className="grid gap-4">
                {/* vnpay */}
                <div
                  onClick={() => setPaymentMethod("vnpay")}
                  className={`cursor-pointer border rounded-lg p-5 flex items-center justify-between transition-all ${
                    paymentMethod === "vnpay"
                      ? "border-blue-600 bg-blue-50/30"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-14 border rounded bg-white flex items-center justify-center shrink-0">
                      <img
                        src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-VNPAY-QR.png"
                        alt=""
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">
                        VNPAY Wallet / Bank
                      </p>
                      <p className="text-xs text-slate-500">
                        QR Code, ATM Card, Visa/Master
                      </p>
                    </div>
                  </div>
                  <div
                    className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                      paymentMethod === "vnpay"
                        ? "border-blue-600 bg-blue-600"
                        : "border-slate-300"
                    }`}
                  >
                    {paymentMethod === "vnpay" && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                </div>

                {/* momo */}
                <div
                  onClick={() => setPaymentMethod("momo")}
                  className={`cursor-pointer border rounded-lg p-5 flex items-center justify-between transition-all ${
                    paymentMethod === "momo"
                      ? "border-pink-600 bg-pink-50/30"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-14 border rounded bg-[#A50064] flex items-center justify-center shrink-0">
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCp0JctwLH5Hgagb0TY-xvAuWK2NCGU4fZgQ&s"
                        alt=""
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">
                        MoMo Wallet
                      </p>
                      <p className="text-xs text-slate-500">
                        Fast payment via App
                      </p>
                    </div>
                  </div>
                  <div
                    className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                      paymentMethod === "momo"
                        ? "border-pink-600 bg-pink-600"
                        : "border-slate-300"
                    }`}
                  >
                    {paymentMethod === "momo" && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* secure footer */}
            <div className="pt-6 flex items-center gap-2 text-slate-400 text-xs mt-auto">
              <Lock className="w-3 h-3" />
              <span>All transactions are secure and encrypted.</span>
            </div>
          </div>
        </main>
      </div>

      {/* right column summary */}
      <div className="hidden lg:block lg:w-[40%] xl:w-[35%] bg-slate-50">
        <div className="sticky top-0 h-screen p-8 xl:p-12 flex flex-col">
          <h2 className="text-lg font-bold text-slate-900 mb-6">
            Order Summary
          </h2>

          {/* course item */}
          <div className="flex gap-4 mb-6">
            <div className="relative h-20 w-28 rounded-lg overflow-hidden bg-slate-200 shrink-0 border border-slate-200">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 line-clamp-2 text-sm mb-1">
                {course.title}
              </h3>
              <p className="text-xs text-slate-500 mb-2 truncate">
                Instructor: {course.instructorId?.fullName}
              </p>
              <Badge
                variant="secondary"
                className="text-[10px] h-5 px-2 bg-white border"
              >
                Lifetime
              </Badge>
            </div>
          </div>

          <Separator className="mb-6" />

          {/* coupon input */}
          <div className="flex gap-2 mb-8">
            <Input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter coupon code"
              className="bg-white focus-visible:ring-0 border-slate-200"
            />
            <Button
              variant="outline"
              className="shrink-0 bg-white border-slate-200 text-slate-600"
            >
              <Ticket className="w-4 h-4" />
            </Button>
          </div>

          {/* totals */}
          <div className="space-y-3 mb-8 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>{formatCurrency(course.price)}</span>
            </div>
            <div className="flex justify-between text-green-600 font-medium">
              <span>Discount</span>
              <span>- 0</span>
            </div>
          </div>

          <Separator className="mb-6" />

          <div className="flex justify-between items-end mb-8">
            <span className="text-slate-900 font-bold">Total</span>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-blue-900">
                {formatCurrency(course.price)}
              </span>
              <span className="text-[10px] text-slate-400 block">
                VAT included
              </span>
            </div>
          </div>

          {/* cta button */}
          <Button
            onClick={handlePayment}
            disabled={isPaying}
            size="lg"
            className="w-full h-12 text-base font-bold bg-blue-900 hover:bg-blue-800 mb-4 transition-all"
          >
            {isPaying ? (
              <>
                Processing <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              "Complete Payment"
            )}
          </Button>

          <div className="mt-auto flex justify-center gap-1 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4" /> Secure Checkout
          </div>
        </div>
      </div>

      {/* mobile bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-50 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs text-slate-500">Total</span>
          <span className="text-lg font-bold text-blue-900">
            {formatCurrency(course.price)}
          </span>
        </div>
        <Button
          onClick={handlePayment}
          disabled={isPaying}
          className="bg-blue-900 px-8"
        >
          {isPaying ? <Loader2 className="animate-spin" /> : "Pay Now"}
        </Button>
      </div>
    </div>
  );
}
