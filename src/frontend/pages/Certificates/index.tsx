"use client";

import React, { useRef } from "react";
import { useParams } from "next/navigation";
import { useGetCertificateByCode } from "@/hooks/certificates/useCertificateHooks";
import { Button } from "@/components/ui/button";
import { Printer, Share2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useReactToPrint } from "react-to-print";

export default function CertificateDetailPage() {
  const params = useParams();
  const code = params?.code as string;

  // ref for print content
  const contentRef = useRef<HTMLDivElement>(null);

  const { data: cert, isLoading } = useGetCertificateByCode({
    queryKey: ["getCertificateByCode", code],
    queryParams: { code },
  });

  // print configuration
  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    documentTitle: `Certificate-${cert?.certificateCode || "NineEdu"}`,
    pageStyle: `
      @page {
        size: landscape;
        margin: 0mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
      }
    `,
  });

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-indigo-600" />
      </div>
    );

  if (!cert)
    return <div className="text-center p-10">Certificate not found.</div>;

  return (
    <div className="min-h-screen py-10 flex flex-col items-center justify-center gap-6">
      {/* action buttons */}
      <div className="flex gap-4">
        <Button
          onClick={() => handlePrint()}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <Printer className="w-4 h-4 mr-2" /> Print Certificate
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
          }}
        >
          <Share2 className="w-4 h-4 mr-2" /> Share
        </Button>
      </div>

      {/* certificate container */}
      <div ref={contentRef}>
        <div className="w-full h-full flex items-center justify-center print:min-h-screen">
          <div className="relative bg-white w-[900px] h-[640px] shadow-2xl p-10 text-center border-[10px] border-double border-slate-200">
            {/* background pattern */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[url('/pattern.png')]"></div>

            <div className="flex flex-col h-full justify-between py-8 px-12 relative z-10">
              {/* header */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold tracking-[0.2em] text-slate-500 uppercase">
                  Certificate of Recognition
                </h3>
                <h1
                  className="text-6xl font-black text-slate-900 tracking-tight"
                  style={{ fontFamily: "serif" }}
                >
                  ACHIEVEMENT
                </h1>
                <p className="text-slate-500 mt-4">Presented to</p>
              </div>

              {/* student name */}
              <div className="py-4">
                <h2 className="text-4xl font-bold text-slate-800 border-b-2 border-slate-100 pb-2 inline-block min-w-[300px]">
                  {cert.userId.fullName}
                </h2>
              </div>

              {/* course info */}
              <div className="space-y-4">
                <p className="text-slate-500">
                  For outstanding accomplishment in
                </p>
                <h3
                  className="text-3xl font-bold text-indigo-900 italic"
                  style={{ fontFamily: "serif" }}
                >
                  "{cert.courseId.title}"
                </h3>
                <p className="text-slate-600 max-w-xl mx-auto">
                  demonstrating exceptional skills and dedication in the field
                  of
                </p>
                <h4 className="text-xl font-bold text-slate-800 uppercase tracking-wide">
                  {cert.courseId.category || "ONLINE LEARNING"}
                </h4>
              </div>

              {/* footer */}
              <div className="flex justify-between items-end mt-12 px-8">
                <div className="text-center">
                  <div className="text-lg font-semibold text-slate-800 border-t border-slate-400 pt-2 px-8 min-w-[200px]">
                    {format(new Date(cert.issuedAt), "MMMM dd, yyyy")}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 uppercase">Date</p>
                </div>

                <div className="text-center">
                  <div className="text-lg font-bold text-indigo-900 border-t border-slate-400 pt-2 px-8 min-w-[200px]">
                    Nine Academy
                  </div>
                  <p className="text-xs text-slate-400 mt-1 uppercase">
                    Signature
                  </p>
                </div>
              </div>

              {/* certificate id */}
              <div className="absolute bottom-4 right-4 text-[10px] text-slate-300">
                ID: {cert.certificateCode}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
