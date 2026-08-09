"use client";

import {

LayoutDashboard,

House,

Stethoscope,

BrainCircuit,

UserRound,

Settings

} from "lucide-react";

export default function Sidebar(){

return(

<aside className="w-72 h-screen bg-[#131D2B]/80 backdrop-blur-xl border-r border-white/5 p-8">

<h1 className="text-4xl font-bold text-[#6DD6B8]">

🩺 SahayakAI

</h1>

<p className="text-slate-400 mt-2">

Community Healthcare

</p>

<div className="mt-14 space-y-7 text-lg">

<div className="flex items-center gap-4 hover:text-[#6DD6B8]">

<LayoutDashboard size={22}/>

Dashboard

</div>

<div className="flex items-center gap-4 hover:text-[#6DD6B8]">

<House size={22}/>

Households

</div>

<div className="flex items-center gap-4 hover:text-[#6DD6B8]">

<Stethoscope size={22}/>

Visits

</div>

<div className="flex items-center gap-4 hover:text-[#6DD6B8]">

<BrainCircuit size={22}/>

AI Summary

</div>

<div className="flex items-center gap-4 hover:text-[#6DD6B8]">

<UserRound size={22}/>

Doctor

</div>

<div className="flex items-center gap-4 hover:text-[#6DD6B8]">

<Settings size={22}/>

Settings

</div>

</div>

<div className="absolute bottom-8">

<div className="bg-[#182433] rounded-2xl p-5 w-52">

<h3 className="font-semibold">

ASHA Worker

</h3>

<p className="text-sm text-green-400">

● Online

</p>

</div>

</div>

</aside>

)

}