"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Shield, Scale, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function TermsOfServicePage() {
  // scroll helper
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen">
      {/* header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to Home
              </Button>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <span className="font-semibold text-slate-900 ml-2">
              Terms of Service
            </span>
          </div>
          <div className="text-sm text-slate-500 hidden md:block">
            Last updated: December 14, 2025
          </div>
        </div>
      </header>

      {/* main container */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* left content */}
          <div className="lg:col-span-8">
            <div className="bg-white p-8 md:p-12 rounded-2xl border shadow-sm space-y-12">
              {/* intro */}
              <section id="introduction" className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                  Terms of Service
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Welcome to NineEdu! These Terms of Service ("Terms") govern
                  your use of our website, apps, and other products and services
                  ("Services"). By using our Services, you agree to be bound by
                  these Terms.
                </p>
              </section>

              <Separator />

              {/* 1. accounts */}
              <section id="accounts" className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <span className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">
                    1
                  </span>
                  Accounts
                </h2>
                <p className="text-slate-600">
                  You need an account for most activities on our platform,
                  including purchasing and accessing content or submitting
                  content for publication. When setting up and maintaining your
                  account, you must provide and continue to provide accurate and
                  complete information, including a valid email address.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-slate-600">
                  <li>
                    You have complete responsibility for your account and
                    everything that happens on your account.
                  </li>
                  <li>
                    You must not share your login credentials with anyone else.
                  </li>
                  <li>
                    You must notify us immediately upon learning that someone
                    else may be using your account without your permission.
                  </li>
                  <li>
                    Students must be at least 13 years of age to create an
                    account on NineEdu.
                  </li>
                </ul>
              </section>

              {/* 2. enrollment */}
              <section id="enrollment" className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <span className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">
                    2
                  </span>
                  Course Enrollment & Access
                </h2>
                <p className="text-slate-600">
                  When you enroll in a course, you get a license from us to view
                  it via the NineEdu Services and for no other use. Don't try to
                  transfer or resell courses in any way.
                </p>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm text-slate-700">
                  <strong>License:</strong> NineEdu grants you a limited,
                  non-exclusive, non-transferable license to access and view the
                  courses and associated content for which you have paid all
                  required fees, solely for your personal, non-commercial,
                  educational purposes.
                </div>
              </section>

              {/* 3. payments */}
              <section id="payments" className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <span className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">
                    3
                  </span>
                  Payments & Refunds
                </h2>
                <p className="text-slate-600">
                  When you make a payment, you agree to use a valid payment
                  method. We use secure third-party payment processors (e.g.,
                  VNPAY).
                </p>
                <p className="text-slate-600">
                  <strong>Refunds:</strong> If the course you purchased is not
                  what you were expecting, you can request, within 7 days of
                  your purchase of the course, that NineEdu apply a refund to
                  your account. We reserve the right to apply your refund as a
                  refund credit or a refund to your original payment method, at
                  our discretion.
                </p>
              </section>

              {/* 4. content rules */}
              <section id="content" className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <span className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">
                    4
                  </span>
                  Content & Behavior Rules
                </h2>
                <p className="text-slate-600">
                  You may not access or use the Services or create an account
                  for unlawful purposes. Your use of the Services and behavior
                  on our platform must comply with applicable local or national
                  laws or regulations of your country.
                </p>
                <p className="text-slate-600">
                  When participating in our <strong>Discussion Forums</strong>{" "}
                  or <strong>Reviews</strong>, you are strictly prohibited from:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-slate-600">
                  <li>
                    Posting content that infringes on intellectual property
                    rights.
                  </li>
                  <li>
                    Posting spam, advertisements, or promotional materials.
                  </li>
                  <li>
                    Engaging in hate speech, harassment, or using abusive
                    language.
                  </li>
                  <li>Posting malware, viruses, or harmful code.</li>
                </ul>
              </section>

              {/* 5. certificates */}
              <section id="certificates" className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <span className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">
                    5
                  </span>
                  Certificates
                </h2>
                <p className="text-slate-600">
                  Upon completion of a course, you may be awarded a Certificate
                  of Completion. You acknowledge that:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-slate-600">
                  <li>
                    Certificates indicate that you have completed the course
                    curriculum.
                  </li>
                  <li>
                    Certificates are not affiliated with any university or
                    accredited institution unless explicitly stated.
                  </li>
                  <li>
                    The identity on the certificate will match your account's
                    full name and cannot be changed after issuance.
                  </li>
                </ul>
              </section>

              {/* 6. disclaimers */}
              <section id="disclaimers" className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <span className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">
                    6
                  </span>
                  Disclaimers
                </h2>
                <p className="text-slate-600">
                  The Services and their content are provided on an "as is" and
                  "as available" basis. NineEdu makes no representations or
                  warranties about the suitability, reliability, availability,
                  timeliness, security, lack of errors, or accuracy of the
                  Services or their content.
                </p>
              </section>

              {/* contact section */}
              <section
                id="contact"
                className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 mt-8"
              >
                <h3 className="font-bold text-indigo-900 mb-2">
                  Have questions about these Terms?
                </h3>
                <p className="text-indigo-700 mb-4 text-sm">
                  If you have any questions or concerns regarding these Terms of
                  Service, please contact our support team.
                </p>
                <Link href="/contact">
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    Contact Support
                  </Button>
                </Link>
              </section>
            </div>
          </div>

          {/* right sidebar */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-24 space-y-6">
              {/* toc */}
              <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  Table of Contents
                </h3>
                <nav className="space-y-1">
                  <NavItem
                    id="introduction"
                    label="Introduction"
                    onClick={scrollToSection}
                  />
                  <NavItem
                    id="accounts"
                    label="1. Accounts"
                    onClick={scrollToSection}
                  />
                  <NavItem
                    id="enrollment"
                    label="2. Enrollment & Access"
                    onClick={scrollToSection}
                  />
                  <NavItem
                    id="payments"
                    label="3. Payments & Refunds"
                    onClick={scrollToSection}
                  />
                  <NavItem
                    id="content"
                    label="4. Content & Behavior"
                    onClick={scrollToSection}
                  />
                  <NavItem
                    id="certificates"
                    label="5. Certificates"
                    onClick={scrollToSection}
                  />
                  <NavItem
                    id="disclaimers"
                    label="6. Disclaimers"
                    onClick={scrollToSection}
                  />
                </nav>
              </div>

              {/* privacy link */}
              <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  Privacy Policy
                </h3>
                <p className="text-sm text-slate-500 mb-4">
                  Learn how we collect and use your data.
                </p>
                <Link href="/privacy">
                  <Button variant="outline" className="w-full">
                    View Privacy Policy
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// nav item component
const NavItem = ({
  id,
  label,
  onClick,
}: {
  id: string;
  label: string;
  onClick: (id: string) => void;
}) => (
  <button
    onClick={() => onClick(id)}
    className="w-full text-left px-3 py-2 rounded-md text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
  >
    {label}
  </button>
);
