import React from "react";

// The import 'remixicon/fonts/remixicon.css' was causing an error.
// The useEffect hook below now dynamically adds the stylesheet link to the document's head,
// which is a reliable way to include external CSS in this environment.

const App = () => {
    // State to trigger animations on load
    const [isLoaded, setIsLoaded] = React.useState(false);

    React.useEffect(() => {
        // Dynamically add the Remixicon stylesheet
        const link = document.createElement('link');
        link.href = 'https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        // Use a timeout to ensure the component is mounted before starting the animation
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 100); // A small delay
        
        // Cleanup function to remove the stylesheet and clear the timer when the component unmounts
        return () => {
            document.head.removeChild(link);
            clearTimeout(timer);
        };
    }, []);


    return (
        <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12 font-sans">
            {/* Main container with entry animation */}
            <div 
                className={`
                    max-w-5xl w-full bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row
                    transition-all duration-700 ease-in-out transform
                    ${isLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}
                `}
            >
                {/* Left Section: Info */}
                <div className="md:w-1/2 bg-gray-900 text-white flex flex-col justify-center p-10 lg:p-12 transition-all duration-500 hover:bg-gray-800">
                    <div className={`transition-all duration-700 ease-out delay-200 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                        <h2 className="text-4xl lg:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-blue-300">
                            Get in Touch
                        </h2>
                        <p className="text-indigo-100 mb-8 leading-relaxed">
                            Have questions, feedback, or partnership ideas? We’d love to hear
                            from you! Reach out and let’s make your stay with QuickStay even
                            better.
                        </p>
                        <div className="space-y-5 text-indigo-100">
                            {/* Each contact item has a hover effect */}
                            <p className="flex items-center group transition-transform duration-300 hover:translate-x-2">
                                <i className="ri-map-pin-fill mr-4 text-2xl text-indigo-300 group-hover:animate-pulse"></i>
                                <span>123 QuickStay Avenue, San Francisco, CA</span>
                            </p>
                            <p className="flex items-center group transition-transform duration-300 hover:translate-x-2">
                                <i className="ri-mail-send-line mr-4 text-2xl text-indigo-300 group-hover:animate-pulse"></i>
                                <span>support@quickstay.com</span>
                            </p>
                            <p className="flex items-center group transition-transform duration-300 hover:translate-x-2">
                                <i className="ri-phone-fill mr-4 text-2xl text-indigo-300 group-hover:animate-pulse"></i>
                                <span>+1 (555) 123-4567</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Section: Form */}
                <div className="md:w-1/2 p-10 lg:p-12">
                     <div className={`transition-all duration-700 ease-out delay-300 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
                        <h3 className="text-3xl font-bold text-gray-800 mb-8">
                            Contact Us
                        </h3>
                        <form className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-gray-600 font-medium mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="Enter your Full Name"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 focus:outline-none transition-shadow duration-300"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-gray-600 font-medium mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Enter Your Email "
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 focus:outline-none transition-shadow duration-300"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-gray-600 font-medium mb-2">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    rows="5"
                                    placeholder="Write your message..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 focus:outline-none transition-shadow duration-300 resize-none"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full cursor-pointer bg-gray-900 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 shadow-md hover:shadow-lg"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default App;

