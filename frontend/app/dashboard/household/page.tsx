"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  HeartPulse,
  Home,
  User,
  Phone,
  CreditCard,
  MapPin,
  Users,
  Baby,
  Syringe,
  Heart,
  CalendarHeart,
  Stethoscope,
  ChevronDown,
} from "lucide-react";

type Household = {
  id: number;
  houseNumber?: string;
  house?: string;
  headName?: string;
  head?: string;
  mobile?: string;
  voterId?: string;
  aadhaar?: string;
  rationCard?: string;
  address?: string;
  location?: string;
  status?: string;
  priority?: string;
};

function HouseholdContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const householdId = searchParams.get("id");

  const [household, setHousehold] = useState<Household | null>(null);
  const [loading, setLoading] = useState(true);

  const [childrenUnderFive, setChildrenUnderFive] = useState("");
  const [vaccination, setVaccination] = useState("");
  const [pregnantWomen, setPregnantWomen] = useState("");
  const [postpartumWomen, setPostpartumWomen] = useState("");

  useEffect(() => {
    if (!householdId) {
      setLoading(false);
      return;
    }

    const saved = localStorage.getItem("sahayak_households");

    if (saved) {
      try {
        const savedHouseholds: Household[] = JSON.parse(saved);

        const found = savedHouseholds.find(
          (item) => String(item.id) === householdId
        );

        if (found) {
          setHousehold(found);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error("Could not read household data:", error);
      }
    }

    const defaultHouseholds: Household[] = [
      {
        id: 1,
        house: "House d33",
        head: "Dinesh",
        location: "Kundapura",
        status: "Pending",
        priority: "Normal",
      },
      {
        id: 2,
        house: "House 101",
        head: "Lakshmi",
        location: "Kundapura",
        status: "Visited",
        priority: "Normal",
      },
      {
        id: 3,
        house: "House 205",
        head: "Ramesh",
        location: "Kundapura",
        status: "Pending",
        priority: "High",
      },
    ];

    const foundDefault = defaultHouseholds.find(
      (item) => String(item.id) === householdId
    );

    setHousehold(foundDefault || null);
    setLoading(false);
  }, [householdId]);

  useEffect(() => {
    if (!householdId) return;

    const savedFamily = localStorage.getItem(
      `sahayak_family_${householdId}`
    );

    if (!savedFamily) return;

    try {
      const familyData = JSON.parse(savedFamily);

      setChildrenUnderFive(familyData.childrenUnderFive || "");
      setVaccination(familyData.vaccination || "");
      setPregnantWomen(familyData.pregnantWomen || "");
      setPostpartumWomen(familyData.postpartumWomen || "");
    } catch (error) {
      console.error("Could not read family information:", error);
    }
  }, [householdId]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#061321] text-white">
        <p className="text-slate-400">Loading household...</p>
      </main>
    );
  }

  if (!household) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#061321] px-6 text-white">
        <Home size={42} className="mb-4 text-emerald-400" />

        <h1 className="text-2xl font-bold">
          Household not found
        </h1>

        <p className="mt-2 text-slate-400">
          The selected household could not be found.
        </p>

        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="mt-6 rounded-xl bg-emerald-500 px-5 py-3 font-semibold transition hover:bg-emerald-400"
        >
          Back to Dashboard
        </button>
      </main>
    );
  }

  const houseName =
    household.houseNumber || household.house || "House";

  const headName =
    household.headName || household.head || "Not available";

  const mobile =
    household.mobile || "Not available";

  const address =
    household.address ||
    household.location ||
    "Not available";

  const handleStartVisit = () => {
    const familyData = {
      childrenUnderFive,
      vaccination,
      pregnantWomen,
      postpartumWomen,
    };

    localStorage.setItem(
      `sahayak_family_${household.id}`,
      JSON.stringify(familyData)
    );

    localStorage.setItem(
      "sahayak_active_household",
      String(household.id)
    );

    router.push(
      `/dashboard/household/complaint?id=${household.id}`
    );
  };

  return (
    <main className="min-h-screen bg-[#061321] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-[650px] w-[650px] rounded-full bg-emerald-500/[0.06] blur-[180px]" />

        <div className="absolute bottom-[-180px] right-[10%] h-[500px] w-[500px] rounded-full bg-cyan-500/[0.05] blur-[180px]" />
      </div>

      <header className="relative z-10 border-b border-white/[0.07] bg-[#071827]/70 backdrop-blur-xl">
        <div className="mx-auto flex h-[88px] max-w-[1188px] items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10">
              <HeartPulse
                size={28}
                className="text-emerald-400"
              />
            </div>

            <div>
              <h1 className="text-xl font-bold">
                SahayakAI
              </h1>

              <p className="text-xs text-slate-400">
                Community Healthcare
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>
        </div>
      </header>

      <section className="relative z-10 mx-auto w-full max-w-[1000px] px-8 pb-16 pt-12">
        <div className="mb-9">
          <p className="mb-3 text-sm font-semibold tracking-wide text-emerald-400">
            HOUSEHOLD DETAILS
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-[40px] font-bold tracking-tight">
                {houseName}
              </h2>

              <p className="mt-2 text-[17px] text-slate-400">
                Review household information before recording a visit.
              </p>
            </div>

            {household.priority === "High" && (
              <span className="w-fit rounded-full bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300">
                High Priority
              </span>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-8 backdrop-blur-xl">
          <div className="mb-7 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
              <Home
                size={23}
                className="text-emerald-400"
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold">
                Basic Household Information
              </h3>

              <p className="text-sm text-slate-400">
                Details collected during household registration
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <InfoCard
              icon={<Home size={18} />}
              label="House Number"
              value={houseName}
            />

            <InfoCard
              icon={<User size={18} />}
              label="Head Name"
              value={headName}
            />

            <InfoCard
              icon={<Phone size={18} />}
              label="Head Mobile Number"
              value={mobile}
            />

            <InfoCard
              icon={<CreditCard size={18} />}
              label="Voter ID"
              value={household.voterId || "Not provided"}
            />

            <InfoCard
              icon={<CreditCard size={18} />}
              label="Aadhaar Card"
              value={household.aadhaar || "Not provided"}
            />

            <InfoCard
              icon={<FileIcon />}
              label="Ration Card"
              value={household.rationCard || "Not provided"}
            />

            <div className="sm:col-span-2">
              <InfoCard
                icon={<MapPin size={18} />}
                label="Address"
                value={address}
              />
            </div>
          </div>
        </div>

        <div className="mt-7 rounded-3xl border border-white/[0.08] bg-white/[0.035] p-8 backdrop-blur-xl">
          <div className="mb-7 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10">
              <Users
                size={23}
                className="text-cyan-400"
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold">
                Family Information
              </h3>

              <p className="text-sm text-slate-400">
                Record important family health information
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <SelectField
              label="Any child under 5 years?"
              value={childrenUnderFive}
              onChange={setChildrenUnderFive}
              icon={<Baby size={18} />}
              options={["Yes", "No"]}
            />

            <SelectField
              label="Vaccination completed?"
              value={vaccination}
              onChange={setVaccination}
              icon={<Syringe size={18} />}
              options={[
                "Yes",
                "No",
                "Partially",
                "Not applicable",
              ]}
            />

            <SelectField
              label="Any pregnant woman?"
              value={pregnantWomen}
              onChange={setPregnantWomen}
              icon={<Heart size={18} />}
              options={["Yes", "No"]}
            />

            <SelectField
              label="Any postpartum woman?"
              value={postpartumWomen}
              onChange={setPostpartumWomen}
              icon={<CalendarHeart size={18} />}
              options={["Yes", "No"]}
            />
          </div>
        </div>

        <div className="mt-7 rounded-3xl border border-emerald-500/10 bg-emerald-500/[0.035] p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10">
                <Stethoscope
                  size={25}
                  className="text-emerald-400"
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold">
                  Health Visit
                </h3>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                  Continue to the health complaint section to record any
                  health issue reported by a family member.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleStartVisit}
              className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 font-semibold transition hover:bg-emerald-400"
            >
              Start Health Visit

              <ArrowLeft
                size={18}
                className="rotate-180"
              />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function HouseholdPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#061321] text-white">
          <p className="text-slate-400">
            Loading household...
          </p>
        </main>
      }
    >
      <HouseholdContent />
    </Suspense>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <span className="text-emerald-400">
          {icon}
        </span>

        {label}
      </div>

      <p className="mt-3 break-words text-[16px] font-medium text-white">
        {value}
      </p>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  icon,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon: React.ReactNode;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
        <span className="text-cyan-400">
          {icon}
        </span>

        {label}
      </span>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 w-full appearance-none rounded-2xl border border-white/[0.10] bg-white/[0.035] px-4 pr-11 text-sm text-white outline-none transition focus:border-emerald-400/60"
        >
          <option
            value=""
            className="bg-[#071827]"
          >
            Select an option
          </option>

          {options.map((option) => (
            <option
              key={option}
              value={option}
              className="bg-[#071827]"
            >
              {option}
            </option>
          ))}
        </select>

        <ChevronDown
          size={18}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
        />
      </div>
    </label>
  );
}

function FileIcon() {
  return <FileTextIcon />;
}

function FileTextIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h6" />
    </svg>
  );
}