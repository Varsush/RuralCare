"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  FileText,
  HeartPulse,
  Image as ImageIcon,
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

  /* IMPORTANT:
     Complaint photo */
  photo?: string | null;

  followUpQuestions?: Question[];
  followUpAnswers?: Record<number, string>;

  clinicalSummary?: string;

  reportedSymptoms?: string[];
  importantObservations?: string[];

  submittedAt?: string;
  status?: string;

  doctorReview?: {
    decision: string;
    assessment: string;
    remarks: string;
    reviewedAt: string;
  };
};

export default function DoctorReviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const caseId = searchParams.get("id");

  const [patientCase, setPatientCase] =
    useState<DoctorCase | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [decision, setDecision] =
    useState("");

  const [assessment, setAssessment] =
    useState("");

  const [remarks, setRemarks] =
    useState("");

  /* =========================================
     LOAD CASE
  ========================================= */

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
      const parsed = JSON.parse(savedCases);

      if (!Array.isArray(parsed)) {
        setLoading(false);
        return;
      }

      const foundCase = parsed.find(
        (item: DoctorCase) =>
          String(item.id) === String(caseId)
      );

      if (foundCase) {
        setPatientCase(foundCase);

        if (foundCase.doctorReview) {
          setDecision(
            foundCase.doctorReview.decision
          );

          setAssessment(
            foundCase.doctorReview.assessment
          );

          setRemarks(
            foundCase.doctorReview.remarks
          );
        }
      }
    } catch (error) {
      console.error(
        "Could not load case:",
        error
      );
    }

    setLoading(false);
  }, [caseId]);

  /* =========================================
     SUBMIT REVIEW
  ========================================= */

  const handleSubmitReview = () => {
    if (!patientCase) return;

    if (!decision) {
      alert(
        "Please select a review decision."
      );
      return;
    }

    if (!assessment.trim()) {
      alert(
        "Please enter the doctor's assessment."
      );
      return;
    }

    setSaving(true);

    try {
      const savedCases =
        localStorage.getItem(
          "sahayak_doctor_cases"
        );

      if (!savedCases) {
        throw new Error(
          "Cases not found."
        );
      }

      const parsed = JSON.parse(
        savedCases
      );

      if (!Array.isArray(parsed)) {
        throw new Error(
          "Invalid cases data."
        );
      }

      const updatedCases = parsed.map(
        (item: DoctorCase) => {
          if (
            String(item.id) !==
            String(patientCase.id)
          ) {
            return item;
          }

          return {
            ...item,

            status: "Reviewed",

            doctorReview: {
              decision,
              assessment:
                assessment.trim(),
              remarks:
                remarks.trim(),
              reviewedAt:
                new Date().toISOString(),
            },
          };
        }
      );

      localStorage.setItem(
        "sahayak_doctor_cases",
        JSON.stringify(updatedCases)
      );

      router.push("/doctor");
    } catch (error) {
      console.error(
        "Could not save doctor review:",
        error
      );

      alert(
        "Could not save the review. Please try again."
      );

      setSaving(false);
    }
  };

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#061321] text-white">

        <div className="text-center">

          <HeartPulse
            size={36}
            className="mx-auto animate-pulse text-emerald-400"
          />

          <p className="mt-4 text-sm text-slate-400">
            Loading case...
          </p>

        </div>

      </main>
    );
  }

  /* =========================================
     CASE NOT FOUND
  ========================================= */

  if (!patientCase) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#061321] px-6 text-white">

        <div className="text-center">

          <FileText
            size={42}
            className="mx-auto text-slate-600"
          />

          <h1 className="mt-5 text-2xl font-bold">
            Case not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            This case could not be loaded.
          </p>

          <button
            type="button"
            onClick={() =>
              router.push("/doctor")
            }
            className="mt-6 flex h-11 items-center gap-2 rounded-xl bg-emerald-500 px-5 text-sm font-semibold"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </button>

        </div>

      </main>
    );
  }

  /* =========================================
     MAIN PAGE
  ========================================= */

  return (
    <main className="min-h-screen bg-[#061321] text-white">

      {/* HEADER */}

      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#061321]/90 backdrop-blur-xl">

        <div className="flex h-[78px] items-center justify-between px-5 sm:px-8 lg:px-10">

          <button
            type="button"
            onClick={() =>
              router.push(
                `/doctor/case?id=${encodeURIComponent(
                  patientCase.id
                )}`
              )
            }
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Case
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
                Doctor Review
              </p>

              <p className="text-xs text-slate-500">
                Clinical Assessment
              </p>

            </div>

          </div>

        </div>

      </header>

      {/* CONTENT */}

      <section className="mx-auto max-w-4xl px-5 py-8 sm:px-8 lg:px-10">

        {/* TITLE */}

        <div className="mb-8">

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
            Clinical Review
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Review Patient Case
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Review the information collected during
            the ASHA visit and record your assessment.
          </p>

        </div>

        {/* =====================================
            PATIENT SUMMARY
        ===================================== */}

        <section className="mb-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">

              <UserRound
                size={20}
                className="text-emerald-400"
              />

            </div>

            <div>

              <p className="text-xs uppercase tracking-wider text-slate-600">
                Patient
              </p>

              <h2 className="mt-1 text-lg font-bold">
                {patientCase.relationship ||
                  "Patient"}
              </h2>

            </div>

          </div>

          <div className="mt-5 rounded-xl border border-white/[0.06] bg-black/10 p-4">

            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Reported Complaint
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-200">
              {patientCase.complaint ||
                "No complaint recorded."}
            </p>

          </div>

        </section>

        {/* =====================================
            ATTACHED COMPLAINT IMAGE
        ===================================== */}

        <section className="mb-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">

              <ImageIcon
                size={19}
                className="text-cyan-400"
              />

            </div>

            <div>

              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Complaint Image
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Image attached during the ASHA visit
              </p>

            </div>

          </div>

          {patientCase.photo ? (

            <div className="mt-5 overflow-hidden rounded-2xl border border-white/[0.08] bg-black/20">

              <img
                src={patientCase.photo}
                alt="Image attached with patient complaint"
                className="max-h-[500px] w-full object-contain"
              />

            </div>

          ) : (

            <div className="mt-5 flex min-h-[180px] items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-black/10">

              <div className="text-center">

                <ImageIcon
                  size={32}
                  className="mx-auto text-slate-600"
                />

                <p className="mt-3 text-sm text-slate-500">
                  No image was attached
                </p>

              </div>

            </div>

          )}

        </section>

        {/* =====================================
            AI SUMMARY
        ===================================== */}

        <section className="mb-6 rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.035] p-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">

              <HeartPulse
                size={19}
                className="text-emerald-400"
              />

            </div>

            <div>

              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                AI-Generated Summary
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Information generated from the ASHA
                visit data
              </p>

            </div>

          </div>

          <p className="mt-5 text-sm leading-7 text-slate-200">
            {patientCase.clinicalSummary ||
              "No AI summary available."}
          </p>

        </section>

        {/* =====================================
            SYMPTOMS
        ===================================== */}

        {patientCase.reportedSymptoms &&
          patientCase.reportedSymptoms.length > 0 && (

            <section className="mb-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">

              <div className="flex items-center gap-2">

                <Activity
                  size={18}
                  className="text-emerald-400"
                />

                <h2 className="font-bold">
                  Reported Symptoms
                </h2>

              </div>

              <div className="mt-4 flex flex-wrap gap-2">

                {patientCase.reportedSymptoms.map(
                  (symptom, index) => (

                    <span
                      key={`${symptom}-${index}`}
                      className="rounded-full border border-emerald-500/15 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300"
                    >
                      {symptom}
                    </span>

                  )
                )}

              </div>

            </section>

          )}

        {/* =====================================
            OBSERVATIONS
        ===================================== */}

        {patientCase.importantObservations &&
          patientCase.importantObservations.length > 0 && (

            <section className="mb-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">

              <div className="flex items-center gap-2">

                <Activity
                  size={18}
                  className="text-emerald-400"
                />

                <h2 className="font-bold">
                  Important Observations
                </h2>

              </div>

              <div className="mt-4 space-y-2">

                {patientCase.importantObservations.map(
                  (observation, index) => (

                    <div
                      key={`${observation}-${index}`}
                      className="rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-3 text-sm text-slate-300"
                    >
                      {observation}
                    </div>

                  )
                )}

              </div>

            </section>

          )}

        {/* =====================================
            DOCTOR DECISION
        ===================================== */}

        <section className="mb-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6">

          <div className="mb-5">

            <div className="flex items-center gap-2">

              <Stethoscope
                size={19}
                className="text-emerald-400"
              />

              <h2 className="text-lg font-bold">
                Doctor's Review
              </h2>

            </div>

            <p className="mt-2 text-sm text-slate-500">
              Record your clinical assessment based
              on the information available.
            </p>

          </div>

          {/* DECISION */}

          <div>

            <label className="mb-3 block text-sm font-semibold text-slate-300">
              Review Decision
            </label>

            <div className="grid gap-3 sm:grid-cols-3">

              <DecisionButton
                selected={
                  decision ===
                  "Needs Further Evaluation"
                }
                onClick={() =>
                  setDecision(
                    "Needs Further Evaluation"
                  )
                }
                title="Needs Further Evaluation"
                description="More clinical evaluation is needed."
              />

              <DecisionButton
                selected={
                  decision ===
                  "Routine Follow-up"
                }
                onClick={() =>
                  setDecision(
                    "Routine Follow-up"
                  )
                }
                title="Routine Follow-up"
                description="Continue routine monitoring."
              />

              <DecisionButton
                selected={
                  decision ===
                  "Urgent Attention"
                }
                onClick={() =>
                  setDecision(
                    "Urgent Attention"
                  )
                }
                title="Urgent Attention"
                description="Requires prompt medical attention."
              />

            </div>

          </div>

          {/* ASSESSMENT */}

          <div className="mt-6">

            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Doctor's Assessment
            </label>

            <textarea
              value={assessment}
              onChange={(e) =>
                setAssessment(
                  e.target.value
                )
              }
              placeholder="Enter your clinical assessment..."
              rows={6}
              className="w-full resize-none rounded-xl border border-white/[0.08] bg-black/10 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:border-emerald-500/40"
            />

          </div>

          {/* REMARKS */}

          <div className="mt-5">

            <label className="mb-2 block text-sm font-semibold text-slate-300">

              Additional Remarks

              <span className="ml-2 text-xs font-normal text-slate-600">
                Optional
              </span>

            </label>

            <textarea
              value={remarks}
              onChange={(e) =>
                setRemarks(
                  e.target.value
                )
              }
              placeholder="Add any additional remarks..."
              rows={4}
              className="w-full resize-none rounded-xl border border-white/[0.08] bg-black/10 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:border-emerald-500/40"
            />

          </div>

        </section>

        {/* =====================================
            SUBMIT
        ===================================== */}

        <div className="flex flex-col gap-3 border-t border-white/[0.07] pt-6 sm:flex-row sm:justify-between">

          <button
            type="button"
            onClick={() =>
              router.push(
                `/doctor/case?id=${encodeURIComponent(
                  patientCase.id
                )}`
              )
            }
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-white/[0.08] px-6 text-sm font-semibold text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to Case
          </button>

          <button
            type="button"
            onClick={handleSubmitReview}
            disabled={saving}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-7 text-sm font-bold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >

            {saving ? (
              <>
                <HeartPulse
                  size={18}
                  className="animate-pulse"
                />
                Saving Review...
              </>
            ) : (
              <>
                <CheckCircle2 size={18} />
                Submit Review
              </>
            )}

          </button>

        </div>

      </section>

    </main>
  );
}

/* =============================================
   DECISION BUTTON
============================================= */

function DecisionButton({
  selected,
  onClick,
  title,
  description,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        rounded-xl border p-4 text-left transition
        ${
          selected
            ? "border-emerald-400 bg-emerald-500/10"
            : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15]"
        }
      `}
    >

      <div className="flex items-start gap-3">

        <div
          className={`
            mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border
            ${
              selected
                ? "border-emerald-400 bg-emerald-400"
                : "border-slate-600"
            }
          `}
        >

          {selected && (
            <div className="h-2 w-2 rounded-full bg-[#061321]" />
          )}

        </div>

        <div>

          <p
            className={`text-sm font-semibold ${
              selected
                ? "text-emerald-300"
                : "text-slate-300"
            }`}
          >
            {title}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-600">
            {description}
          </p>

        </div>

      </div>

    </button>
  );
}