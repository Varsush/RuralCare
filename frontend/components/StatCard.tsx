import { motion } from "framer-motion";

interface Props{

title:string;

value:string;

}

export default function StatCard({

title,

value

}:Props){

return(

<motion.div

whileHover={{

scale:1.04,

y:-5

}}

className="bg-[#182433]/80 backdrop-blur-xl rounded-3xl p-7 shadow-xl">

<p className="text-slate-400">

{title}

</p>

<h2 className="text-5xl font-bold mt-5">

{value}

</h2>

<p className="text-green-400 mt-5">

↑ Updated Today

</p>

</motion.div>

)

}