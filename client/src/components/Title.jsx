import React from 'react'

const Title = ({ title, subTitle, align, font }) => {
    return (
        <div>
            <div
                className={`relative flex flex-col cursor-pointer justify-center items-center text-center p-6 rounded-2xl bg-gradient-to-br from-white via-indigo-50/30 to-violet-50/30 dark:from-gray-800 dark:via-indigo-900/10 dark:to-violet-900/10 shadow-xl shadow-indigo-500/10 dark:shadow-indigo-900/20 transition-all duration-500 group hover:scale-105 border border-indigo-200/30 dark:border-indigo-800/30 ${align === "left" ? "md:items-start md:text-left" : ""
                    }`}
            >
                {/* Animated glowing border on hover */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-indigo-400/50 dark:group-hover:border-indigo-600/50 group-hover:animate-dash pointer-events-none"></div>
                
                {/* Gradient glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-700"></div>

                <h1 className={`relative text-4xl md:text-[40px] ${font || "font-playfair"} text-black dark:text-white`}>
                    <span className="text-gradient-brand">
                        {title}
                    </span>
                </h1>

                <p className="relative text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2 max-w-174">
                    {subTitle}
                </p>
            </div>

        </div>
    )
}

export default Title