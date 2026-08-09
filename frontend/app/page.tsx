"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  HeartPulse,
  Sparkles,
  Stethoscope,
} from "lucide-react";

export default function Home() {
  const router = useRouter();

  const [role, setRole] = useState<"asha" | "doctor" | null>(null);

  const handleLogin = () => {
    if (!role) return;

    // Save the logged-in role
    localStorage.setItem("sahayak_role", role);

    // Redirect according to role
    if (role === "doctor") {
      router.push("/doctor");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07111D] text-white">

      {/* Background */}

      <div className="absolute inset-0">

        <div className="absolute left-1/2 top-0 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[180px]" />

        <div className="absolute -left-40 bottom-0 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[170px]" />

        <div className="absolute -right-32 top-40 h-[450px] w-[450px] rounded-full bg-teal-500/10 blur-[170px]" />

      </div>

      {/* Navbar */}

      <nav className="fixed left-1/2 top-6 z-50 flex w-[70%] max-w-7xl -translate-x-1/2 items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-8 py-5 backdrop-blur-2xl">

        <div className="flex items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20">

            <HeartPulse
              size={30}
              className="text-emerald-400"
            />

          </div>

          <div>

            <h1 className="text-2xl font-bold">
              SahayakAI
            </h1>

            <p className="text-sm text-slate-400">
              AI Powered Community Healthcare
            </p>

          </div>

        </div>

      </nav>

      {/* Hero */}

      <section className="relative z-20 mx-auto flex min-h-screen max-w-[1450px] items-center justify-between gap-24 px-10 pt-24">

        {/* LEFT */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >

          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/15 px-5 py-3">

            <Sparkles
              size={18}
              className="text-emerald-400"
            />

            AI Powered Rural Healthcare

          </div>

          <h1 className="text-[88px] font-black leading-[0.95] tracking-tight">

            Healthcare

            <span className="block text-emerald-400">
              Reimagined
            </span>

            with AI

          </h1>

          <p className="mt-10 max-w-2xl text-2xl leading-relaxed text-slate-400">

            Empowering ASHA workers with multilingual patient intake,
            intelligent clinical documentation,
            emergency risk detection,
            and doctor-ready AI summaries.

          </p>

        </motion.div>

        {/* RIGHT GLASS CARD */}

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-[520px]"
        >

          {role === null ? (

            <>
              <div className="space-y-5">

                <h2 className="text-4xl font-bold">
                  Namaste!!
                </h2>

                <p className="mt-3 text-lg text-slate-400">
                  Select your role to continue.
                </p>

              </div>

              <div className="mt-14 flex flex-col gap-7">

                {/* ASHA */}

                <button
                  onClick={() => setRole("asha")}
                  className="group w-full rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-7 transition-all hover:scale-[1.02] hover:border-emerald-400 hover:bg-emerald-500/20"
                >

                  <div className="flex items-center gap-8">

                    <div className="flex h-16 w-10 items-center justify-center rounded-2xl bg-emerald-500/20">

                      <HeartPulse
                        size={30}
                        className="text-emerald-400"
                      />

                    </div>

                    <div className="text-left">

                      <h3 className="text-2xl font-bold">
                        ASHA Worker
                      </h3>

                      <p className="mt-1 text-slate-400">
                        Community Healthcare Portal
                      </p>

                    </div>

                  </div>

                </button>

                {/* DOCTOR */}

                <button
                  onClick={() => setRole("doctor")}
                  className="group w-full rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-7 transition-all hover:scale-[1.02] hover:border-cyan-400 hover:bg-cyan-500/20"
                >

                  <div className="flex items-center gap-6">

                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/20">

                      <Stethoscope
                        size={30}
                        className="text-cyan-400"
                      />

                    </div>

                    <div className="text-left">

                      <h3 className="text-2xl font-bold">
                        Doctor
                      </h3>

                      <p className="mt-1 text-slate-400">
                        Clinical Dashboard
                      </p>

                    </div>

                  </div>

                </button>

              </div>
            </>

          ) : (

            <>

              <button
                onClick={() => setRole(null)}
                className="mb-8 text-sm text-emerald-400 hover:underline"
              >
                ← Back
              </button>

              <h2 className="text-4xl font-bold">

                {role === "asha"
                  ? "ASHA Worker Login"
                  : "Doctor Login"}

              </h2>

              <p className="mt-3 text-slate-400">
                Enter your credentials.
              </p>

              <div className="mt-10 space-y-6">

                {/* USERNAME */}

                <div>

                  <label className="mb-2 block text-sm text-slate-400">
                    Username
                  </label>

                  <input
                    type="text"
                    placeholder="Enter Username"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none focus:border-emerald-400"
                  />

                </div>

                {/* PASSWORD */}

                <div>

                  <label className="mb-2 block text-sm text-slate-400">
                    Password
                  </label>

                  <input
                    type="password"
                    placeholder="Enter Password"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none focus:border-emerald-400"
                  />

                </div>

                {/* LOGIN */}

                <button
                  onClick={handleLogin}
                  className="w-full rounded-2xl bg-emerald-500 py-4 text-lg font-semibold transition hover:bg-emerald-400"
                >

                  Login

                </button>

              </div>

            </>

          )}

        </motion.div>

      </section>

    </main>
  );
}