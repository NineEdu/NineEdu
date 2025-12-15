"use client";

import Link from "next/link";
import {
  Users,
  BookOpen,
  Trophy,
  Globe,
  CheckCircle2,
  ArrowRight,
  Target,
  Lightbulb,
} from "lucide-react";

// components - ui
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <section className="relative py-20 lg:py-28 overflow-hidden ">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-6 text-center lg:text-left">
              {/* our story */}
              <Badge variant="outline" className="px-4 py-1  ">
                Our Story
              </Badge>

              {/* heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                Empowering the world to{" "}
                <span className="text-[#020080]">learn better.</span>
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                We are on a mission to democratize education. Whether you want
                to start a new career, advance in your current role, or just
                learn something new, we are here to help you succeed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#020080] hover:bg-blue-900 text-base h-12 px-8"
                >
                  <Link href="/courses">Explore Courses</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="text-base h-12 px-8"
                >
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>

            <div className="flex-1 relative">
              <div className="relative w-full max-w-[500px] mx-auto grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                  <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
                    <img
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop"
                      alt="Team working"
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
                    <img
                      src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop"
                      alt="Student learning"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-xl border flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-lg text-slate-900">10k+</p>
                      <p className="text-xs text-muted-foreground">
                        Active Learners
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-indigo-100/50 rounded-full blur-3xl -z-0"></div>
      </section>

      {/* stast */}
      <section className="py-12 border-y bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-x divide-slate-100">
            <StatItem number="250+" label="Courses Available" icon={BookOpen} />
            <StatItem number="10k+" label="Students Enrolled" icon={Users} />
            <StatItem number="120+" label="Expert Mentors" icon={Trophy} />
            <StatItem number="4.8/5" label="Student Rating" icon={Globe} />
          </div>
        </div>
      </section>

      {/* mission and value */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Why we do what we do
            </h2>
            <p className="text-slate-600 text-lg">
              Traditional education is changing. We believe in a future where
              anyone, anywhere can access world-class education at an affordable
              price.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ValueCard
              icon={Target}
              title="Our Mission"
              desc="To provide accessible, high-quality education that empowers individuals to achieve their career goals."
            />
            <ValueCard
              icon={Lightbulb}
              title="Our Vision"
              desc="To become the world's leading platform for skill development and lifelong learning."
            />
            <ValueCard
              icon={Users}
              title="Our Community"
              desc="We foster a supportive environment where learners and instructors connect, share, and grow together."
            />
          </div>
        </div>
      </section>

      {/* reason*/}
      <section className="py-20 ">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-16">
          {/* classrom */}
          <div className="flex-1 w-full">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-200">
              <img
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1000&auto=format&fit=crop"
                alt="Classroom"
                className="object-cover"
              />
            </div>
          </div>

          {/* content */}
          <div className="flex-1 space-y-8">
            <h2 className="text-3xl font-bold text-slate-900">
              Learner outcomes on{" "}
              <span className="text-[#020080]">Our Platform</span>
            </h2>
            <p className="text-slate-600">
              87% of people learning for professional development report career
              benefits like getting a promotion, a raise, or starting a new
              career.
            </p>

            <ul className="space-y-4">
              <FeatureItem text="Learn from industry experts with real-world experience" />
              <FeatureItem text="Lifetime access to courses and updates" />
              <FeatureItem text="Official certificates upon completion" />
              <FeatureItem text="Access on mobile, tablet, and desktop" />
            </ul>

            <Button className="bg-[#020080] hover:bg-blue-900 mt-4">
              Start Your Journey <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* cta */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-[#020080] rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2 blur-2xl"></div>

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to start learning?
              </h2>
              <p className="text-blue-100 text-lg">
                Join thousands of learners from around the world and start your
                journey to success today.
              </p>
              <Link href={"/register"}>
                <Button
                  variant="secondary"
                  size="lg"
                  className="h-12 px-8 font-semibold text-[#020080]"
                >
                  Sign Up for Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// stat item
const StatItem = ({ number, label, icon: Icon }: any) => (
  <div className="flex flex-col items-center justify-center gap-2 p-2">
    <div className="h-12 w-12 flex items-center justify-center text-[#020080] mb-2">
      <Icon className="h-6 w-6" />
    </div>
    <span className="text-3xl font-bold text-slate-900">{number}</span>
    <span className="text-sm text-slate-500 font-medium">{label}</span>
  </div>
);

// value card
const ValueCard = ({ title, desc, icon: Icon }: any) => (
  <Card className="border-none transition-all bg-white">
    <CardContent className="p-8 text-center space-y-4">
      <div className="h-14 w-14 flex items-center justify-center text-[#020080] mx-auto">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-xl font-bold text-slate-900">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{desc}</p>
    </CardContent>
  </Card>
);

// feature item
const FeatureItem = ({ text }: { text: string }) => (
  <li className="flex items-start gap-3">
    <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0" />
    <span className="text-slate-700 font-medium">{text}</span>
  </li>
);
