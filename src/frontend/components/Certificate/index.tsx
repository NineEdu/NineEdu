import { cn } from "@/lib/utils";
import React from "react";
import { twMerge } from "tailwind-merge";

interface CertificateProps {
  recipientName: string;
  achievementDescription: string;
  field: string;
  date: string;
  signerName: string;
  className?: string;
}

const Certificate: React.FC<CertificateProps> = ({
  recipientName,
  achievementDescription,
  field,
  date,
  signerName,
  className,
}) => {
  const certificateClasses = twMerge(
    "relative w-full h-full",
    "bg-white overflow-hidden",
    "flex flex-col items-center justify-center",
    "text-gray-800 font-sans p-10 md:p-16",
    "border-8 border-tech-blue print:border-none",
    className
  );

  return (
    <div className={cn("aspect-[297/210]", certificateClasses)}>
      {/* bg */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 mix-blend-multiply"></div>
      </div>

      {/* content */}
      <div className="relative z-10 text-center space-y-4 md:space-y-6">
        <p className="text-xl md:text-2xl uppercase tracking-widest font-semibold text-gray-600">
          Certificate of Recognition
        </p>

        <h1 className="text-4xl md:text-7xl font-extrabold text-tech-blue font-heading uppercase tracking-tighter">
          Achievement
        </h1>

        <p className="text-lg md:text-xl font-medium text-gray-700">
          Presented to
        </p>

        {/* recipientName*/}
        <div className="my-4">
          <p className="text-4xl md:text-6xl font-bold font-mono text-gray-900 border-b-2 border-gray-300 pb-2 inline-block leading-tight">
            {recipientName}
          </p>
        </div>

        <p className="text-lg md:text-xl font-medium text-gray-700">
          For outstanding accomplishment in
        </p>

        {/* achievementDescription */}
        <p className="text-2xl md:text-4xl font-semibold italic text-tech-gray">
          "{achievementDescription}"
        </p>

        <p className="text-lg md:text-xl font-medium text-gray-700 mt-4">
          demonstrating exceptional skills and dedication in the field of
        </p>

        {/* field */}
        <p className="text-2xl md:text-4xl font-bold text-tech-blue uppercase tracking-wide">
          {field}
        </p>

        {/* footer */}
        <div className="flex flex-col md:flex-row justify-around items-end pt-8 md:pt-12 w-full">
          {/* left side */}
          <div className="text-center mb-6 md:mb-0">
            {/* line */}
            <div className="border-b-2 border-gray-400 w-64 mx-auto pb-1"></div>

            {/* date */}
            <p className="mt-2 text-md md:text-lg text-gray-600">
              Date: {date}
            </p>
          </div>

          {/* right side */}
          <div className="text-center">
            <div className="border-b-2 border-gray-400 w-64 mx-auto pb-1"></div>
            {/* signer */}
            <p className="mt-2 text-md md:text-lg text-gray-600">
              {signerName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
