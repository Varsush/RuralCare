"use client";

import {
  Suspense,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  useSearchParams,
  useRouter,
} from "next/navigation";
import {
  ArrowLeft,
  Check,
  Edit3,
  FileText,
  HeartPulse,
  Image as ImageIcon,
  Save,
  Send,
  Sparkles,
  UserRound,
} from "lucide-react";

type Question = {
  id: number;
  question: string;
  options: string[];
};

type VisitData = {
  householdId: number;
  relationship: string;
  complaint: string;
  photo?: string | null;
  createdAt?: string;
  followUpQuestions?: Question[];
  followUpAnswers?: Record<number, string>;
};

type Household = {
  id: number;
  houseNumber?: string;
  house?: string;
  headName?: string;
  head?: string;
  mobile?: string;
  address?: string;
  location?: string;
};

function SummaryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const householdId = searchParams.get("id");

  const [visit, setVisit] =
    useState<VisitData | null>(null);

  const [household, setHousehold] =
    useState<Household | null>(null);

  const [summary, setSummary] =
    useState("");

  const [reportedSymptoms, setReportedSymptoms] =
    useState<string[]>([]);

  const [importantObservations, setImportantObservations] =
    useState<string[]>([]);

  const [editing, setEditing] =
    useState(false);

  const [submitted, setSubmitted] =
    useState(false);

  const [loadingSummary, setLoadingSummary] =
    useState(false);

  const [summaryError, setSummaryError] =
    useState("");

  useEffect(() => {
    if (!householdId) return;

    const loadVisitAndSummary = async () => {
      const savedVisit = localStorage.getItem(
        `sahayak_visit_${householdId}`
      );

      if (!savedVisit) {
        router.replace(
          `/dashboard/household/complaint?id=${householdId}`
        );
        return;
      }

      try {
        const parsedVisit: VisitData =
          JSON.parse(savedVisit);

        setVisit(parsedVisit);

        const savedHouseholds =
          localStorage.getItem(
            "sahayak_households"
          );

        if (savedHouseholds) {
          const households: Household[] =
            JSON.parse(savedHouseholds);

          const found = households.find(
            (item) =>
              String(item.id) ===
              householdId
          );

          if (found) {
            setHousehold(found);
          }
        }

        setLoadingSummary(true);
        setSummaryError("");

        const answers =
          parsedVisit.followUpAnswers || {};

        const questions =
          parsedVisit.followUpQuestions || [];

        const language =
          /[\u0C80-\u0CFF]/.test(
            parsedVisit.complaint
          )
            ? "Kannada"
            : "English";

        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
          throw new Error(
            "NEXT_PUBLIC_API_URL is not configured."
          );
        }

        const response = await fetch(
          `${apiUrl}/api/ai/summary`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              complaint:
                parsedVisit.complaint,

              relationship:
                parsedVisit.relationship,

              questions,

              answers:
                Object.fromEntries(
                  Object.entries(
                    answers
                  ).map(
                    ([key, value]) => [
                      String(key),
                      value,
                    ]
                  )
                ),

              language,
            }),
          }
        );

        if (!response.ok) {
          const errorText =
            await response.text();

          throw new Error(
            `Summary API failed: ${response.status} ${errorText}`
          );
        }

        const data =
          await response.json();

        setSummary(
          data.summary || ""
        );

        setReportedSymptoms(
          Array.isArray(
            data.reported_symptoms
          )
            ? data.reported_symptoms
            : []
        );

        setImportantObservations(
          Array.isArray(
            data.important_observations
          )
            ? data.important_observations
            : []
        );
      } catch (error) {
        console.error(
          "Could not load visit or generate summary:",
          error
        );

        setSummaryError(
          "Could not generate the AI clinical summary. Please try again."
        );
      } finally {
        setLoadingSummary(false);
      }
    };

    loadVisitAndSummary();
  }, [householdId, router]);

  const saveVisit = () => {
    if (
      !visit ||
      !householdId ||
      !summary.trim()
    ) {
      return;
    }

    const submittedAt =
      new Date().toISOString();

    const finalVisit = {
      ...visit,
      clinicalSummary: summary,
      reportedSymptoms,
      importantObservations,
      summaryEdited: editing,
      submittedAt,
      completedAt: submittedAt,
      status: "Completed",
      hasComplaint: true,
    };

    localStorage.setItem(
      `sahayak_visit_${householdId}`,
      JSON.stringify(finalVisit)
    );

    const savedHouseholds =
      localStorage.getItem(
        "sahayak_households"
      );

    if (savedHouseholds) {
      try {
        const households =
          JSON.parse(
            savedHouseholds
          );

        if (Array.isArray(households)) {
          const updatedHouseholds =
            households.map(
              (item) => {
                if (
                  String(item.id) ===
                  String(householdId)
                ) {
                  return {
                    ...item,
                    status: "Visited",
                    lastVisitAt:
                      submittedAt,
                  };
                }

                return item;
              }
            );

          localStorage.setItem(
            "sahayak_households",
            JSON.stringify(
              updatedHouseholds
            )
          );

          const updatedHousehold =
            updatedHouseholds.find(
              (item) =>
                String(item.id) ===
                String(householdId)
            );

          if (updatedHousehold) {
            setHousehold(
              updatedHousehold
            );
          }
        }
      } catch (error) {
        console.error(
          "Could not update household status:",
          error
        );
      }
    }

    const existingCases =
      localStorage.getItem(
        "sahayak_doctor_cases"
      );

    let cases: any[] = [];

    try {
      cases = existingCases
        ? JSON.parse(existingCases)
        : [];

      if (!Array.isArray(cases)) {
        cases = [];
      }
    } catch {
      cases = [];
    }

    const doctorCase = {
      id: `${householdId}-${Date.now()}`,
      householdId: Number(
        householdId
      ),

      house:
        household?.houseNumber ||
        household?.house ||
        "Household",

      headName:
        household?.headName ||
        household?.head ||
        "Household Head",

      mobile:
        household?.mobile || "",

      address:
        household?.address ||
        household?.location ||
        "",

      relationship:
        visit.relationship,

      complaint:
        visit.complaint,

      photo:
        visit.photo || null,

      followUpQuestions:
        visit.followUpQuestions ||
        [],

      followUpAnswers:
        visit.followUpAnswers ||
        {},

      clinicalSummary:
        summary,

      reportedSymptoms,

      importantObservations,

      submittedAt,

      status: "New",
    };

    localStorage.setItem(
      "sahayak_doctor_cases",
      JSON.stringify([
        ...cases,
        doctorCase,
      ])
    );

    setSubmitted(true);
  };

  if (!visit) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#061321] text-white">
        <p className="text-slate-400">
          Preparing clinical summary...
        </p>
      </main>
    );
  }

  const houseName =
    household?.houseNumber ||
    household?.house ||
    `House ${householdId}`;

  const headName =
    household?.headName ||
    household?.head ||
    "Household Head";

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#061321] text-white">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-emerald-500/[0.06] blur-[180px]" />
        </div>

        <section className="relative z-10 flex min-h-screen items-center justify-center px-8">
          <div className="w-full max-w-[620px] rounded-3xl border border-emerald-500/20 bg-white/[0.035] p-10 text-center backdrop-blur-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10">
              <Check
                size={32}
                className="text-emerald-400"
              />
            </div>

            <p className="mt-7 text-sm font-semibold tracking-wide text-emerald-400">
              VISIT COMPLETED
            </p>

            <h1 className="mt-3 text-3xl font-bold">
              Health Visit Submitted
            </h1>

            <p className="mx-auto mt-4 max-w-lg leading-7 text-slate-400">
              The clinical summary has been saved and the case is ready for the doctor to review.
            </p>

            <div className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 text-left">
              <p className="text-sm text-slate-500">
                Household
              </p>

              <p className="mt-1 font-semibold">
                {houseName}
              </p>

              <p className="mt-4 text-sm text-slate-500">
                Patient relationship
              </p>

              <p className="mt-1 font-semibold">
                {visit.relationship}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/dashboard"
                )
              }
              className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 font-semibold transition hover:bg-emerald-400"
            >
              Return to Dashboard

              <ArrowLeft
                size={18}
                className="rotate-180"
              />
            </button>
          </div>
        </section>
      </main>
    );
  }

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

          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Health Visit
            </p>

            <p className="mt-1 text-sm text-slate-300">
              Clinical Summary
            </p>
          </div>
        </div>
      </header>

      <section className="relative z-10 mx-auto w-full max-w-[1000px] px-8 pb-16 pt-12">
        <div className="mb-9">
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold tracking-wide text-emerald-400">
            <Sparkles size={17} />
            AI-ASSISTED SUMMARY
          </p>

          <h2 className="text-[40px] font-bold tracking-tight">
            Clinical Summary
          </h2>

          <p className="mt-3 text-[17px] leading-7 text-slate-400">
            Review the generated summary carefully. You can edit it before submitting the visit to the doctor.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <InfoCard
            icon={
              <HeartPulse size={19} />
            }
            label="Household"
            value={houseName}
          />

          <InfoCard
            icon={
              <UserRound size={19} />
            }
            label="Head"
            value={headName}
          />

          <InfoCard
            icon={
              <UserRound size={19} />
            }
            label="Relationship"
            value={
              visit.relationship
            }
          />
        </div>

        <div className="mt-7 rounded-3xl border border-white/[0.08] bg-white/[0.035] p-8 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10">
              <FileText
                size={23}
                className="text-cyan-400"
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold">
                Patient Complaint
              </h3>

              <p className="text-sm text-slate-400">
                Original statement recorded during the visit
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
            <p className="leading-7 text-slate-200">
              {visit.complaint}
            </p>
          </div>

          {visit.photo && (
            <div className="mt-5 flex items-center gap-3 text-sm text-cyan-300">
              <ImageIcon size={18} />
              Photo attached to this case
            </div>
          )}
        </div>

        <div className="mt-7 rounded-3xl border border-emerald-500/15 bg-emerald-500/[0.025] p-8 backdrop-blur-xl">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
                <Sparkles
                  size={23}
                  className="text-emerald-400"
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold">
                  AI Clinical Summary
                </h3>

                <p className="text-sm text-slate-400">
                  Review and correct before submission
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setEditing(
                  (previous) =>
                    !previous
                )
              }
              disabled={
                loadingSummary ||
                !summary
              }
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.025] px-4 text-sm font-semibold transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Edit3 size={17} />

              {editing
                ? "Done Editing"
                : "Edit Summary"}
            </button>
          </div>

          {loadingSummary && (
            <div className="mt-7 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.05] p-5">
              <div className="flex items-center gap-3">
                <Sparkles
                  size={20}
                  className="animate-pulse text-emerald-400"
                />

                <div>
                  <p className="font-semibold text-emerald-300">
                    Gemma is preparing the clinical summary...
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Please wait while the patient's complaint and follow-up responses are reviewed.
                  </p>
                </div>
              </div>
            </div>
          )}

          {summaryError && (
            <div className="mt-7 rounded-2xl border border-red-500/20 bg-red-500/[0.05] p-5">
              <p className="font-semibold text-red-300">
                Summary generation failed
              </p>

              <p className="mt-1 text-sm text-red-200/70">
                {summaryError}
              </p>
            </div>
          )}

          <textarea
            value={summary}
            onChange={(event) =>
              setSummary(
                event.target.value
              )
            }
            readOnly={!editing}
            placeholder={
              loadingSummary
                ? "Gemma is generating the clinical summary..."
                : "Clinical summary will appear here."
            }
            rows={16}
            className={`mt-7 w-full resize-none rounded-2xl border px-5 py-5 text-[15px] leading-8 outline-none transition ${
              editing
                ? "border-emerald-400/40 bg-white/[0.04] text-white"
                : "border-white/[0.08] bg-white/[0.02] text-slate-200"
            }`}
          />

          {reportedSymptoms.length >
            0 && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-slate-300">
                Reported Symptoms
              </h4>

              <div className="mt-3 flex flex-wrap gap-2">
                {reportedSymptoms.map(
                  (symptom, index) => (
                    <span
                      key={index}
                      className="rounded-lg border border-cyan-400/20 bg-cyan-400/[0.06] px-3 py-2 text-sm text-cyan-200"
                    >
                      {symptom}
                    </span>
                  )
                )}
              </div>
            </div>
          )}

          {importantObservations.length >
            0 && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-slate-300">
                Important Observations
              </h4>

              <ul className="mt-3 space-y-2">
                {importantObservations.map(
                  (
                    observation,
                    index
                  ) => (
                    <li
                      key={index}
                      className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm text-slate-300"
                    >
                      {observation}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}

          {editing && (
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
              <Save size={14} />
              Changes will be included when you submit the visit.
            </div>
          )}
        </div>

        <div className="mt-7 rounded-3xl border border-white/[0.08] bg-white/[0.025] p-7">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold">
                Ready to submit?
              </h3>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                Once submitted, this case will be marked as completed for the ASHA visit and made available to the doctor.
              </p>
            </div>

            <button
              type="button"
              onClick={saveVisit}
              disabled={
                loadingSummary ||
                !summary.trim()
              }
              className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 font-semibold transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Submit Visit
              <Send size={18} />
            </button>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={() =>
              router.push(
                `/dashboard/household/follow-up?id=${householdId}`
              )
            }
            className="flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to Follow-up
          </button>
        </div>

        <div className="mt-8 flex items-center justify-center gap-3 text-xs text-slate-500">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Check size={14} />
          </span>

          <span className="text-emerald-400">
            Health Complaint
          </span>

          <span className="h-px w-10 bg-white/[0.10]" />

          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Check size={14} />
          </span>

          <span className="text-emerald-400">
            AI Follow-up
          </span>

          <span className="h-px w-10 bg-white/[0.10]" />

          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white">
            3
          </span>

          <span className="text-emerald-400">
            Summary
          </span>
        </div>
      </section>
    </main>
  );
}

export default function SummaryPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#061321] text-white">
          <p className="text-slate-400">
            Loading clinical summary...
          </p>
        </main>
      }
    >
      <SummaryContent />
    </Suspense>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
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

      <p className="mt-3 truncate text-[16px] font-semibold text-white">
        {value}
      </p>
    </div>
  );
}