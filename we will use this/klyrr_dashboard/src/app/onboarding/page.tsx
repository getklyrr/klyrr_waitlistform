"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useKlyrr, COUNTRIES, MAJORS, FinancialPlan, AcademicStage } from "@/context/KlyrrContext";
import { ChevronRight, ChevronLeft, Globe, BookOpen, Target, DollarSign, Check, Sparkles } from "lucide-react";

const STEPS = [
  { id: 1, label: "Destination", icon: Globe, title: "Where do you want to study?", subtitle: "Select all countries you're considering" },
  { id: 2, label: "Academic", icon: BookOpen, title: "Tell us about your studies", subtitle: "This helps us match you accurately" },
  { id: 3, label: "Major", icon: Target, title: "What do you want to study?", subtitle: "Choose your primary field of interest" },
  { id: 4, label: "Financial", icon: DollarSign, title: "What's your financial plan?", subtitle: "We'll filter universities accordingly" },
];

const STAGES: { value: AcademicStage; label: string; desc: string }[] = [
  { value: "grade_11", label: "Grade 11", desc: "Planning ahead — smart move" },
  { value: "grade_12", label: "Grade 12", desc: "Applying this cycle" },
  { value: "gap_year", label: "Gap Year", desc: "Taking a year between" },
  { value: "transfer", label: "Transfer Student", desc: "Moving from another university" },
];

const FINANCIAL_OPTIONS: { value: FinancialPlan; label: string; desc: string }[] = [
  { value: "full_aid", label: "Need Full Financial Aid", desc: "I need complete funding to study abroad" },
  { value: "partial_aid", label: "Partial Aid / Scholarships", desc: "I can cover some costs with support" },
  { value: "self_funded", label: "Self-Funded", desc: "I or my family can cover the full cost" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { profile, updateProfile } = useKlyrr();
  const [currentStep, setCurrentStep] = useState(1);
  const [localName, setLocalName] = useState(profile.name || "");
  const [selectedCountries, setSelectedCountries] = useState<string[]>(profile.targetCountries);
  const [stage, setStage] = useState<AcademicStage | "">(profile.academicStage);
  const [gpa, setGpa] = useState(profile.gpa);
  const [extracurriculars, setExtracurriculars] = useState(profile.extracurriculars);
  const [major, setMajor] = useState(profile.major);
  const [financialPlan, setFinancialPlan] = useState<FinancialPlan | "">(profile.financialPlan);

  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  const toggleCountry = (c: string) =>
    setSelectedCountries((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );

  const canProceed = () => {
    if (currentStep === 1) return selectedCountries.length > 0;
    if (currentStep === 2) return stage !== "" && gpa !== "";
    if (currentStep === 3) return major !== "";
    if (currentStep === 4) return financialPlan !== "";
    return false;
  };

  const handleFinish = () => {
    updateProfile({
      name: localName,
      targetCountries: selectedCountries,
      academicStage: stage,
      gpa,
      extracurriculars,
      major,
      financialPlan,
      completed: true,
    });
    router.push("/universities");
  };

  const StepIcon = STEPS[currentStep - 1].icon;

  return (
    <div className="min-h-screen bg-cream flex flex-col font-sans">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-burgundy rounded-sm flex items-center justify-center">
            <img src="/logo.svg" alt="Klyrr Logo" className="w-4 h-4 object-contain" />
          </div>
          <span className="text-burgundy font-bold text-xl tracking-tight">KLYRR</span>
        </div>

        {/* Progress Bar */}
        <div className="mb-2">
          <div className="flex justify-between text-xs text-burgundy/50 mb-2">
            {STEPS.map((s) => (
              <span key={s.id} className={currentStep >= s.id ? "text-burgundy font-semibold" : ""}>{s.label}</span>
            ))}
          </div>
          <div className="h-1 bg-warm-beige rounded-full overflow-hidden">
            <div
              className="h-full bg-gold rounded-full transition-all duration-500"
              style={{ width: `${progress + 25}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 pb-6 flex flex-col">
        <div className="mb-8">
          <div className="w-12 h-12 bg-burgundy rounded-xl flex items-center justify-center mb-4">
            <StepIcon size={22} className="text-gold" />
          </div>
          <h1 className="text-2xl font-bold text-burgundy leading-tight mb-1 font-serif">
            {STEPS[currentStep - 1].title}
          </h1>
          <p className="text-burgundy/60 text-sm">
            {STEPS[currentStep - 1].subtitle}
          </p>
        </div>

        {/* Step 1: Destination */}
        {currentStep === 1 && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold text-burgundy/60 uppercase tracking-widest mb-2 block">
                Your Name
              </label>
              <input
                value={localName}
                onChange={(e) => setLocalName(e.target.value)}
                placeholder="Peter Parker"
                className="w-full px-4 py-3 bg-white border border-warm-beige rounded-xl text-burgundy placeholder-burgundy/30 focus:outline-none focus:border-gold transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-burgundy/60 uppercase tracking-widest mb-3 block">
                Target Countries
              </label>
              <div className="grid grid-cols-2 gap-2">
                {COUNTRIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => toggleCountry(c)}
                    className={`px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all ${
                      selectedCountries.includes(c)
                        ? "bg-burgundy text-white border-burgundy"
                        : "bg-white text-burgundy border-warm-beige hover:border-burgundy"
                    }`}
                  >
                    {selectedCountries.includes(c) && <Check size={12} className="inline mr-1" />}
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Academic */}
        {currentStep === 2 && (
          <div className="flex flex-col gap-5">
            <div>
              <label className="text-xs font-semibold text-burgundy/60 uppercase tracking-widest mb-3 block">
                Academic Stage
              </label>
              <div className="flex flex-col gap-2">
                {STAGES.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setStage(s.value)}
                    className={`px-4 py-3.5 rounded-xl border text-left transition-all ${
                      stage === s.value
                        ? "bg-burgundy text-white border-burgundy"
                        : "bg-white text-burgundy border-warm-beige hover:border-burgundy"
                    }`}
                  >
                    <div className="font-semibold text-sm">{s.label}</div>
                    <div className={`text-xs mt-0.5 ${stage === s.value ? "text-white/70" : "text-burgundy/50"}`}>{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-burgundy/60 uppercase tracking-widest mb-2 block">
                GPA / Predicted Grade
              </label>
              <input
                value={gpa}
                onChange={(e) => setGpa(e.target.value)}
                placeholder="e.g. 3.8 / 10, 85%, A*A*A"
                className="w-full px-4 py-3 bg-white border border-warm-beige rounded-xl text-burgundy placeholder-burgundy/30 focus:outline-none focus:border-gold transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-burgundy/60 uppercase tracking-widest mb-2 block">
                Extracurriculars (Optional)
              </label>
              <textarea
                value={extracurriculars}
                onChange={(e) => setExtracurriculars(e.target.value)}
                placeholder="Hackathons, open source, volunteering, sports..."
                rows={3}
                className="w-full px-4 py-3 bg-white border border-warm-beige rounded-xl text-burgundy placeholder-burgundy/30 focus:outline-none focus:border-gold transition-colors resize-none"
              />
            </div>
          </div>
        )}

        {/* Step 3: Major */}
        {currentStep === 3 && (
          <div className="grid grid-cols-1 gap-2">
            {MAJORS.map((m) => (
              <button
                key={m}
                onClick={() => setMajor(m)}
                className={`px-4 py-3.5 rounded-xl border text-left font-medium text-sm transition-all ${
                  major === m
                    ? "bg-burgundy text-white border-burgundy"
                    : "bg-white text-burgundy border-warm-beige hover:border-burgundy"
                }`}
              >
                {major === m && <Check size={12} className="inline mr-2" />}
                {m}
              </button>
            ))}
          </div>
        )}

        {/* Step 4: Financial */}
        {currentStep === 4 && (
          <div className="flex flex-col gap-3">
            {FINANCIAL_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFinancialPlan(opt.value)}
                className={`px-5 py-4 rounded-xl border-2 text-left transition-all ${
                  financialPlan === opt.value
                    ? "border-burgundy bg-burgundy"
                    : "border-warm-beige bg-white hover:border-burgundy/40"
                }`}
              >
                <div className={`font-bold text-base mb-1 font-serif ${financialPlan === opt.value ? "text-white" : "text-burgundy"}`}>
                  {opt.label}
                </div>
                <div className={`text-sm ${financialPlan === opt.value ? "text-white/70" : "text-burgundy/60"}`}>
                  {opt.desc}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-auto pt-8 flex gap-3">
          {currentStep > 1 && (
            <button
              onClick={() => setCurrentStep((s) => s - 1)}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl border border-warm-beige text-burgundy font-semibold text-sm transition-all hover:bg-warm-beige"
            >
              <ChevronLeft size={16} /> Back
            </button>
          )}
          <button
            onClick={currentStep === STEPS.length ? handleFinish : () => setCurrentStep((s) => s + 1)}
            disabled={!canProceed()}
            className={`flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm transition-all ${
              canProceed()
                ? "bg-burgundy text-white hover:opacity-90 active:scale-[0.98]"
                : "bg-warm-beige text-burgundy/40 cursor-not-allowed"
            }`}
          >
            {currentStep === STEPS.length ? (
              <><Sparkles size={16} /> Find My Universities</>
            ) : (
              <>Continue <ChevronRight size={16} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}