"use client";
import Link from "next/link";
import { GraduationCap, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Image
              alt="logo"
              width={60}
              height={60}
              src="https://rompit.org/assets/rompit-9wEDxLfn.png"
            />
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/exam">
              <Button variant="ghost">Exams</Button>
            </Link>
            <Link href="/admin">
              <Button variant="ghost">Admin</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl font-extrabold tracking-tight">
              Prepare for Your Future with AP EAMCET
            </h1>
            <p className="text-xl text-muted-foreground">
              Access comprehensive practice exams in Mathematics, Physics, and
              Chemistry. Track your progress and improve your chances of
              success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/exam">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Practice Exam
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/admin">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Admin Dashboard
                  <ShieldCheck className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-6">
            {[
              {
                title: "Mathematics",
                description:
                  "Advanced algebra, calculus, and geometry problems",
                icon: "📐",
              },
              {
                title: "Physics",
                description: "Mechanics, thermodynamics, and modern physics",
                icon: "⚡",
              },
              {
                title: "Chemistry",
                description: "Organic, inorganic, and physical chemistry",
                icon: "🧪",
              },
              {
                title: "Real-time Progress",
                description: "Track your performance instantly",
                icon: "📊",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-card rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { number: "1000+", label: "Practice Questions" },
            { number: "24/7", label: "Available" },
            { number: "100%", label: "Success Rate" },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-8 bg-card rounded-lg shadow-md"
            >
              <div className="text-4xl font-bold mb-2">{stat.number}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 mt-16">
        <div className="border-t pt-8">
          <p className="text-center text-muted-foreground">
            © 2025 Rompit Technologies EAMCET Practice Portal. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
