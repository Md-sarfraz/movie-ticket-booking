import React from "react";
import Banner from "../components/banner";
import CompanySlider from "../components/companySlider";
import TestimonialSlider from "../components/testimonials.jsx";
import FAQ from "../components/faq.jsx";
import TeamSlider from "../components/teamSlider";
import {
  ChevronRight,
  Film,
  Users,
  MessageSquare,
  HelpCircle,
  Play,
  Sparkles,
  ShieldCheck,
  Ticket,
  Rocket,
} from "lucide-react";

const stats = [
  { label: "Tickets Sold", value: "120K+" },
  { label: "Happy Moviegoers", value: "48K+" },
  { label: "Cities Connected", value: "65+" },
  { label: "Average Support Reply", value: "< 5 min" },
];

const values = [
  {
    icon: <ShieldCheck className="h-5 w-5 text-red-500" />,
    title: "Safe & Verified",
    description: "Every booking and ticket transfer goes through a secure, trusted flow.",
  },
  {
    icon: <Ticket className="h-5 w-5 text-red-500" />,
    title: "Simple Resell",
    description: "Can't make it? List your ticket in seconds and connect with genuine buyers.",
  },
  {
    icon: <Rocket className="h-5 w-5 text-red-500" />,
    title: "Built For Speed",
    description: "Fast checkout, smart seat choices, and a smooth mobile-first experience.",
  },
];

const About = () => {
  return (
    <div className="flex w-full flex-col items-center overflow-hidden bg-white">
      <Banner
        heading="About Us"
        paragraph="Welcome to Movie Tickets Booking & Resell - your platform for buying, selling, and transferring movie tickets effortlessly"
      />

      <section className="relative w-full border-b border-stone-200/80 px-6 py-20 md:px-12 lg:px-20">
        <div className="pointer-events-none absolute left-1/2 top-4 h-40 w-40 -translate-x-1/2 rounded-full bg-red-100 blur-3xl" />
        <div className="mx-auto grid w-full max-w-7xl items-center gap-14 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-red-700">
              <Sparkles className="h-3.5 w-3.5" />
              Get To Know Us
            </div>

            <h1 className="text-3xl font-extrabold leading-tight text-stone-900 md:text-5xl">
              Making Movie Nights Easier, Smarter, and More Human
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-stone-600 md:text-lg">
              BookShow started with one goal: remove the stress from booking movie tickets and help people recover value
              through trusted resell. We build technology that keeps cinema moments spontaneous, affordable, and fun.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <p className="text-xl font-extrabold text-stone-900 md:text-2xl">{item.value}</p>
                  <p className="mt-1 text-xs font-medium tracking-wide text-stone-500">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-red-100 bg-gradient-to-r from-red-50 to-orange-50 px-4 py-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow">
                <Play className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-900">6+ Years of Product Innovation</p>
                <p className="text-sm text-stone-600">From first ticket search to last-minute transfer, we keep it smooth.</p>
              </div>
            </div>

            <button className="mt-8 inline-flex items-center gap-2 rounded-xl bg-red-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-red-200 transition duration-300 hover:bg-red-700">
              Discover More
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="order-1 flex justify-center md:order-2">
            <div className="relative w-full max-w-md">
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-2xl bg-orange-200/70 blur-2xl" />
              <div className="absolute -bottom-5 -left-5 h-28 w-28 rounded-2xl bg-red-200/70 blur-2xl" />
              <div className="absolute -bottom-4 -right-4 h-full w-full rounded-3xl bg-red-500/15" />
              <img
                src="/images/about-Img1.jpg"
                alt="About Us"
                className="relative z-10 h-[440px] w-full rounded-3xl border border-white/50 object-cover shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-gradient-to-b from-white to-stone-50 px-6 py-16 md:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-10 text-center">
            <h2 className="text-sm font-bold uppercase tracking-widest text-red-600">Why People Choose BookShow</h2>
            <h3 className="mt-3 text-3xl font-bold text-stone-900">Built Around Real Moviegoer Needs</h3>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {values.map((value) => (
              <article
                key={value.title}
                className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">{value.icon}</div>
                <h4 className="text-lg font-bold text-stone-900">{value.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full max-w-7xl px-6 py-16 md:px-10">
        <h2 className="mb-2 text-center text-sm font-bold uppercase tracking-[0.24em] text-red-600">Trusted By Partners</h2>
        <h3 className="mb-10 text-center text-2xl font-bold text-stone-900">Studios, Platforms, and Communities We Work With</h3>
        <CompanySlider />
      </section>

      <section className="w-full bg-stone-50 py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="mb-12 text-center">
            <div className="mb-3 flex justify-center">
              <Users className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-red-600">Meet Our Team</h2>
            <h1 className="mt-2 text-3xl font-bold text-stone-900">The People Behind Every Great Showtime</h1>
            <p className="mx-auto mt-4 max-w-2xl text-stone-600">
              Our dedicated team works tirelessly to provide you with the best movie ticket booking experience.
            </p>
          </div>
          <TeamSlider />
        </div>
      </section>

      <section className="w-full max-w-7xl px-6 py-20 md:px-10">
        <div className="mb-12 text-center">
          <div className="mb-3 flex justify-center">
            <MessageSquare className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-red-600">Testimonials</h2>
          <h1 className="mt-2 text-3xl font-bold text-stone-900">What People Say About Us</h1>
          <p className="mx-auto mt-4 max-w-2xl text-stone-600">
            Don't just take our word for it. Here's what our customers have to say.
          </p>
        </div>
        <TestimonialSlider />
      </section>

      <section className="w-full bg-stone-50 py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="mb-12 text-center">
            <div className="mb-3 flex justify-center">
              <HelpCircle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-red-600">Got Questions?</h2>
            <h1 className="mt-2 text-3xl font-bold text-stone-900">Frequently Asked Questions</h1>
            <p className="mx-auto mt-4 max-w-2xl text-stone-600">
              Find answers to common questions about our services.
            </p>
          </div>
          <FAQ />
        </div>
      </section>

      <section className="w-full bg-gradient-to-r from-red-600 via-red-500 to-orange-500 py-16">
        <div className="mx-auto max-w-7xl px-6 text-center md:px-10">
          <div className="mx-auto max-w-3xl rounded-3xl border border-white/30 bg-white/10 px-6 py-10 backdrop-blur-sm md:px-10">
            <div className="mb-3 flex justify-center">
              <Film className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">Ready To Book Your Next Movie Night?</h2>
            <p className="mx-auto mb-8 mt-4 max-w-2xl text-white/85">
              Join thousands of satisfied customers who use our platform for all their movie ticket needs.
            </p>
            <button className="mx-auto flex items-center gap-2 rounded-xl bg-white px-8 py-3 font-bold text-red-600 transition duration-300 hover:bg-stone-100">
              Get Started Now
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
