"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  HeartPulse,
  Home,
  User,
  Phone,
  CreditCard,
  MapPin,
  FileText,
  CheckCircle2,
} from "lucide-react";

export default function AddHouseholdPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    houseNumber: "",
    headName: "",
    mobile: "",
    voterId: "",
    aadhaar: "",
    rationCard: "",
    address: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    
    const existing = JSON.parse(
      localStorage.getItem("sahayak_households") || "[]"
    );

    const newHousehold = {
      id: Date.now(),
      ...form,
      status: "Pending",
      priority: "Normal",
    };

    localStorage.setItem(
      "sahayak_households",
      JSON.stringify([...existing, newHousehold])
    );

    setSubmitted(true);

    setTimeout(() => {
      router.push("/dashboard");
    }, 900);
  };

  return (
    <main className="min-h-screen bg-[#061321] text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-[650px] w-[650px] rounded-full bg-emerald-500/[0.06] blur-[180px]" />
        <div className="absolute bottom-[-180px] right-[10%] h-[500px] w-[500px] rounded-full bg-cyan-500/[0.05] blur-[180px]" />
      </div>

      {/* Top bar */}
      <header className="relative z-10 border-b border-white/[0.07] bg-[#071827]/70 backdrop-blur-xl">
        <div className="mx-auto flex h-[88px] max-w-[1188px] items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10">
              <HeartPulse size={28} className="text-emerald-400" />
            </div>

            <div>
              <h1 className="text-xl font-bold">SahayakAI</h1>
              <p className="text-xs text-slate-400">
                Community Healthcare
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>
        </div>
      </header>

      {/* Main content */}
      <section className="relative z-10 mx-auto w-full max-w-[900px] px-8 pb-16 pt-12">
        {/* Heading */}
        <div className="mb-10">
          <p className="mb-3 text-sm font-semibold tracking-wide text-emerald-400">
            HOUSEHOLD REGISTRATION
          </p>

          <h2 className="text-[40px] font-bold tracking-tight">
            Add New Household
          </h2>

          <p className="mt-3 text-[17px] text-slate-400">
            Enter the basic household details to register a new family.
          </p>
        </div>

        {/* Form panel */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-8 shadow-2xl backdrop-blur-xl"
        >
          {/* Basic information */}
          <div className="mb-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                <Home size={21} className="text-emerald-400" />
              </div>

              <div>
                <h3 className="text-xl font-semibold">Basic Information</h3>
                <p className="text-sm text-slate-400">
                  Household and head-of-family details
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <InputField
                label="House Number"
                placeholder="e.g. House 101"
                value={form.houseNumber}
                onChange={(value) => updateField("houseNumber", value)}
                icon={<Home size={18} />}
                required
              />

              <InputField
                label="Head Name"
                placeholder="Enter head of household name"
                value={form.headName}
                onChange={(value) => updateField("headName", value)}
                icon={<User size={18} />}
                required
              />

              <InputField
                label="Head Mobile Number"
                placeholder="Enter 10-digit mobile number"
                value={form.mobile}
                onChange={(value) => updateField("mobile", value)}
                icon={<Phone size={18} />}
                type="tel"
                required
              />

              <InputField
                label="Voter ID"
                placeholder="Enter voter ID"
                value={form.voterId}
                onChange={(value) => updateField("voterId", value)}
                icon={<CreditCard size={18} />}
              />

              <InputField
                label="Aadhaar Card"
                placeholder="Enter Aadhaar number"
                value={form.aadhaar}
                onChange={(value) => updateField("aadhaar", value)}
                icon={<CreditCard size={18} />}
              />

              <InputField
                label="Ration Card"
                placeholder="Enter ration card number"
                value={form.rationCard}
                onChange={(value) => updateField("rationCard", value)}
                icon={<FileText size={18} />}
              />
            </div>
          </div>

          {/* Address */}
          <div className="border-t border-white/[0.08] pt-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
                <MapPin size={21} className="text-cyan-400" />
              </div>

              <div>
                <h3 className="text-xl font-semibold">Address</h3>
                <p className="text-sm text-slate-400">
                  Current residential address
                </p>
              </div>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-300">
                Full Address <span className="text-emerald-400">*</span>
              </span>

              <textarea
                required
                rows={4}
                value={form.address}
                onChange={(e) => updateField("address", e.target.value)}
                placeholder="Enter complete household address"
                className="w-full resize-none rounded-2xl border border-white/[0.10] bg-white/[0.035] px-5 py-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/60 focus:bg-white/[0.05]"
              />
            </label>
          </div>

          {/* Buttons */}
          <div className="mt-10 flex flex-col-reverse gap-4 border-t border-white/[0.08] pt-7 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="h-12 rounded-xl border border-white/[0.12] px-6 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitted}
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-7 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-80"
            >
              {submitted ? (
                <>
                  <CheckCircle2 size={19} />
                  Household Registered
                </>
              ) : (
                <>
                  <CheckCircle2 size={19} />
                  Register Household
                </>
              )}
            </button>
          </div>
        </form>

        <p className="mt-5 text-center text-xs text-slate-500">
          After registration, the household will appear in Registered
          Households.
        </p>
      </section>
    </main>
  );
}

function InputField({
  label,
  placeholder,
  value,
  onChange,
  icon,
  type = "text",
  required = false,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  icon: React.ReactNode;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">
        {label}
        {required && <span className="text-emerald-400"> *</span>}
      </span>

      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
          {icon}
        </span>

        <input
          required={required}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-12 w-full rounded-2xl border border-white/[0.10] bg-white/[0.035] pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/60 focus:bg-white/[0.05]"
        />
      </div>
    </label>
  );
}