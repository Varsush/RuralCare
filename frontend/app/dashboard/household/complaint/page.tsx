"use client";

import {
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  useSearchParams,
  useRouter,
} from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  ChevronDown,
  HeartPulse,
  ImagePlus,
  UserRound,
  X,
} from "lucide-react";

type Household = {
  id: number;
  houseNumber?: string;
  house?: string;
  headName?: string;
  head?: string;
};

const relationships = [
  "Self",
  "Husband",
  "Wife",
  "Son",
  "Daughter",
  "Mother",
  "Father",
  "Brother",
  "Sister",
  "Grandparent",
  "Other",
];

function ComplaintContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const householdId = searchParams.get("id");

  const [household, setHousehold] =
    useState<Household | null>(null);

  const [relationship, setRelationship] =
    useState("");

  const [complaint, setComplaint] =
    useState("");

  const [photo, setPhoto] =
    useState<string | null>(null);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!householdId) return;

    const saved = localStorage.getItem(
      "sahayak_households"
    );

    if (saved) {
      try {
        const households: Household[] =
          JSON.parse(saved);

        const found = households.find(
          (item) =>
            String(item.id) === householdId
        );

        if (found) {
          setHousehold(found);
          return;
        }
      } catch (error) {
        console.error(
          "Could not read household:",
          error
        );
      }
    }

    const defaults: Household[] = [
      {
        id: 1,
        house: "House d33",
        head: "Dinesh",
      },
      {
        id: 2,
        house: "House 101",
        head: "Lakshmi",
      },
      {
        id: 3,
        house: "House 205",
        head: "Ramesh",
      },
    ];

    const foundDefault = defaults.find(
      (item) =>
        String(item.id) === householdId
    );

    setHousehold(foundDefault || null);
  }, [householdId]);

  const handlePhoto = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setPhoto(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const detectLanguage = (text: string) => {
    const kannadaCharacters =
      text.match(/[\u0C80-\u0CFF]/g);

    if (
      kannadaCharacters &&
      kannadaCharacters.length > 0
    ) {
      return "Kannada";
    }

    return "English";
  };

  const handleNext = () => {
    if (!relationship) {
      alert(
        "Please select the patient's relationship with the head."
      );
      return;
    }

    const cleanedComplaint =
      complaint.trim() ||
      "No specific complaint reported";

    const language =
      detectLanguage(cleanedComplaint);

    const visitData = {
      householdId: Number(householdId),
      relationship,
      complaint: cleanedComplaint,
      language,
      photo,
      createdAt:
        new Date().toISOString(),
    };

    localStorage.setItem(
      `sahayak_visit_${householdId}`,
      JSON.stringify(visitData)
    );

    localStorage.setItem(
      "sahayak_active_household",
      String(householdId)
    );

    router.push(
      `/dashboard/household/follow-up?id=${householdId}`
    );
  };

  if (!householdId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#061321] px-6 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Invalid household
          </h1>

          <button
            type="button"
            onClick={() =>
              router.push("/dashboard")
            }
            className="mt-6 rounded-xl bg-emerald-500 px-5 py-3 font-semibold"
          >
            Back to Dashboard
          </button>
        </div>
      </main>
    );
  }

  const houseName =
    household?.houseNumber ||
    household?.house ||
    "Selected Household";

  const headName =
    household?.headName ||
    household?.head ||
    "Household Head";

  return (
    <main className="min-h-screen bg-[#061321] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-[650px] w-[650px] rounded-full bg-emerald-500/[0.06] blur-[180px]" />

        <div className="absolute bottom-[-180px] right-[8%] h-[500px] w-[500px] rounded-full bg-cyan-500/[0.05] blur-[180px]" />
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
            onClick={() =>
              router.push(
                `/dashboard/household?id=${householdId}`
              )
            }
            className="flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Household
          </button>
        </div>
      </header>

      <section className="relative z-10 mx-auto w-full max-w-[900px] px-8 pb-16 pt-12">
        <div className="mb-9">
          <p className="mb-3 text-sm font-semibold tracking-wide text-emerald-400">
            HEALTH VISIT
          </p>

          <h2 className="text-[40px] font-bold tracking-tight">
            Health Complaint
          </h2>

          <p className="mt-3 text-[17px] text-slate-400">
            Record the health issue reported by a family member.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-2 text-sm text-slate-300">
              {houseName}
            </span>

            <span className="rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-2 text-sm text-slate-400">
              Head: {headName}
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-8 backdrop-blur-xl">
          <div className="mb-7 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
              <UserRound
                size={23}
                className="text-emerald-400"
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold">
                Patient Information
              </h3>

              <p className="text-sm text-slate-400">
                Tell us who is experiencing the health issue.
              </p>
            </div>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">
              Relationship with household head{" "}
              <span className="text-emerald-400">
                *
              </span>
            </span>

            <div className="relative">
              <select
                value={relationship}
                onChange={(event) =>
                  setRelationship(
                    event.target.value
                  )
                }
                className="h-13 w-full appearance-none rounded-2xl border border-white/[0.10] bg-white/[0.035] px-5 pr-12 text-sm text-white outline-none transition focus:border-emerald-400/60"
              >
                <option
                  value=""
                  className="bg-[#071827]"
                >
                  Select relationship
                </option>

                {relationships.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                      className="bg-[#071827]"
                    >
                      {item}
                    </option>
                  )
                )}
              </select>

              <ChevronDown
                size={19}
                className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-slate-500"
              />
            </div>
          </label>
        </div>

        <div className="mt-7 rounded-3xl border border-white/[0.08] bg-white/[0.035] p-8 backdrop-blur-xl">
          <div className="mb-7">
            <h3 className="text-xl font-semibold">
              What is going on?
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Enter the health issue reported by the patient.
            </p>
          </div>

          <textarea
            value={complaint}
            onChange={(event) =>
              setComplaint(
                event.target.value
              )
            }
            placeholder="Type what the patient is experiencing..."
            rows={7}
            className="w-full resize-none rounded-2xl border border-white/[0.10] bg-white/[0.025] px-5 py-4 text-[15px] leading-7 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/60 focus:bg-white/[0.04]"
          />

          <div className="mt-7 border-t border-white/[0.08] pt-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="font-semibold">
                  Add a photo
                </h4>

                <p className="mt-1 text-sm text-slate-400">
                  Optional. Useful for visible conditions such as skin problems or wounds.
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhoto}
                className="hidden"
              />

              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="flex h-12 items-center justify-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.025] px-5 text-sm font-semibold transition hover:bg-white/[0.06]"
              >
                <Camera size={18} />
                Take / Add Photo
              </button>
            </div>

            {photo && (
              <div className="relative mt-5 w-fit overflow-hidden rounded-2xl border border-white/[0.10]">
                <img
                  src={photo}
                  alt="Health issue"
                  className="h-48 w-48 object-cover"
                />

                <button
                  type="button"
                  onClick={() =>
                    setPhoto(null)
                  }
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {!photo && (
              <div className="mt-5 flex items-center gap-3 text-xs text-slate-500">
                <ImagePlus size={16} />
                No photo added
              </div>
            )}
          </div>
        </div>

        <div className="mt-7 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() =>
              router.push(
                `/dashboard/household?id=${householdId}`
              )
            }
            className="flex h-12 items-center gap-2 rounded-xl border border-white/[0.12] px-5 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="flex h-12 items-center gap-3 rounded-xl bg-emerald-500 px-7 text-sm font-semibold transition hover:bg-emerald-400"
          >
            Next
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="mt-7 flex items-center justify-center gap-3 text-xs text-slate-500">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Check size={14} />
          </span>

          <span className="text-emerald-400">
            Health Complaint
          </span>

          <span className="h-px w-10 bg-white/[0.10]" />

          <span className="h-7 w-7 rounded-full border border-white/[0.12] text-center leading-7">
            2
          </span>

          <span>AI Follow-up</span>

          <span className="h-px w-10 bg-white/[0.10]" />

          <span className="h-7 w-7 rounded-full border border-white/[0.12] text-center leading-7">
            3
          </span>

          <span>Summary</span>
        </div>
      </section>
    </main>
  );
}

export default function ComplaintPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#061321] text-white">
          <p className="text-slate-400">
            Loading health complaint...
          </p>
        </main>
      }
    >
      <ComplaintContent />
    </Suspense>
  );
}