export const getInputClasses = (darkMode: boolean) =>
    `w-full border rounded-md px-3 py-2 ${
        darkMode
            ? "bg-gray-700 text-white border-gray-500 placeholder-gray-400"
            : "bg-white text-blue-950 border-gray-300 placeholder-gray-200"
    }`;