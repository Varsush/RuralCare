"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  FileText,
  HeartPulse,
  MessageSquare,
  Stethoscope,
  UserRound,
} from "lucide-react";

type DoctorReview = {
  decision: string;
  assessment: string;
  remarks: string;
  reviewedAt: string;
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

  clinicalSummary?: string;

  reportedSymptoms?: string[];
  importantObservations?: string[];

  submittedAt?: string;
  status?: string;

  doctorReview?: DoctorReview;
};

export default function ReportsPage() {
  const router = useRouter();

  const [cases, setCases] = useState<DoctorCase[]>([]);
  const [selectedCase, setSelectedCase] =
    useState<DoctorCase | null>(null);

  useEffect(() => {
    const savedCases = localStorage.getItem(
      "sahayak_doctor_cases"
    );

    if (!savedCases) {
      setCases([]);
      return;
    }

    try {
      const parsed = JSON.parse(savedCases);

      if (Array.isArray(parsed)) {
        setCases(parsed);
      }
    } catch (error) {
      console.error(
        "Could not load doctor reports:",
        error
      );

      setCases([]);
    }
  }, []);

  const reviewedCases = cases.filter(
    (item) => item.doctorReview
  );

  return (
    <main className="min-h-screen bg-[#061321] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-[650px] w-[650px] rounded-full bg-emerald-500/[0.06] blur-[180px]" />

        <div className="absolute bottom-[-180px] right-[8%] h-[500px] w-[500px] rounded-full bg-cyan-500/[0.05] blur-[180px]" />
      </div>

      {/* Main */}
      <div className="relative z-10 min-h-screen lg:ml-[248px]">
        {/* Header */}
        <header className="border-b border-white/[0.07] bg-[#071827]/70 backdrop-blur-xl">
          <div className="mx-auto flex h-[88px] max-w-[1240px] items-center justify-between px-6 lg:px-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                ASHA REPORTS
              </p>

              <h1 className="mt-2 text-3xl font-bold">
                Doctor Reports
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                View clinical assessments submitted by doctors.
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="flex h-11 items-center gap-2 rounded-xl border border-white/[0.08] px-4 text-sm font-semibold text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
            >
              <ArrowLeft size={17} />
              Dashboard
            </button>
          </div>
        </header>

        {/* Content */}
        <section className="mx-auto max-w-[1240px] px-6 py-10 lg:px-10">
          {/* Summary */}
          <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10">
                  <ClipboardList
                    size={21}
                    className="text-cyan-400"
                  />
                </div>

                <div>
                  <p className="text-sm text-slate-400">
                    Total Cases
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    {cases.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.025] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
                  <CheckCircle2
                    size={21}
                    className="text-emerald-400"
                  />
                </div>

                <div>
                  <p className="text-sm text-slate-400">
                    Doctor Reviewed
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    {reviewedCases.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/[0.025] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10">
                  <Stethoscope
                    size={21}
                    className="text-cyan-400"
                  />
                </div>

                <div>
                  <p className="text-sm text-slate-400">
                    Awaiting Review
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    {cases.length - reviewedCases.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Reports */}
          {reviewedCases.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/[0.08] bg-white/[0.02] px-6 py-16 text-center">
              <FileText
                size={42}
                className="mx-auto text-slate-600"
              />

              <h2 className="mt-5 text-xl font-semibold">
                No doctor reports yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Once a doctor reviews a submitted case,
                the assessment will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {reviewedCases.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedCase(item)}
                  className="w-full rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 text-left transition hover:border-emerald-400/30 hover:bg-white/[0.04]"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
                          <HeartPulse
                            size={21}
                            className="text-emerald-400"
                          />
                        </div>

                        <div>
                          <h2 className="text-lg font-semibold">
                            {item.house ||
                              `House ${item.householdId}`}
                          </h2>

                          <p className="mt-1 text-sm text-slate-500">
                            {item.headName ||
                              "Household Head"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-3">
                        <span className="rounded-full border border-emerald-500/15 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
                          Doctor Reviewed
                        </span>

                        {item.doctorReview?.decision && (
                          <span className="rounded-full border border-cyan-500/15 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-300">
                            {item.doctorReview.decision}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        Reviewed
                      </p>

                      <p className="mt-1 text-sm text-slate-300">
                        {item.doctorReview?.reviewedAt
                          ? new Date(
                              item.doctorReview.reviewedAt
                            ).toLocaleDateString()
                          : "Date unavailable"}
                      </p>

                      <p className="mt-3 text-sm font-semibold text-emerald-400">
                        View Report →
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Selected Report */}
          {selectedCase && (
            <div className="mt-8 rounded-3xl border border-emerald-500/15 bg-white/[0.025] p-7 backdrop-blur-xl">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                    DOCTOR REPORT
                  </p>

                  <h2 className="mt-2 text-2xl font-bold">
                    {selectedCase.house ||
                      `House ${selectedCase.householdId}`}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {selectedCase.headName ||
                      "Household Head"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCase(null)}
                  className="text-sm font-semibold text-slate-500 transition hover:text-white"
                >
                  Close
                </button>
              </div>

              {/* Patient */}
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <InfoCard
                  icon={<UserRound size={17} />}
                  label="Patient"
                  value={
                    selectedCase.relationship ||
                    "Not available"
                  }
                />

                <InfoCard
                  icon={<MessageSquare size={17} />}
                  label="Complaint"
                  value={
                    selectedCase.complaint ||
                    "Not available"
                  }
                />
              </div>

              {/* Decision */}
              <div className="mt-6 rounded-2xl border border-cyan-500/15 bg-cyan-500/[0.025] p-6">
                <div className="flex items-center gap-3">
                  <Stethoscope
                    size={20}
                    className="text-cyan-400"
                  />

                  <h3 className="font-semibold">
                    Doctor's Decision
                  </h3>
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-200">
                  {selectedCase.doctorReview?.decision ||
                    "No decision recorded."}
                </p>
              </div>

              {/* Assessment */}
              <div className="mt-5 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
                <div className="flex items-center gap-3">
                  <FileText
                    size={20}
                    className="text-emerald-400"
                  />

                  <h3 className="font-semibold">
                    Doctor's Assessment
                  </h3>
                </div>

                <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-300">
                  {selectedCase.doctorReview?.assessment ||
                    "No assessment recorded."}
                </p>
              </div>

              {/* Remarks */}
              <div className="mt-5 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
                <div className="flex items-center gap-3">
                  <MessageSquare
                    size={20}
                    className="text-cyan-400"
                  />

                  <h3 className="font-semibold">
                    Doctor's Remarks
                  </h3>
                </div>

                <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-300">
                  {selectedCase.doctorReview?.remarks ||
                    "No additional remarks."}
                </p>
              </div>

              {/* Reviewed date */}
              <div className="mt-5 text-xs text-slate-500">
                Reviewed on{" "}
                {selectedCase.doctorReview?.reviewedAt
                  ? new Date(
                      selectedCase.doctorReview.reviewedAt
                    ).toLocaleString()
                  : "Date unavailable"}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
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

      <p className="mt-3 text-sm font-semibold text-white">
        {value}
      </p>
    </div>
  );
}