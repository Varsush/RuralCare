"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  HeartPulse,
  Sparkles,
} from "lucide-react";

type VisitData = {
  householdId: number;
  relationship: string;
  complaint: string;
  photo?: string | null;
  language?: string;
  createdAt?: string;
};

type Question = {
  id: number;
  question: string;
  options: string[];
};

export default function FollowUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const householdId = searchParams.get("id");

  const [visit, setVisit] = useState<VisitData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!householdId) return;

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
      const parsedVisit: VisitData = JSON.parse(savedVisit);

      setVisit(parsedVisit);

      generateQuestions(parsedVisit);
    } catch (error) {
      console.error("Could not read visit data:", error);

      router.replace(
        `/dashboard/household/complaint?id=${householdId}`
      );
    }
  }, [householdId, router]);

  const generateQuestions = async (visitData: VisitData) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "`${process.env.NEXT_PUBLIC_API_URL}/api/ai/follow-up",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            complaint: visitData.complaint,
            relationship: visitData.relationship,
            language: visitData.language || "English",
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.detail ||
            `AI request failed with status ${response.status}`
        );
      }

      const data = await response.json();

      if (
        !data.questions ||
        !Array.isArray(data.questions) ||
        data.questions.length === 0
      ) {
        throw new Error(
          "Gemma did not return any follow-up questions."
        );
      }

      setQuestions(data.questions);
    } catch (error) {
      console.error("Could not generate AI questions:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Could not generate follow-up questions."
      );
    } finally {
      setLoading(false);
    }
  };

  const question = questions[currentQuestion];

  const selectedAnswer = question
    ? answers[question.id]
    : undefined;

  const selectAnswer = (answer: string) => {
    if (!question) return;

    setAnswers((previous) => ({
      ...previous,
      [question.id]: answer,
    }));
  };

  const goBack = () => {
    if (currentQuestion === 0) {
      router.push(
        `/dashboard/household/complaint?id=${householdId}`
      );
      return;
    }

    setCurrentQuestion((previous) => previous - 1);
  };

  const goNext = () => {
    if (!selectedAnswer) {
      alert("Please select an answer before continuing.");
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((previous) => previous + 1);
      return;
    }

    if (!visit) return;

    const completedVisit = {
      ...visit,
      followUpQuestions: questions,
      followUpAnswers: answers,
    };

    localStorage.setItem(
      `sahayak_visit_${householdId}`,
      JSON.stringify(completedVisit)
    );

    router.push(
      `/dashboard/household/summary?id=${householdId}`
    );
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#061321] text-white">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10">
            <Sparkles
              size={28}
              className="animate-pulse text-emerald-400"
            />
          </div>

          <h2 className="mt-5 text-xl font-semibold">
            SahayakAI is preparing questions...
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Understanding the patient complaint and generating
            relevant follow-up questions.
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#061321] px-6 text-white">
        <div className="w-full max-w-lg rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center">
          <h2 className="text-xl font-semibold text-red-300">
            Unable to generate follow-up questions
          </h2>

          <p className="mt-4 text-sm leading-6 text-slate-300">
            {error}
          </p>

          <button
            type="button"
            onClick={() => {
              if (visit) {
                generateQuestions(visit);
              }
            }}
            className="mt-6 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  if (!visit || !question) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#061321] text-white">
        <p className="text-slate-400">
          Preparing follow-up questions...
        </p>
      </main>
    );
  }

  const progress =
    ((currentQuestion + 1) / questions.length) * 100;

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
              AI Follow-up
            </p>
          </div>
        </div>
      </header>

      
      <section className="relative z-10 mx-auto w-full max-w-[900px] px-8 pb-16 pt-12">
        
        <div className="mb-8">
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold tracking-wide text-emerald-400">
            <Sparkles size={17} />
            AI-ASSISTED FOLLOW-UP
          </p>

          <h2 className="text-[40px] font-bold tracking-tight">
            Follow-up Questions
          </h2>

          <p className="mt-3 text-[17px] leading-7 text-slate-400">
            Answer the questions based on what the patient reports.
            These answers will be used to prepare the clinical summary.
          </p>
        </div>

        
        <div className="mb-7 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Patient complaint
          </p>

          <p className="mt-3 leading-7 text-slate-200">
            {visit.complaint}
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <span className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
              Relationship: {visit.relationship}
            </span>

            {visit.photo && (
              <span className="rounded-lg bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-300">
                Photo attached
              </span>
            )}
          </div>
        </div>

        
        <div className="mb-7">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-300">
              Question {currentQuestion + 1} of{" "}
              {questions.length}
            </p>

            <p className="text-sm text-slate-500">
              {Math.round(progress)}%
            </p>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-white/[0.07]">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        
        <div className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-8 backdrop-blur-xl">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-sm font-bold text-emerald-400">
              {currentQuestion + 1}
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Follow-up question
              </p>

              <h3 className="mt-2 text-[25px] font-semibold leading-9">
                {question.question}
              </h3>
            </div>
          </div>

          
          <div className="mt-8 space-y-3">
            {question.options.map((option) => {
              const selected = selectedAnswer === option;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => selectAnswer(option)}
                  className={`flex w-full items-center gap-4 rounded-2xl border p-5 text-left transition ${
                    selected
                      ? "border-emerald-400/60 bg-emerald-500/10"
                      : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.16] hover:bg-white/[0.04]"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                      selected
                        ? "border-emerald-400 bg-emerald-500"
                        : "border-white/[0.20]"
                    }`}
                  >
                    {selected && (
                      <Check
                        size={14}
                        className="text-white"
                      />
                    )}
                  </span>

                  <span
                    className={`text-[15px] ${
                      selected
                        ? "font-semibold text-white"
                        : "text-slate-300"
                    }`}
                  >
                    {option}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        
        <div className="mt-7 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={goBack}
            className="flex h-12 items-center gap-2 rounded-xl border border-white/[0.12] px-5 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <button
            type="button"
            onClick={goNext}
            className="flex h-12 items-center gap-3 rounded-xl bg-emerald-500 px-7 text-sm font-semibold transition hover:bg-emerald-400"
          >
            {currentQuestion === questions.length - 1
              ? "Generate Summary"
              : "Next"}

            <ArrowRight size={18} />
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
            2
          </span>

          <span className="text-emerald-400">
            AI Follow-up
          </span>

          <span className="h-px w-10 bg-white/[0.10]" />

          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.12]">
            3
          </span>

          <span>Summary</span>
        </div>
      </section>
    </main>
  );
}