"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  Home,
  RefreshCcw,
} from "lucide-react";

import enrollmentApis from "@/shared/apis/enrollmentApis";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const PaymentResultContent = () => {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const courseId = params?.courseId as string;

  // state
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Processing transaction...");
  const [transactionData, setTransactionData] = useState<any>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        //@ts-ignore
        const queryParams = Object.fromEntries(searchParams?.entries());

        if (Object.keys(queryParams).length === 0) {
          router.push(`/courses/${courseId}`);
          return;
        }

        const res: any = await enrollmentApis.vnpayReturn(queryParams);

        if (res.code === "00" || res.status === "success") {
          setStatus("success");
          setMessage("Payment successful.");
          setTransactionData(queryParams);
        } else {
          setStatus("error");
          setMessage(res.message || "Transaction failed.");
        }
      } catch (error: any) {
        console.error("Payment Verify Error:", error);
        setStatus("error");
        setMessage("Verification error occurred.");
      }
    };

    verifyPayment();
  }, [searchParams, courseId, router]);

  // loading
  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-gray-900" />
        <p className="text-sm text-gray-500">Verifying payment...</p>
      </div>
    );
  }

  // error
  if (status === "error") {
    return (
      <div className="w-full max-w-sm mx-auto p-6 border border-gray-200 rounded-lg bg-white">
        <div className="flex flex-col items-center text-center mb-6">
          <XCircle className="w-10 h-10 text-red-500 mb-4" />
          <h2 className="text-lg font-semibold text-gray-900">
            Payment Failed
          </h2>
          <p className="text-sm text-gray-500 mt-1">{message}</p>
        </div>

        <div className="bg-gray-50 p-3 rounded text-xs text-gray-500 space-y-2 mb-6">
          <div className="flex justify-between">
            <span>Code:</span>
            <span className="font-mono text-gray-900">
              {searchParams?.get("vnp_ResponseCode") || "N/A"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Time:</span>
            <span>{new Date().toLocaleString("en-US")}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Button
            onClick={() => router.push(`/courses/${courseId}/payment`)}
            className="w-full bg-black hover:bg-gray-800 text-white"
          >
            <RefreshCcw className="w-4 h-4 mr-2" /> Retry Payment
          </Button>
          <Link href="/" className="block w-full">
            <Button variant="outline" className="w-full border-gray-200">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // success
  return (
    <div className="w-full max-w-sm mx-auto p-6 border border-gray-200 rounded-lg bg-white">
      <div className="flex flex-col items-center text-center mb-6">
        <CheckCircle2 className="w-10 h-10 text-green-600 mb-4" />
        <h2 className="text-lg font-semibold text-gray-900">
          Payment Successful
        </h2>
        <p className="text-sm text-gray-500 mt-1">Ready for learning</p>
      </div>

      <Separator className="my-4 bg-gray-100" />

      {/* Invoice Details */}
      <div className="space-y-3 text-sm mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Transaction ID</span>
          <span className="font-mono text-gray-900">
            {transactionData?.vnp_TransactionNo || "N/A"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Bank</span>
          <span className="text-gray-900">
            {transactionData?.vnp_BankCode || "VNPAY"}
          </span>
        </div>
        <div className="flex justify-between items-center pt-2">
          <span className="text-gray-500">Total</span>
          <span className="font-semibold text-gray-900 text-base">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(Number(transactionData?.vnp_Amount || 0) / 100)}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <Button
          className="w-full bg-black hover:bg-gray-800 text-white h-10"
          onClick={() => router.push(`/courses/${courseId}/learn`)}
        >
          Start Learning <ArrowRight className="w-4 h-4 ml-2" />
        </Button>

        <Link href="/dashboard" className="block w-full">
          <Button
            variant="ghost"
            className="w-full text-gray-500 hover:text-gray-900 hover:bg-gray-50"
          >
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default function PaymentResultPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <Suspense
        fallback={<div className="text-sm text-gray-500">Loading...</div>}
      >
        <PaymentResultContent />
      </Suspense>
    </div>
  );
}
