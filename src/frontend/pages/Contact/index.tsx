"use client";

import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Facebook,
  Twitter,
  Linkedin,
  Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { notifySuccess } from "@/components/Notify";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // simulate network request
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    notifySuccess("Message sent successfully!");
  };

  return (
    <div className="min-h-screen font-sans text-slate-900">
      {/* header */}
      <section className="py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg max-w-2xl mx-auto text-slate-600">
            Have questions? We are here to help. Reach out to our team via
            email, phone, or the form below.
          </p>
        </div>
      </section>

      {/* main content */}
      <section className="py-12 -mt-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
            {/* left column info */}
            <div className="lg:w-5/12 bg-slate-900 text-white p-10 lg:p-12 relative overflow-hidden">
              {/* decor */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>

              <h3 className="text-2xl font-bold mb-2">Get in touch</h3>
              <p className="text-slate-400 mb-8">
                Fill up the form and our team will get back to you within 24
                hours.
              </p>

              <div className="space-y-6 relative z-10">
                <ContactInfoItem
                  icon={Phone}
                  title="Phone Number"
                  content="+84 (028) 3838 3838"
                  link="tel:+8402838383838"
                />
                <ContactInfoItem
                  icon={Mail}
                  title="Email Address"
                  content="likuroquoc@gmail.com"
                  link="mailto:likuroquoc@gmail.com"
                />
                <ContactInfoItem
                  icon={MapPin}
                  title="Our Office"
                  content="20 Street 96, Tang Nhon Phu A Ward, Ho Chi Minh City"
                />
                <ContactInfoItem
                  icon={Clock}
                  title="Working Hours"
                  content="Mon - Fri: 9:00 AM - 6:00 PM"
                />
              </div>

              {/* social icons */}
              <div className="mt-12">
                <p className="text-sm font-medium text-slate-400 mb-4">
                  Follow us
                </p>
                <div className="flex gap-4">
                  <SocialButton icon={Facebook} />
                  <SocialButton icon={Twitter} />
                  <SocialButton icon={Linkedin} />
                </div>
              </div>
            </div>

            {/* right column form */}
            <div className="lg:w-7/12 p-10 lg:p-12 bg-white">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      required
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      required
                      className="bg-slate-50 border-slate-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    required
                    className="bg-slate-50 border-slate-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more..."
                    className="min-h-[150px] bg-slate-50 border-slate-200 resize-none"
                    required
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full md:w-auto bg-[#020080] hover:bg-blue-900 h-12 px-8 text-base"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        Send Message <Send className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* faq section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">
              Common Questions
            </h2>
          </div>

          <div className="grid gap-6">
            <FaqCard
              question="How do I access my courses?"
              answer="Once enrolled, you get instant access via your dashboard."
            />
            <FaqCard
              question="Can I download materials?"
              answer="Yes, supplementary resources are available for download."
            />
            <FaqCard
              question="Do you offer support?"
              answer="Our team is available 24/7 to assist with any technical issues."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

// helper components
const ContactInfoItem = ({ icon: Icon, title, content, link }: any) => (
  <div className="flex gap-4">
    <div className="h-10 w-10 bg-white/10 rounded-lg flex items-center justify-center shrink-0 text-blue-200">
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <h4 className="font-semibold text-white text-sm">{title}</h4>
      {link ? (
        <a
          href={link}
          className="text-slate-300 text-sm hover:text-white transition-colors block mt-1"
        >
          {content}
        </a>
      ) : (
        <p className="text-slate-300 text-sm mt-1">{content}</p>
      )}
    </div>
  </div>
);

const SocialButton = ({ icon: Icon }: any) => (
  <a
    href="#"
    className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#020080] hover:scale-110 transition-all"
  >
    <Icon className="h-5 w-5" />
  </a>
);

const FaqCard = ({ question, answer }: any) => (
  <Card className="border shadow-sm hover:shadow-md transition-all">
    <CardContent className="p-6 flex gap-4 items-start">
      <MessageSquare className="h-6 w-6 text-[#020080] shrink-0 mt-1" />
      <div>
        <h4 className="font-bold text-slate-900 text-lg mb-2">{question}</h4>
        <p className="text-slate-600 leading-relaxed">{answer}</p>
      </div>
    </CardContent>
  </Card>
);
