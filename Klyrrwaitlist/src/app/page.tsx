"use client";
import { useState } from "react";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
});

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email.trim().length > 0) {
      setIsLoading(true);
      
      // Google Form submission
      const formId = "1FAIpQLSdsq0mcQo3vfH_eN7YG4Vc0EgnnBbf4NVjNLgwJUzQJTMQqvw";
      const emailFieldId = "entry.795318874"; // You'll need to get this - I'll show you how below
      
      try {
        // Create form data
        const formData = new FormData();
        formData.append(emailFieldId, email);
        
        // Submit to Google Form (using no-cors mode)
        await fetch(`https://docs.google.com/forms/d/e/${formId}/formResponse`, {
          method: 'POST',
          body: formData,
          mode: 'no-cors'
        });
        
        // Show success message
        setSubmitted(true);
      } catch (error) {
        console.error('Error:', error);
        // Still show success because no-cors doesn't give us response
        setSubmitted(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <main
      className={`${cormorant.variable} ${dmSans.variable} w-full min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center bg-cream`}
    >
      {/* Eyebrow badge */}
      <span
        className="text-xs uppercase tracking-widest text-burgundy font-medium"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        Now accepting beta applications
      </span>

      {/* Headline */}
      <h1
        className="mx-auto max-w-4xl text-burgundy text-5xl sm:text-7xl mb-6 leading-tight"
        style={{ fontFamily: "var(--font-cormorant)" }}
      >
        Built for the student <br className="hidden sm:block" />
        <span className="text-gold italic">nobody built for.</span>
      </h1>

      {/* Subtext */}
      <p
        className="mx-auto max-w-xl text-burgundy/70 text-lg sm:text-xl mb-10"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        Your AI-powered study abroad companion. Get personalized university
        matches, craft the perfect application, and secure your future.
      </p>

      {/* Form Area */}
      <div className="w-full max-w-md mx-auto min-h-40">
        {submitted ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-gold/30 bg-cream p-8">
            <span
              className="text-3xl text-gold italic"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              You're on the list.
            </span>
            <p
              className="text-burgundy/70"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              We'll reach out when your spot opens up.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@university.edu"
              className="w-full rounded-xl border-2 border-burgundy/10 bg-white px-5 py-4 text-burgundy placeholder:text-burgundy/30 focus:border-burgundy/30 focus:outline-none"
              style={{ fontFamily: "var(--font-dm-sans)" }}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-burgundy px-7 py-4 text-cream font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ fontFamily: "var(--font-dm-sans)" }}
              disabled={isLoading}
            >
              {isLoading ? "Joining..." : "Join Waitlist"}
            </button>
            <p
              className="mt-2 text-center text-xs text-burgundy/50"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Spots are extremely limited for the beta.
            </p>
          </form>
        )}
      </div>

      {/* Stats */}
      <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
        {[
          { num: "500+", label: "Students waitlisted" },
          { num: "40+", label: "Countries covered" },
          { num: "1,200+", label: "Universities mapped" },
        ].map(({ num, label }) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <span
              className="text-gold text-4xl font-bold"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              {num}
            </span>
            <span
              className="text-xs text-burgundy/60 uppercase tracking-widest"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}