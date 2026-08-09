"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Activity,
  ArrowRight,
  ClipboardList,
  FileText,
  HeartPulse,
  Home,
  Menu,
  Search,
  Stethoscope,
  UserRound,
  Users,
  X,
} from "lucide-react";

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

  followUpQuestions?: {
    id: number;
    question: string;
    options: string[];
  }[];

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

type FilterType =
  | "all"
  | "needs-review"
  | "reviewed"
  | "urgent";

export default function DoctorDashboard() {
  const router = useRouter();

  const [cases, setCases] = useState<DoctorCase[]>([]);
  const [search, setSearch] = useState("");
  const [mobileMenu, setMobileMenu] =
    useState(false);

  const [activeFilter, setActiveFilter] =
    useState<FilterType>("all");

  /* =====================================================
     LOAD CASES
  ===================================================== */

  useEffect(() => {
    const loadCases = () => {
      const savedCases =
        localStorage.getItem(
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
        } else {
          setCases([]);
        }
      } catch (error) {
        console.error(
          "Could not load doctor cases:",
          error
        );

        setCases([]);
      }
    };

    loadCases();

    window.addEventListener(
      "focus",
      loadCases
    );

    return () => {
      window.removeEventListener(
        "focus",
        loadCases
      );
    };
  }, []);

  /* =====================================================
     COUNTS
  ===================================================== */

  const totalCases = cases.length;

  const needsReviewCases = cases.filter(
    (item) =>
      item.status?.toLowerCase() !==
      "reviewed"
  );

  const needsReview =
    needsReviewCases.length;

  const reviewedCases = cases.filter(
    (item) =>
      item.status?.toLowerCase() ===
        "reviewed" ||
      !!item.doctorReview
  );

  const reviewedCount =
    reviewedCases.length;

  const urgentCases = cases.filter(
    (item) =>
      item.doctorReview?.decision ===
      "Urgent Attention"
  );

  const urgentCount =
    urgentCases.length;

  /* =====================================================
     FILTER CASES
  ===================================================== */

  const filteredCases = useMemo(() => {
    let result = [...cases];

    if (activeFilter === "needs-review") {
      result = result.filter(
        (item) =>
          item.status?.toLowerCase() !==
          "reviewed"
      );
    }

    if (activeFilter === "reviewed") {
      result = result.filter(
        (item) =>
          item.status?.toLowerCase() ===
            "reviewed" ||
          !!item.doctorReview
      );
    }

    if (activeFilter === "urgent") {
      result = result.filter(
        (item) =>
          item.doctorReview?.decision ===
          "Urgent Attention"
      );
    }

    const query =
      search.trim().toLowerCase();

    if (!query) {
      return result;
    }

    return result.filter((item) => {
      return (
        item.house
          ?.toLowerCase()
          .includes(query) ||
        item.headName
          ?.toLowerCase()
          .includes(query) ||
        item.complaint
          ?.toLowerCase()
          .includes(query) ||
        item.relationship
          ?.toLowerCase()
          .includes(query) ||
        item.doctorReview?.decision
          ?.toLowerCase()
          .includes(query) ||
        item.doctorReview?.assessment
          ?.toLowerCase()
          .includes(query) ||
        item.doctorReview?.remarks
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [cases, search, activeFilter]);

  /* =====================================================
     FILTER TITLE
  ===================================================== */

  const getFilterDescription = () => {
    switch (activeFilter) {
      case "needs-review":
        return "Cases waiting for doctor review.";

      case "reviewed":
        return "Cases already reviewed by the doctor.";

      case "urgent":
        return "Cases marked as requiring urgent attention.";

      default:
        return "Complaints submitted by ASHA workers.";
    }
  };

  /* =====================================================
     DATE
  ===================================================== */

  const formatDate = (date?: string) => {
    if (!date) {
      return "Recently";
    }

    try {
      return new Date(
        date
      ).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Recently";
    }
  };

  /* =====================================================
     FILTER SELECTION
  ===================================================== */

  const selectFilter = (
    filter: FilterType
  ) => {
    setActiveFilter(filter);
    setSearch("");
  };

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <main className="min-h-screen bg-[#061321] text-white">

      {/* MOBILE OVERLAY */}

      {mobileMenu && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() =>
            setMobileMenu(false)
          }
        />
      )}

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen
          w-[270px] flex-col
          border-r border-white/[0.06]
          bg-[#071827]
          transition-transform duration-300
          lg:translate-x-0
          ${
            mobileMenu
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* LOGO */}

        <div className="flex h-[90px] items-center gap-3 px-7">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10">

            <HeartPulse
              size={27}
              className="text-emerald-400"
            />

          </div>

          <div>

            <h1 className="text-lg font-bold">
              SahayakAI
            </h1>

            <p className="text-xs text-slate-500">
              Community Healthcare
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              setMobileMenu(false)
            }
            className="ml-auto lg:hidden"
          >
            <X
              size={20}
              className="text-slate-400"
            />
          </button>

        </div>

        {/* NAVIGATION */}

        <nav className="mt-8 flex-1 px-4">

          <NavItem
            icon={<Activity size={19} />}
            label="Doctor Dashboard"
            active
          />

          <NavItem
            icon={<ClipboardList size={19} />}
            label="Patient Cases"
          />

          <NavItem
            icon={<Users size={19} />}
            label="Households"
          />

          <NavItem
            icon={<FileText size={19} />}
            label="Reports"
          />

        </nav>

        {/* DOCTOR PROFILE */}

        <div className="mx-4 mb-5 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">

              <Stethoscope
                size={20}
                className="text-emerald-400"
              />

            </div>

            <div className="min-w-0">

              <p className="truncate text-sm font-semibold">
                Doctor
              </p>

              <p className="truncate text-xs text-slate-500">
                Community Health Centre
              </p>

            </div>

          </div>

        </div>

      </aside>

      {/* =================================================
          MAIN
      ================================================= */}

      <div className="min-h-screen lg:ml-[270px]">

        {/* TOP BAR */}

        <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#061321]/90 backdrop-blur-xl">

          <div className="flex h-[78px] items-center justify-between px-5 sm:px-8">

            <div className="flex items-center gap-4">

              <button
                type="button"
                onClick={() =>
                  setMobileMenu(true)
                }
                className="rounded-xl p-2 hover:bg-white/[0.05] lg:hidden"
              >
                <Menu size={22} />
              </button>

              <div>

                <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-400">
                  Doctor Portal
                </p>

                <h2 className="mt-1 text-xl font-bold sm:text-2xl">
                  Doctor Dashboard
                </h2>

              </div>

            </div>

            <div className="hidden items-center gap-3 sm:flex">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">

                <UserRound
                  size={19}
                  className="text-emerald-400"
                />

              </div>

            </div>

          </div>

        </header>

        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <section className="px-5 py-8 sm:px-8 lg:px-10">

          {/* WELCOME */}

          <div className="mb-8">

            <h1 className="text-3xl font-bold">
              Good to see you, Doctor
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Review health complaints reported during
              community visits.
            </p>

          </div>

          {/* =================================================
              STAT CARDS
          ================================================= */}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              icon={<FileText size={21} />}
              label="Total Cases"
              value={totalCases}
              active={
                activeFilter === "all"
              }
              onClick={() =>
                selectFilter("all")
              }
            />

            <StatCard
              icon={<Activity size={21} />}
              label="Needs Review"
              value={needsReview}
              highlight
              active={
                activeFilter ===
                "needs-review"
              }
              onClick={() =>
                selectFilter(
                  "needs-review"
                )
              }
            />

            <StatCard
              icon={<ClipboardList size={21} />}
              label="Reviewed"
              value={reviewedCount}
              active={
                activeFilter === "reviewed"
              }
              onClick={() =>
                selectFilter("reviewed")
              }
            />

            <StatCard
              icon={<Stethoscope size={21} />}
              label="Urgent Attention"
              value={urgentCount}
              urgent
              active={
                activeFilter === "urgent"
              }
              onClick={() =>
                selectFilter("urgent")
              }
            />

          </div>

          {/* =================================================
              CASE SECTION
          ================================================= */}

          <div className="mt-10">

            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

              <div>

                <div className="flex items-center gap-3">

                  <h2 className="text-xl font-bold">
                    Patient Cases
                  </h2>

                  {activeFilter !== "all" && (
                    <span
                      className={`
                        rounded-full px-3 py-1
                        text-[11px] font-semibold
                        ${
                          activeFilter ===
                          "urgent"
                            ? "bg-red-500/10 text-red-400"
                            : "bg-emerald-500/10 text-emerald-400"
                        }
                      `}
                    >
                      {activeFilter ===
                        "needs-review" &&
                        "Needs Review"}

                      {activeFilter ===
                        "reviewed" &&
                        "Reviewed"}

                      {activeFilter ===
                        "urgent" &&
                        "Urgent Attention"}
                    </span>
                  )}

                </div>

                <p className="mt-1 text-sm text-slate-500">
                  {getFilterDescription()}
                </p>

              </div>

              {/* SEARCH */}

              <div className="relative w-full md:w-[300px]">

                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search cases..."
                  className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.035] pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-500/40"
                />

              </div>

            </div>

            {/* CASE COUNT */}

            <p className="mt-5 text-xs text-slate-600">
              Showing{" "}
              <span className="font-semibold text-slate-400">
                {filteredCases.length}
              </span>{" "}
              {filteredCases.length === 1
                ? "case"
                : "cases"}
            </p>

            {/* =================================================
                CASE LIST
            ================================================= */}

            <div className="mt-3 space-y-4">

              {filteredCases.length === 0 ? (

                <EmptyState
                  filter={activeFilter}
                />

              ) : (

                filteredCases.map((item) => {

                  const isReviewed =
                    item.status?.toLowerCase() ===
                      "reviewed" ||
                    !!item.doctorReview;

                  const isUrgent =
                    item.doctorReview
                      ?.decision ===
                    "Urgent Attention";

                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition hover:border-emerald-500/20 hover:bg-white/[0.035] sm:p-6"
                    >

                      {/* CASE HEADER */}

                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                        <div className="flex gap-4">

                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">

                            <Home
                              size={23}
                              className="text-emerald-400"
                            />

                          </div>

                          <div>

                            <div className="flex flex-wrap items-center gap-2">

                              <h3 className="text-lg font-bold">
                                {item.house ||
                                  `House ${item.householdId}`}
                              </h3>

                              {isUrgent ? (

                                <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-[11px] font-semibold text-red-400">
                                  Urgent Attention
                                </span>

                              ) : isReviewed ? (

                                <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-400">
                                  Reviewed
                                </span>

                              ) : (

                                <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-400">
                                  Needs Review
                                </span>

                              )}

                            </div>

                            <p className="mt-1 text-sm text-slate-400">
                              Head:{" "}
                              {item.headName ||
                                "Not available"}
                            </p>

                            <p className="mt-1 text-xs text-slate-600">
                              Submitted{" "}
                              {formatDate(
                                item.submittedAt
                              )}
                            </p>

                          </div>

                        </div>

                        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2">

                          <p className="text-[11px] uppercase tracking-wider text-slate-600">
                            Patient
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-300">
                            {item.relationship ||
                              "Not specified"}
                          </p>

                        </div>

                      </div>

                      {/* =================================================
                          COMPLAINT
                      ================================================= */}

                      <div className="mt-6 rounded-xl border border-white/[0.06] bg-black/10 p-4">

                        <div className="flex items-center gap-2">

                          <FileText
                            size={16}
                            className="text-emerald-400"
                          />

                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Reported Complaint
                          </p>

                        </div>

                        <p className="mt-3 text-sm leading-6 text-slate-200">
                          {item.complaint ||
                            "No complaint recorded."}
                        </p>

                      </div>

                      {/* =================================================
                          AI SUMMARY
                      ================================================= */}

                      {item.clinicalSummary && (

                        <div className="mt-4 rounded-xl border border-emerald-500/10 bg-emerald-500/[0.025] p-4">

                          <div className="flex items-center gap-2">

                            <Activity
                              size={16}
                              className="text-emerald-400"
                            />

                            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                              AI Clinical Summary
                            </p>

                          </div>

                          <p className="mt-3 text-sm leading-6 text-slate-300">
                            {item.clinicalSummary}
                          </p>

                        </div>

                      )}

                      {/* =================================================
                          DOCTOR REVIEW
                      ================================================= */}

                      {isReviewed &&
                        item.doctorReview && (

                          <div className="mt-4 rounded-xl border border-cyan-500/15 bg-cyan-500/[0.035] p-4">

                            <div className="flex items-center gap-2">

                              <Stethoscope
                                size={16}
                                className="text-cyan-400"
                              />

                              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                                Doctor Review
                              </p>

                            </div>

                            {/* DECISION */}

                            <div className="mt-4">

                              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                                Decision
                              </p>

                              <p
                                className={`mt-1 text-sm font-semibold ${
                                  item.doctorReview
                                    .decision ===
                                  "Urgent Attention"
                                    ? "text-red-400"
                                    : item.doctorReview
                                        .decision ===
                                      "Needs Further Evaluation"
                                    ? "text-amber-400"
                                    : "text-emerald-400"
                                }`}
                              >
                                {
                                  item
                                    .doctorReview
                                    .decision
                                }
                              </p>

                            </div>

                            {/* ASSESSMENT */}

                            {item.doctorReview
                              .assessment && (

                              <div className="mt-4">

                                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                                  Doctor's Assessment
                                </p>

                                <p className="mt-2 text-sm leading-6 text-slate-300">
                                  {
                                    item
                                      .doctorReview
                                      .assessment
                                  }
                                </p>

                              </div>

                            )}

                            {/* REMARKS */}

                            {item.doctorReview
                              .remarks && (

                              <div className="mt-4">

                                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                                  Additional Remarks
                                </p>

                                <p className="mt-2 text-sm leading-6 text-slate-300">
                                  {
                                    item
                                      .doctorReview
                                      .remarks
                                  }
                                </p>

                              </div>

                            )}

                            {/* REVIEW DATE */}

                            {item.doctorReview
                              .reviewedAt && (

                              <p className="mt-4 text-xs text-slate-600">
                                Reviewed on{" "}
                                {new Date(
                                  item
                                    .doctorReview
                                    .reviewedAt
                                ).toLocaleString(
                                  "en-IN"
                                )}
                              </p>

                            )}

                          </div>

                        )}

                      {/* =================================================
                          FOOTER
                      ================================================= */}

                      <div className="mt-5 flex flex-col gap-3 border-t border-white/[0.06] pt-4 sm:flex-row sm:items-center sm:justify-between">

                        <p className="text-xs text-slate-600">
                          Household ID:{" "}
                          {item.householdId}
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              `/doctor/case?id=${encodeURIComponent(
                                item.id
                              )}`
                            )
                          }
                          className="flex h-10 items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 text-sm font-semibold text-emerald-400 transition hover:border-emerald-400/40 hover:bg-emerald-500/20"
                        >
                          View Case
                          <ArrowRight
                            size={16}
                          />
                        </button>

                      </div>

                    </div>
                  );
                })

              )}

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}

/* =====================================================
   STAT CARD
===================================================== */

function StatCard({
  icon,
  label,
  value,
  highlight = false,
  urgent = false,
  active = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  highlight?: boolean;
  urgent?: boolean;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full rounded-2xl border p-5 text-left
        transition-all duration-200
        hover:-translate-y-0.5
        ${
          active
            ? urgent
              ? "border-red-500/40 bg-red-500/[0.07]"
              : "border-emerald-500/40 bg-emerald-500/[0.07]"
            : highlight
            ? "border-emerald-500/15 bg-emerald-500/[0.035]"
            : "border-white/[0.07] bg-white/[0.025]"
        }
      `}
    >

      <div className="flex items-center justify-between">

        <div
          className={`
            flex h-10 w-10 items-center justify-center rounded-xl
            ${
              urgent
                ? "bg-red-500/10 text-red-400"
                : highlight
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-white/[0.04] text-slate-400"
            }
          `}
        >
          {icon}
        </div>

        {active && (
          <span
            className={`
              text-xs font-medium
              ${
                urgent
                  ? "text-red-400"
                  : "text-emerald-400"
              }
            `}
          >
            Selected
          </span>
        )}

      </div>

      <p className="mt-5 text-3xl font-bold">
        {value}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        {label}
      </p>

    </button>
  );
}

/* =====================================================
   NAV ITEM
===================================================== */

function NavItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      className={`
        mb-2 flex w-full items-center gap-3 rounded-xl
        px-4 py-3 text-sm font-medium transition
        ${
          active
            ? "bg-emerald-500/15 text-emerald-400"
            : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-300"
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}

/* =====================================================
   EMPTY STATE
===================================================== */

function EmptyState({
  filter,
}: {
  filter: FilterType;
}) {
  let title = "No patient cases yet";

  let description =
    "Completed ASHA visits with reported complaints will appear here for doctor review.";

  if (filter === "needs-review") {
    title = "No cases need review";

    description =
      "There are currently no cases waiting for doctor review.";
  }

  if (filter === "reviewed") {
    title = "No reviewed cases";

    description =
      "Cases reviewed by the doctor will appear here.";
  }

  if (filter === "urgent") {
    title = "No urgent cases";

    description =
      "Cases marked as requiring urgent attention will appear here.";
  }

  return (
    <div className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.02] px-6 py-16 text-center">

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04]">

        <ClipboardList
          size={25}
          className="text-slate-500"
        />

      </div>

      <h3 className="mt-5 text-lg font-semibold">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>

    </div>
  );
}