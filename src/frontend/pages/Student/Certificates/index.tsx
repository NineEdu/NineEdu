"use client";

import React from "react";
import Link from "next/link";
import { useGetMyCertificates } from "@/hooks/certificates/useCertificateHooks";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function MyCertificatesPage() {
  // fetch data
  const { data: certificates, isLoading } = useGetMyCertificates({});

  if (isLoading) return <CertSkeleton />;

  return (
    <div className="w-full p-8 space-y-8">
      {/* header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900">My Certificates</h1>
        <p className="text-gray-500">Track your learning achievements.</p>
      </div>

      {/* content */}
      {certificates?.length === 0 ? (
        <div className="text-center py-20 border border-gray-200 rounded-md">
          <p className="text-gray-500">No certificates earned yet.</p>
          <Link href="/courses">
            <Button variant="link" className="mt-2 text-black underline">
              Browse courses to earn certificates
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert: any) => (
            <Card
              key={cert._id}
              className="p-6 flex flex-col gap-4 border-gray-200 rounded-md shadow-none"
            >
              {/* course details */}
              <div className="flex gap-4 items-start">
                <img
                  src={cert.courseId.thumbnail || "/placeholder.jpg"}
                  alt="Thumbnail"
                  className="w-16 h-16 rounded-sm object-cover bg-gray-100"
                />
                <div>
                  <h3 className="font-bold text-base text-gray-900 line-clamp-1">
                    {cert.courseId.title}
                  </h3>
                  <div className="text-sm text-gray-500 mt-1">
                    Issued: {format(new Date(cert.issuedAt), "dd/MM/yyyy")}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Code: {cert.certificateCode}
                  </div>
                </div>
              </div>

              {/* action button */}
              <div className="pt-2 mt-auto">
                <Link href={`/certificates/${cert.certificateCode}`}>
                  <Button className="w-full bg-black hover:bg-gray-800 rounded-md text-white h-10">
                    View Certificate
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

const CertSkeleton = () => (
  <div className="w-full p-8 space-y-8">
    <Skeleton className="h-10 w-48" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Skeleton className="h-40 rounded-md" />
      <Skeleton className="h-40 rounded-md" />
    </div>
  </div>
);
