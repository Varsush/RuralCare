export default function Navbar() {

  return (

    <header className="h-20 bg-[#131D2B]/70 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-10">

      <div>

        <h2 className="text-3xl font-bold">

          Good Evening 👋

        </h2>

        <p className="text-slate-400">

          Welcome back to SahayakAI

        </p>

      </div>

      <div className="flex items-center gap-6">

        <button className="bg-[#3FAF8D] hover:bg-[#56c5a3] px-5 py-2 rounded-xl font-semibold">

          + New Visit

        </button>

      </div>

    </header>

  );

}