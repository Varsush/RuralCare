"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

import {
  HeartPulse,
  Home,
  Stethoscope,
  FileText,
  CheckCircle2,
  Clock3,
  Plus,
  MapPin,
  CircleUserRound,
  LayoutDashboard,
  Trash2,
} from "lucide-react";

type Household = {
  id: number;
  house: string;
  head: string;
  location: string;
  status: "Pending" | "Visited";
};

const defaultHouseholds: Household[] = [
  {
    id: 1,
    house: "House d33",
    head: "Dinesh",
    location: "Kundapura",
    status: "Pending",
  },
  {
    id: 2,
    house: "House 101",
    head: "Lakshmi",
    location: "Kundapura",
    status: "Visited",
  },
  {
    id: 3,
    house: "House 205",
    head: "Ramesh",
    location: "Kundapura",
    status: "Pending",
  },
];

const menu = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    active: true,
  },
  {
    name: "Households",
    icon: Home,
  },
  {
    name: "Doctor",
    icon: Stethoscope,
  },
  {
    name: "Reports",
    icon: FileText,
  },
];

export default function Dashboard() {
  const router = useRouter();

  const [households, setHouseholds] =
    useState<Household[]>(defaultHouseholds);

  useEffect(() => {
    loadHouseholds();
  }, []);

  const loadHouseholds = () => {
    const deletedSaved = localStorage.getItem(
      "sahayak_deleted_households"
    );

    let deletedIds: number[] = [];

    if (deletedSaved) {
      try {
        const parsedDeleted = JSON.parse(
          deletedSaved
        );

        if (Array.isArray(parsedDeleted)) {
          deletedIds = parsedDeleted.map(Number);
        }
      } catch {
        deletedIds = [];
      }
    }

    const getVisitStatus = (
      householdId: number
    ): "Pending" | "Visited" => {
      const savedVisit = localStorage.getItem(
        `sahayak_visit_${householdId}`
      );

      if (!savedVisit) {
        return "Pending";
      }

      try {
        const parsedVisit = JSON.parse(
          savedVisit
        );

        if (
          parsedVisit.status === "Completed" ||
          parsedVisit.completedAt ||
          parsedVisit.submittedAt
        ) {
          return "Visited";
        }
      } catch {
        return "Pending";
      }

      return "Pending";
    };

    const activeDefaultHouseholds =
      defaultHouseholds
        .filter(
          (household) =>
            !deletedIds.includes(
              household.id
            )
        )
        .map((household) => ({
          ...household,
          status: getVisitStatus(
            household.id
          ),
        }));

    const saved = localStorage.getItem(
      "sahayak_households"
    );

    if (!saved) {
      setHouseholds(
        activeDefaultHouseholds
      );
      return;
    }

    try {
      const savedHouseholds =
        JSON.parse(saved);

      if (!Array.isArray(savedHouseholds)) {
        setHouseholds(
          activeDefaultHouseholds
        );
        return;
      }

      const formattedHouseholds: Household[] =
        savedHouseholds
          .filter(
            (household: any) =>
              !deletedIds.includes(
                Number(household.id)
              )
          )
          .map(
            (household: any): Household => {
              const householdId =
                Number(household.id);

              const visitStatus =
                getVisitStatus(
                  householdId
                );

              return {
                id: householdId,
                house:
                  household.houseNumber ||
                  household.house ||
                  "House",
                head:
                  household.headName ||
                  household.head ||
                  "Unknown",
                location:
                  household.address ||
                  household.location ||
                  "Address not available",
                status:
                  visitStatus === "Visited" ||
                  household.status === "Visited"
                    ? "Visited"
                    : "Pending",
              };
            }
          );

      const householdMap =
        new Map<number, Household>();

      activeDefaultHouseholds.forEach(
        (household) => {
          householdMap.set(
            household.id,
            household
          );
        }
      );

      formattedHouseholds.forEach(
        (household) => {
          householdMap.set(
            household.id,
            household
          );
        }
      );

      setHouseholds(
        Array.from(
          householdMap.values()
        )
      );
    } catch (error) {
      console.error(
        "Could not load saved households:",
        error
      );

      setHouseholds(
        activeDefaultHouseholds
      );
    }
  };

  const deleteHousehold = (
    householdId: number
  ) => {
    const household =
      households.find(
        (item) =>
          item.id === householdId
      );

    if (!household) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${household.house}?\n\nThis will remove the household and its related visit and doctor case data.`
    );

    if (!confirmed) {
      return;
    }

    try {
      const deletedSaved =
        localStorage.getItem(
          "sahayak_deleted_households"
        );

      let deletedIds: number[] = [];

      if (deletedSaved) {
        try {
          const parsedDeleted =
            JSON.parse(deletedSaved);

          if (Array.isArray(parsedDeleted)) {
            deletedIds =
              parsedDeleted.map(Number);
          }
        } catch {
          deletedIds = [];
        }
      }

      if (!deletedIds.includes(householdId)) {
        deletedIds.push(householdId);
      }

      localStorage.setItem(
        "sahayak_deleted_households",
        JSON.stringify(deletedIds)
      );

      const savedHouseholds =
        localStorage.getItem(
          "sahayak_households"
        );

      if (savedHouseholds) {
        try {
          const parsed =
            JSON.parse(savedHouseholds);

          if (Array.isArray(parsed)) {
            const remaining =
              parsed.filter(
                (item: any) =>
                  Number(item.id) !==
                  householdId
              );

            localStorage.setItem(
              "sahayak_households",
              JSON.stringify(remaining)
            );
          }
        } catch (error) {
          console.error(
            "Could not update households:",
            error
          );
        }
      }

      localStorage.removeItem(
        `sahayak_family_${householdId}`
      );

      localStorage.removeItem(
        `sahayak_visit_${householdId}`
      );

      const savedDoctorCases =
        localStorage.getItem(
          "sahayak_doctor_cases"
        );

      if (savedDoctorCases) {
        try {
          const parsedCases =
            JSON.parse(savedDoctorCases);

          if (Array.isArray(parsedCases)) {
            const remainingCases =
              parsedCases.filter(
                (item: any) =>
                  Number(item.householdId) !==
                  householdId
              );

            localStorage.setItem(
              "sahayak_doctor_cases",
              JSON.stringify(
                remainingCases
              )
            );
          }
        } catch (error) {
          console.error(
            "Could not update doctor cases:",
            error
          );
        }
      }

      setHouseholds((current) =>
        current.filter(
          (item) =>
            item.id !== householdId
        )
      );
    } catch (error) {
      console.error(
        "Could not delete household:",
        error
      );

      alert(
        "Could not delete the household. Please try again."
      );
    }
  };

  const visitedCount =
    households.filter(
      (household) =>
        household.status === "Visited"
    ).length;

  const pendingCount =
    households.filter(
      (household) =>
        household.status === "Pending"
    ).length;

  const stats = [
    {
      title: "Registered Houses",
      value: households.length,
      description:
        "Total registered households",
      icon: Home,
      iconClass: "text-emerald-400",
      boxClass: "bg-emerald-500/15",
      numberClass: "text-emerald-400",
    },
    {
      title: "Visited",
      value: visitedCount,
      description: "Completed visits",
      icon: CheckCircle2,
      iconClass: "text-cyan-400",
      boxClass: "bg-cyan-500/15",
      numberClass: "text-cyan-400",
    },
    {
      title: "Pending",
      value: pendingCount,
      description: "Pending visits",
      icon: Clock3,
      iconClass: "text-orange-400",
      boxClass: "bg-orange-500/15",
      numberClass: "text-orange-400",
    },
  ];

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#061321] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-[650px] w-[650px] rounded-full bg-emerald-500/[0.06] blur-[180px]" />

        <div className="absolute bottom-[-180px] left-[35%] h-[500px] w-[500px] rounded-full bg-cyan-500/[0.05] blur-[180px]" />
      </div>

      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[248px] border-r border-white/[0.08] bg-[#071827]/95 px-4 py-7 backdrop-blur-2xl lg:flex lg:flex-col">
        <div className="flex items-center gap-4 px-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10">
            <HeartPulse
              size={30}
              className="text-emerald-400"
            />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight">
              SahayakAI
            </h1>

            <p className="mt-1 text-xs text-slate-400">
              Community Healthcare
            </p>
          </div>
        </div>

        <nav className="mt-12 space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <motion.button
                key={item.name}
                type="button"
                whileHover={{ x: 3 }}
                onClick={() => {
                  if (item.name === "Reports") {
                    router.push(
                      "/dashboard/reports"
                    );
                  }
                }}
                className={`flex h-12 w-full items-center gap-4 rounded-xl px-4 text-left transition ${
                  item.active
                    ? "bg-emerald-500/15 text-white"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <Icon
                  size={22}
                  className={
                    item.active
                      ? "text-emerald-400"
                      : "text-slate-400"
                  }
                />

                <span className="text-[16px] font-medium">
                  {item.name}
                </span>
              </motion.button>
            );
          })}
        </nav>

        <div className="mt-auto rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/10">
              <CircleUserRound
                size={25}
                className="text-emerald-400"
              />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                ASHA Worker
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Mangalore PHC
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div className="relative z-10 min-h-screen lg:ml-[248px]">
        <section className="mx-auto w-full max-w-[1240px] px-8 pb-12 pt-12">
          <div className="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-4 text-sm font-semibold tracking-wide text-emerald-400">
                ASHA WORKER DASHBOARD
              </p>

              <h2 className="text-[38px] font-bold leading-tight tracking-tight sm:text-[42px]">
                Namaste!!
              </h2>

              <p className="mt-3 text-[17px] text-slate-400">
                Manage households and record community visits.
              </p>
            </div>

            <Link
              href="/dashboard/add-household"
              className="flex h-12 w-fit items-center gap-2 rounded-xl bg-emerald-500 px-5 font-semibold transition hover:bg-emerald-400"
            >
              <Plus size={21} />
              Add Household
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <motion.div
                  key={stat.title}
                  whileHover={{ y: -3 }}
                  className="min-h-[148px] rounded-2xl border border-white/[0.08] bg-white/[0.035] p-6 backdrop-blur-xl"
                >
                  <div className="flex h-full items-start justify-between gap-4">
                    <div>
                      <p className="text-[16px] font-medium text-slate-200">
                        {stat.title}
                      </p>

                      <p
                        className={`mt-3 text-[40px] font-bold leading-none ${stat.numberClass}`}
                      >
                        {stat.value}
                      </p>

                      <p className="mt-4 text-sm text-slate-400">
                        {stat.description}
                      </p>
                    </div>

                    <div
                      className={`flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-2xl ${stat.boxClass}`}
                    >
                      <Icon
                        size={30}
                        className={stat.iconClass}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-12 flex items-end justify-between">
            <div>
              <h3 className="text-[20px] font-bold">
                Registered Households
              </h3>

              <p className="mt-2 text-[15px] text-slate-400">
                Select a household to view information and record a visit.
              </p>
            </div>
          </div>

          <div
            id="household-list"
            className="mt-5 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]"
          >
            {households.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04]">
                  <Home
                    size={26}
                    className="text-slate-500"
                  />
                </div>

                <h4 className="mt-5 text-lg font-semibold">
                  No registered households
                </h4>

                <p className="mt-2 text-sm text-slate-500">
                  Add a household to start a community visit.
                </p>

                <Link
                  href="/dashboard/add-household"
                  className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-500 px-5 text-sm font-semibold transition hover:bg-emerald-400"
                >
                  <Plus size={18} />
                  Add Household
                </Link>
              </div>
            ) : (
              households.map(
                (household, index) => (
                  <motion.div
                    key={household.id}
                    whileHover={{
                      backgroundColor:
                        "rgba(255,255,255,0.035)",
                    }}
                    className={`min-h-[128px] px-5 py-6 transition sm:px-6 ${
                      index !==
                      households.length - 1
                        ? "border-b border-white/[0.08]"
                        : ""
                    }`}
                  >
                    <div className="flex h-full flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex items-center gap-5">
                        <div className="flex h-[64px] w-[64px] shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10">
                          <Home
                            size={30}
                            className="text-emerald-400"
                          />
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <h4 className="text-[21px] font-semibold">
                              {household.house}
                            </h4>

                            <span
                              className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                                household.status ===
                                "Visited"
                                  ? "bg-cyan-500/10 text-cyan-300"
                                  : "bg-yellow-500/10 text-yellow-300"
                              }`}
                            >
                              {household.status}
                            </span>
                          </div>

                          <p className="mt-2 text-[15px] text-slate-200">
                            Head: {household.head}
                          </p>

                          <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
                            <MapPin size={15} />
                            {household.location}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 lg:pr-1">
                        {household.status ===
                        "Pending" ? (
                          <button
                            type="button"
                            onClick={() =>
                              router.push(
                                `/dashboard/household/complaint?id=${household.id}`
                              )
                            }
                            className="h-12 rounded-xl bg-emerald-500 px-5 text-sm font-semibold transition hover:bg-emerald-400"
                          >
                            Start Visit
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              router.push(
                                `/dashboard/household/visit?id=${household.id}`
                              )
                            }
                            className="h-12 rounded-xl border border-white/[0.12] bg-white/[0.025] px-5 text-sm font-semibold transition hover:bg-white/[0.06]"
                          >
                            View Visit
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            deleteHousehold(
                              household.id
                            )
                          }
                          title="Delete household"
                          aria-label={`Delete ${household.house}`}
                          className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 transition hover:border-red-500/40 hover:bg-red-500/10"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              )
            )}
          </div>

          <div className="mt-7 flex items-center gap-4 rounded-2xl border border-cyan-400/[0.08] bg-cyan-400/[0.025] px-5 py-5 sm:px-6">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cyan-400/30 text-cyan-400">
              <span className="text-sm font-bold">
                i
              </span>
            </div>

            <p className="text-sm leading-6 text-slate-400">
              <span className="font-semibold text-cyan-400">
                Workflow:
              </span>{" "}
              Open a household → review family information → record a health complaint → generate and verify the clinical summary → submit the visit for doctor review.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}