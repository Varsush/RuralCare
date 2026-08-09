"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileText,
  HeartPulse,
  Home,
  UserRound,
} from "lucide-react";

type VisitData = {
  householdId: number;
  relationship?: string;
  complaint?: string;
  photo?: string | null;
  language?: string;

  hasComplaint?: boolean;
  visitType?: string;
  status?: string;

  createdAt?: string;
  completedAt?: string;

  clinicalSummary?: string;

  followUpQuestions?: {
    id: number;
    question: string;
    options: string[];
  }[];

  followUpAnswers?: Record<
    number,
    string
  >;
};

type Household = {
  id: number;
  house?: string;
  houseNumber?: string;
  head?: string;
  headName?: string;
  address?: string;
  location?: string;
};

export default function ViewVisitPage() {
  const router = useRouter();

  const searchParams =
    useSearchParams();

  const householdId =
    searchParams.get("id");

  const [visit, setVisit] =
    useState<VisitData | null>(null);

  const [household, setHousehold] =
    useState<Household | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (!householdId) {
      router.replace(
        "/dashboard/household"
      );
      return;
    }

    try {
      

      const savedVisit =
        localStorage.getItem(
          `sahayak_visit_${householdId}`
        );

      if (savedVisit) {
        setVisit(
          JSON.parse(savedVisit)
        );
      }

      

      const savedHouseholds =
        localStorage.getItem(
          "sahayak_households"
        );

      if (savedHouseholds) {
        const households =
          JSON.parse(savedHouseholds);

        if (Array.isArray(households)) {
          const found =
            households.find(
              (item: Household) =>
                String(item.id) ===
                householdId
            );

          if (found) {
            setHousehold(found);
          }
        }
      }
    } catch (error) {
      console.error(
        "Could not load visit:",
        error
      );
    }

    setLoading(false);
  }, [householdId, router]);

  

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#061321] text-white">

        <p className="text-slate-400">
          Loading visit...
        </p>

      </main>
    );
  }

 

  if (!visit) {
    return (
      <main className="min-h-screen bg-[#061321] px-8 py-12 text-white">

        <div className="mx-auto max-w-[900px]">

          <button
            onClick={() =>
              router.push(
                "/dashboard/household"
              )
            }
            className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >

            <ArrowLeft size={18} />

            Back to Households

          </button>

          <div className="mt-12 rounded-3xl border border-white/[0.08] bg-white/[0.035] p-10 text-center">

            <FileText
              size={42}
              className="mx-auto text-slate-500"
            />

            <h1 className="mt-5 text-2xl font-bold">
              No visit recorded
            </h1>

            <p className="mt-3 text-sm text-slate-400">
              This household does not have a
              completed visit record yet.
            </p>

          </div>

        </div>

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

  const location =
    household?.address ||
    household?.location ||
    "Address not available";

  const completedDate =
    visit.completedAt ||
    visit.createdAt;

  return (
    <main className="min-h-screen bg-[#061321] text-white">

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute -left-40 top-0 h-[650px] w-[650px] rounded-full bg-emerald-500/[0.06] blur-[180px]" />

        <div className="absolute bottom-[-180px] right-[10%] h-[500px] w-[500px] rounded-full bg-cyan-500/[0.05] blur-[180px]" />

      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/[0.07] bg-[#071827]/80 backdrop-blur-xl">

        <div className="mx-auto flex h-[88px] max-w-[1000px] items-center justify-between px-8">

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
            onClick={() =>
              router.push(
                "/dashboard/household"
              )
            }
            className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >

            <ArrowLeft size={18} />

            Back

          </button>

        </div>

      </header>

      {/* Content */}
      <section className="relative z-10 mx-auto w-full max-w-[900px] px-8 pb-16 pt-12">

        {/* Heading */}
        <div className="mb-9">

          <p className="mb-3 text-sm font-semibold tracking-wide text-emerald-400">
            VISIT DETAILS
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <h2 className="text-[40px] font-bold tracking-tight">
                {houseName}
              </h2>

              <p className="mt-2 text-[17px] text-slate-400">
                Report recorded during the household visit
              </p>

            </div>

            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300">

              <CheckCircle2 size={18} />

              Visit Completed

            </div>

          </div>

        </div>

        {/* Household information */}
        <div className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-7 backdrop-blur-xl">

          <div className="mb-6 flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">

              <Home
                size={22}
                className="text-emerald-400"
              />

            </div>

            <div>

              <h3 className="text-xl font-semibold">
                Household Information
              </h3>

              <p className="text-sm text-slate-400">
                Household details
              </p>

            </div>

          </div>

          <div className="grid gap-6 sm:grid-cols-2">

            <div>

              <p className="text-xs text-slate-500">
                Household
              </p>

              <p className="mt-2 font-semibold">
                {houseName}
              </p>

            </div>

            <div>

              <p className="text-xs text-slate-500">
                Household Head
              </p>

              <p className="mt-2 flex items-center gap-2 font-semibold">

                <UserRound size={16} />

                {headName}

              </p>

            </div>

            <div>

              <p className="text-xs text-slate-500">
                Location
              </p>

              <p className="mt-2 font-semibold">
                {location}
              </p>

            </div>

            <div>

              <p className="text-xs text-slate-500">
                Visit Time
              </p>

              <p className="mt-2 flex items-center gap-2 font-semibold">

                <Clock3 size={16} />

                {completedDate
                  ? new Date(
                      completedDate
                    ).toLocaleString()
                  : "Not available"}

              </p>

            </div>

          </div>

        </div>

       

        {!visit.hasComplaint ? (

          <div className="mt-7 rounded-3xl border border-emerald-400/20 bg-emerald-500/[0.06] p-8">

            <div className="flex items-start gap-4">

              <CheckCircle2
                size={25}
                className="mt-1 shrink-0 text-emerald-400"
              />

              <div>

                <h3 className="text-xl font-semibold text-emerald-300">
                  No Health Complaint
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  No health complaint was reported
                  by anyone in the household during
                  this visit.
                </p>

              </div>

            </div>

          </div>

        ) : (

          <>
            {/* Patient */}
            <div className="mt-7 rounded-3xl border border-white/[0.08] bg-white/[0.035] p-7">

              <h3 className="text-xl font-semibold">
                Patient Information
              </h3>

              <div className="mt-6">

                <p className="text-xs text-slate-500">
                  Relationship with household head
                </p>

                <p className="mt-2 font-semibold">
                  {visit.relationship ||
                    "Not specified"}
                </p>

              </div>

            </div>

            {/* Complaint */}
            <div className="mt-7 rounded-3xl border border-white/[0.08] bg-white/[0.035] p-7">

              <div className="flex items-center gap-3">

                <FileText
                  size={21}
                  className="text-emerald-400"
                />

                <h3 className="text-xl font-semibold">
                  Reported Health Complaint
                </h3>

              </div>

              <div className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">

                <p className="whitespace-pre-wrap text-[16px] leading-8 text-slate-200">
                  {visit.complaint ||
                    "No complaint recorded."}
                </p>

              </div>

              {visit.language && (
                <p className="mt-4 text-xs text-slate-500">
                  Language:{" "}
                  <span className="text-slate-300">
                    {visit.language}
                  </span>
                </p>
              )}

            </div>

            {/* Follow-up answers */}
            {visit.followUpQuestions &&
              visit.followUpQuestions.length >
                0 && (

              <div className="mt-7 rounded-3xl border border-white/[0.08] bg-white/[0.035] p-7">

                <h3 className="text-xl font-semibold">
                  Follow-up Responses
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  Information collected during the AI-assisted follow-up.
                </p>

                <div className="mt-6 space-y-5">

                  {visit.followUpQuestions.map(
                    (question) => (

                      <div
                        key={question.id}
                        className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5"
                      >

                        <p className="text-sm font-semibold text-slate-200">
                          {question.id}.{" "}
                          {question.question}
                        </p>

                        <p className="mt-3 text-sm text-emerald-300">

                          Answer:{" "}

                          {visit.followUpAnswers?.[
                            question.id
                          ] ||
                            "Not answered"}

                        </p>

                      </div>

                    )
                  )}

                </div>

              </div>
            )}

            {/* Summary */}
            {visit.clinicalSummary && (

              <div className="mt-7 rounded-3xl border border-cyan-400/15 bg-cyan-400/[0.025] p-7">

                <div className="flex items-center gap-3">

                  <FileText
                    size={22}
                    className="text-cyan-400"
                  />

                  <h3 className="text-xl font-semibold">
                    Clinical Summary
                  </h3>

                </div>

                <p className="mt-5 whitespace-pre-wrap text-[15px] leading-8 text-slate-300">
                  {visit.clinicalSummary}
                </p>

              </div>

            )}

          </>
        )}

        {/* Back */}
        <div className="mt-8">

          <button
            onClick={() =>
              router.push(
                "/dashboard"
              )
            }
            className="flex h-12 items-center gap-2 rounded-xl border border-white/[0.12] px-5 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
          >

            <ArrowLeft size={18} />

            Back to Dashboard

          </button>

        </div>

      </section>

    </main>
  );
}