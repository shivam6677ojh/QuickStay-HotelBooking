import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { useLocation } from 'react-router-dom';

// const ThemeToggle = () => {
//   const { isDarkMode, toggleTheme } = useTheme();

//   return (
//     <div className='flex items-center justify-center '>

//     <button
//       onClick={toggleTheme}
//       className="fixed top-4 right-60 z-50 p-3 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
//       aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
//     >
//       {isDarkMode ? (
//         // Sun icon for light mode
//         <svg
//           className="w-3 h-3 text-yellow-500 transition-transform duration-300 hover:rotate-180"
//           fill="currentColor"
//           viewBox="0 0 20 20"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             fillRule="evenodd"
//             d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
//             clipRule="evenodd"
//           />
//         </svg>
//       ) : (
//         // Moon icon for dark mode
//         <svg
//           className="w-6 h-6 text-blue-900 transition-transform duration-300 hover:rotate-12"
//           fill="currentColor"
//           viewBox="0 0 20 20"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
//         </svg>
//       )}
//     </button>
//     </div>
//   );
// };

// export default ThemeToggle;

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const isOwnerPath = location.pathname.startsWith('/owner');

  // Positioning: keep FAB on mobile (bottom-right), and top-right on desktop.
  // On /owner, drop it slightly lower to avoid clashing with owner header.
  const positionClasses = `
    ${isOwnerPath ? 'top-20 right-4' : 'top-3 right-4'}
    md:${isOwnerPath ? 'top-20 right-12' : 'top-3 right-12'}
  `;

  return (
    // This parent div doesn't directly affect the fixed button, 
    // but we'll leave it as per your request not to change logic.
    <div className='flex items-center justify-center '>

    {/* - Changed `right-60` to `right-4` for proper top-right alignment on all screen sizes.
      - Standardized icon sizes to `w-6 h-6` for visual consistency.
    */}
    <button
      onClick={toggleTheme}
      aria-pressed={isDarkMode}
      className={`fixed ${positionClasses} z-[1000] p-3 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700`}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? (
        // Sun icon for light mode
        <svg
          className="w-6 h-6 text-yellow-500 transition-transform duration-300 hover:rotate-180"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        // Moon icon for dark mode
        <svg
          className="w-6 h-6 text-blue-900 transition-transform duration-300 hover:rotate-12"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
    </div>
  );
};

export default ThemeToggle;