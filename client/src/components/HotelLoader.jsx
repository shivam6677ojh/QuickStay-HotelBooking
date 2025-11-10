
import React from "react";

const HotelLoader = () => {
    const backgroundStyle = {
    background: "linear-gradient(-45deg, #0ea5e9, #6366f1, #0f172a, #000000)",
    backgroundSize: "400% 400%",
    animation: "gradientBG 12s ease infinite",
};


    return (
        <div
            className="flex h-screen w-full items-center justify-center bg-gray-900 animate-move-bg"
            style={backgroundStyle}
        >
            <div
                className="relative text-center font-bold text-7xl md:text-9xl tracking-widest uppercase"
                style={{ perspective: "800px" }}
            >
                {/* Welcome message in the back */}
                <span className="absolute inset-0 flex items-center justify-center text-8xl md:text-[10rem] animate-welcome-zoom text-gray-300">
                    Welcome to
                </span>

                {/* Hotel Booking in the front */}
                <div className="relative z-10 text-white">
                    <span className="inline-block animate-red-glow">
                        {"Quick".split("").map((char, index) => (
                            <span
                                key={index}
                                className="inline-block opacity-0 animate-letter-from-left"
                                style={{ animationDelay: `${index * 0.06}s` }}
                            >
                                {char}
                            </span>
                        ))}
                    </span>
                    <span className="inline-block animate-cyan-glow">
                        {" Stay".split("").map((char, index) => (
                            <span
                                key={index}
                                className="inline-block opacity-0 animate-letter-from-right"
                                style={{ animationDelay: `${index * 0.06}s` }}
                            >
                                {char}
                            </span>
                        ))}
                    </span>
                </div>
            </div>

        </div>
    );
};

export default HotelLoader;
