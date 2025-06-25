// components/forms/InputField.tsx
import React from "react";

interface InputFieldProps {
    label: string;
    type: string;
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    autoComplete?: string;
    placeholder?: string;
    darkMode: boolean;
}

export const InputField = ({
                               label,
                               type,
                               id,
                               value,
                               onChange,
                               required = true,
                               autoComplete,
                               placeholder,
                               darkMode
                           }: InputFieldProps) => {
    const labelClass = `block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`;
    const inputClass = `mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
        darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-black border-gray-300"
    }`;

    return (
        <div>
            <label htmlFor={id} className={labelClass}>
                {label}
            </label>
            <input
                type={type}
                id={id}
                value={value}
                onChange={onChange}
                autoComplete={autoComplete}
                required={required}
                placeholder={placeholder}
                className={inputClass}
            />
        </div>
    );
};
