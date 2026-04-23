"use client";
import { useState } from "react";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim().length > 0) {
      setIsLoading(true);
      const formId = "1FAIpQLSdsq0mcQo3vfH_eN7YG4Vc0EgnnBbf4NVjNLgwJUzQJTMQqvw";
      const emailFieldId = "entry.795318874";
      try {
        const formData = new FormData();
        formData.append(emailFieldId, email);
        await fetch(`https://docs.google.com/forms/d/e/${formId}/formResponse`, {
          method: "POST",
          body: formData,
          mode: "no-cors",
        });
        setSubmitted(true);
      } catch (error) {
        console.error("Error:", error);
        setSubmitted(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center bg-cream">

      {/* Eyebrow badge */}
      <div className="inline-flex items-center gap-2 rounded-full border border-burgundy/30 px-4 py-2 mb-8">
        <span className="w-2 h-2 rounded-full bg-gold inline-block flex-shrink-0" />
        <span className="font-dm-sans text-xs uppercase tracking-widest text-burgundy font-medium">
          Now accepting beta applications
        </span>
      </div>

      {/* Headline */}
      <h1 className="font-cormorant mx-auto max-w-4xl text-burgundy text-5xl sm:text-7xl mb-6 leading-tight">
        Built for the student <br className="hidden sm:block" />
        <span className="text-gold italic">nobody built for.</span>
      </h1>

      {/* Subtext */}
      <p className="font-dm-sans mx-auto max-w-xl text-burgundy/70 text-lg sm:text-xl mb-10">
        Your AI-powered study abroad companion. Get personalized university
        matches, craft the perfect application, and secure your future.
      </p>

      {/* Form / Success Card */}
      <div className="w-full max-w-md mx-auto min-h-40">
        {submitted ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-gold/30 bg-cream p-8">
            <span className="font-cormorant text-3xl text-gold italic">
              You&apos;re on the list.
            </span>
            <p className="font-dm-sans text-burgundy/70">
              We&apos;ll reach out when your spot opens up.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 w-full">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit(e as unknown as React.FormEvent)}
              placeholder="you@university.edu"
              className="font-dm-sans w-full rounded-xl border-2 border-burgundy/10 bg-white px-5 py-4 text-burgundy placeholder:text-burgundy/30 focus:border-burgundy/30 focus:outline-none"
              disabled={isLoading}
            />
            <button
              onClick={handleSubmit}
              className="font-dm-sans w-full rounded-xl bg-burgundy px-7 py-4 text-cream font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Joining..." : "Join Waitlist"}
            </button>
            <p className="font-dm-sans mt-2 text-center text-xs text-burgundy/50">
              Spots are extremely limited for the beta.
            </p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
        {[
          { num: "500+", label: "Students Waitlisted" },
          { num: "40+", label: "Countries Covered" },
          { num: "1,200+", label: "Universities Mapped" },
        ].map(({ num, label }) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <span className="font-cormorant text-gold text-4xl font-bold">
              {num}
            </span>
            <span className="font-dm-sans text-xs text-burgundy/60 uppercase tracking-widest">
              {label}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}
