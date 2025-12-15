"use client";

import Image from "next/image";
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#10069d] text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
          {/* logo + desc */}
          <div className="space-y-6">
            {/* logo */}
            <Image
              src="/nine-logo.png"
              alt="Logo"
              width={250}
              height={150}
              className="object-contain"
            />

            {/* subtitle */}
            <p className="text-sm leading-relaxed text-white/90 max-w-[340px]">
              The largest Blockchain and Web3 training academy in Vietnam,
              specializing in providing comprehensive technology training
              solutions and connecting the developer community with businesses,
              from strategic consulting to planning and execution.
            </p>

            {/* company info */}
            <div className="text-sm text-white/80 space-y-1">
              <p>Group: 9 PTIT.HCM</p>
              <p>Phone: 0797570988</p>
              <p>
                Address: 97 Man Thiện, Phường Tăng Nhơn Phú A, Quận 9, TP.HCM
              </p>
            </div>
          </div>

          {/* info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Information</h3>
            <ul className="space-y-3 text-sm text-white/90">
              <li>
                <a href="#" className="hover:underline">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Partners
                </a>
              </li>
            </ul>
          </div>

          {/* social */}
          <div>
            <h3 className="text-white font-semibold mb-4">Social</h3>
            <ul className="space-y-3 text-sm text-white/90">
              <li>
                <a href="#" className="hover:underline">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  X (Twitter)
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  YouTube
                </a>
              </li>
            </ul>
          </div>

          {/* Terms */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Terms &amp; Condition
            </h3>
            <ul className="space-y-3 text-sm text-white/90">
              <li>
                <a href="#" className="hover:underline">
                  Terms &amp; Condition
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* divider */}
        <div className="mt-8 border-t border-white/20" />

        {/* copyright */}
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between text-sm text-white/80 gap-4">
          <p>
            Copyright © {new Date().getFullYear()}. Powered by{" "}
            <span className="font-medium text-white">NineEdu</span>
          </p>
          <p className="text-xs text-white/70">
            Design &amp; Development — Group 9 Students, PTIT.HCM
          </p>
        </div>
      </div>
    </footer>
  );
}
