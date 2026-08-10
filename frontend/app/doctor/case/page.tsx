"use client";

import {
  Suspense,
  useEffect,
  useState,
} from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  Activity,
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  FileText,
  HeartPulse,
  Home,
  MapPin,
  MessageSquare,
  Stethoscope,
  UserRound,
} from "lucide-react";

type Question = {
  id: number;
  question: string;
  options: string[];
};

type DoctorCase = {
  id: string;
  householdId: number;
  house?: string;
  headName?: string;
  mobile?: string;
  address?: string;
  relationship?: string;
  complaint?: string;
  photo?: string | null;
  followUpQuestions?: Question[];
  followUpAnswers?: Record<number, string>;
  clinicalSummary?: string;
  reportedSymptoms?: string[];
  importantObservations?: string[];
  submittedAt?: string;
  status?: string;
};

function DoctorCaseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const caseId = searchParams.get("id");

  const [patientCase, setPatientCase] =
    useState<DoctorCase | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (!caseId) {
      setLoading(false);
      return;
    }

    const savedCases =
      localStorage.getItem(
        "sahayak_doctor_cases"
      );

    if (!savedCases) {
      setLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(
        savedCases
      );

      if (!Array.isArray(parsed)) {
        setLoading(false);
        return;
      }

      const foundCase = parsed.find(
        (item: DoctorCase) =>
          String(item.id) ===
          String(caseId)
      );

      if (foundCase) {
        setPatientCase(foundCase);
      }
    } catch (error) {
      console.error(
        "Could not load patient case:",
        error
      );
    }

    setLoading(false);
  }, [caseId]);

  const formatDate = (
    date?: string
  ) => {
    if (!date) {
      return "Not available";
    }

    try {
      return new Date(
        date
      ).toLocaleString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      return "Not available";
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#061321] text-white">
        <div className="text-center">
          <HeartPulse
            size={36}
            className="mx-auto animate-pulse text-emerald-400"
          />

          <p className="mt-4 text-sm text-slate-400">
            Loading patient case...
          </p>
        </div>
      </main>
    );
  }

  if (!patientCase) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#061321] px-6 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Case not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            This patient case could not be found.
          </p>

          <button
            type="button"
            onClick={() =>
              router.push("/doctor")
            }
            className="mt-6 flex h-11 items-center gap-2 rounded-xl bg-emerald-500 px-5 text-sm font-semibold"
          >
            <ArrowLeft size={17} />
            Back to Doctor Dashboard
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#061321] text-white">
      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#061321]/90 backdrop-blur-xl">
        <div className="flex h-[78px] items-center justify-between px-5 sm:px-8">
          <button
            type="button"
            onClick={() =>
              router.push("/doctor")
            }
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-400 hover:bg-white/[0.04] hover:text-white"
          >
            <ArrowLeft size={18} />
            Doctor Dashboard
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
              <Stethoscope
                size={20}
                className="text-emerald-400"
              />
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-semibold">
                Doctor Portal
              </p>

              <p className="text-xs text-slate-500">
                Patient Case
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:px-10">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
            Patient Case
          </p>

          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            {patientCase.house ||
              `House ${patientCase.householdId}`}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Complete information collected during the ASHA visit.
          </p>
        </div>

        <Section
          icon={<Home size={20} />}
          title="Household Information"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoCard
              icon={<Home size={17} />}
              label="House"
              value={
                patientCase.house ||
                `House ${patientCase.householdId}`
              }
            />

            <InfoCard
              icon={<UserRound size={17} />}
              label="Household Head"
              value={
                patientCase.headName ||
                "Not available"
              }
            />

            <InfoCard
              icon={<MapPin size={17} />}
              label="Address"
              value={
                patientCase.address ||
                "Not available"
              }
            />

            <InfoCard
              icon={
                <MessageSquare size={17} />
              }
              label="Mobile"
              value={
                patientCase.mobile ||
                "Not available"
              }
            />
          </div>
        </Section>

        <Section
          icon={<UserRound size={20} />}
          title="Patient Information"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoCard
              label="Relationship with Household Head"
              value={
                patientCase.relationship ||
                "Not specified"
              }
            />

            <InfoCard
              icon={
                <CalendarDays size={17} />
              }
              label="Visit Submitted"
              value={formatDate(
                patientCase.submittedAt
              )}
            />
          </div>
        </Section>

        <Section
          icon={<FileText size={20} />}
          title="Reported Complaint"
        >
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
            <p className="text-base leading-7 text-slate-200">
              {patientCase.complaint ||
                "No complaint recorded."}
            </p>
          </div>
        </Section>

        <Section
          icon={<ClipboardList size={20} />}
          title="Follow-up Responses"
        >
          {!patientCase.followUpQuestions ||
          patientCase.followUpQuestions
            .length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/[0.08] p-6 text-sm text-slate-500">
              No follow-up questions recorded.
            </div>
          ) : (
            <div className="space-y-4">
              {patientCase.followUpQuestions.map(
                (question) => {
                  const answer =
                    patientCase
                      .followUpAnswers?.[
                      question.id
                    ];

                  return (
                    <div
                      key={question.id}
                      className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5"
                    >
                      <div className="flex gap-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-sm font-bold text-emerald-400">
                          {question.id}
                        </div>

                        <div className="flex-1">
                          <p className="text-sm font-semibold leading-6 text-slate-200">
                            {question.question}
                          </p>

                          <div className="mt-3 rounded-xl border border-emerald-500/10 bg-emerald-500/[0.035] px-4 py-3">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                              Patient Answer
                            </p>

                            <p className="mt-1 text-sm text-slate-300">
                              {answer ||
                                "No answer recorded."}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </Section>

        {patientCase.reportedSymptoms &&
          patientCase.reportedSymptoms
            .length > 0 && (
            <Section
              icon={<Activity size={20} />}
              title="Reported Symptoms"
            >
              <div className="flex flex-wrap gap-2">
                {patientCase.reportedSymptoms.map(
                  (symptom, index) => (
                    <span
                      key={`${symptom}-${index}`}
                      className="rounded-full border border-emerald-500/15 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300"
                    >
                      {symptom}
                    </span>
                  )
                )}
              </div>
            </Section>
          )}

        {patientCase.importantObservations &&
          patientCase
            .importantObservations.length >
            0 && (
            <Section
              icon={<Activity size={20} />}
              title="Important Observations"
            >
              <div className="space-y-2">
                {patientCase.importantObservations.map(
                  (
                    observation,
                    index
                  ) => (
                    <div
                      key={`${observation}-${index}`}
                      className="rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-3 text-sm text-slate-300"
                    >
                      {observation}
                    </div>
                  )
                )}
              </div>
            </Section>
          )}

        <Section
          icon={<HeartPulse size={20} />}
          title="AI-Generated Summary"
        >
          <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.035] p-6">
            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-200">
              {patientCase.clinicalSummary ||
                "No AI summary available."}
            </p>
          </div>
        </Section>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/[0.07] pt-6 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={() =>
              router.push("/doctor")
            }
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-white/[0.08] px-6 text-sm font-semibold text-slate-400 hover:bg-white/[0.04] hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to Cases
          </button>

          <button
            type="button"
            onClick={() =>
              router.push(
                `/doctor/review?id=${encodeURIComponent(
                  patientCase.id
                )}`
              )
            }
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-7 text-sm font-bold text-white hover:bg-emerald-400"
          >
            Review Case
            <ArrowRightIcon />
          </button>
        </div>
      </section>
    </main>
  );
}

export default function DoctorCasePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#061321] text-white">
          <div className="text-center">
            <HeartPulse
              size={36}
              className="mx-auto animate-pulse text-emerald-400"
            />

            <p className="mt-4 text-sm text-slate-400">
              Loading patient case...
            </p>
          </div>
        </main>
      }
    >
      <DoctorCaseContent />
    </Suspense>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
          {icon}
        </div>

        <h2 className="text-lg font-bold">
          {title}
        </h2>
      </div>

      {children}
    </section>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
      <div className="flex items-center gap-2">
        {icon && (
          <span className="text-emerald-400">
            {icon}
          </span>
        )}

        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
          {label}
        </p>
      </div>

      <p className="mt-2 text-sm font-semibold leading-6 text-slate-300">
        {value}
      </p>
    </div>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}