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
/**
 * InputField component renders a labeled input element with styling that adapts to dark mode.
 *
 * Key aspects:
 * - Accepts common input props: type, id, value, onChange, placeholder, autoComplete, and required flag.
 * - Dynamically applies styles based on the `darkMode` boolean to switch between light and dark themes.
 * - The label is linked to the input via `htmlFor` and `id` for accessibility.
 * - The input has focus styles with blue accents for better UX.
 *
 * Props:
 * - `label`: Text shown above the input as its label.
 * - `type`: The input type, e.g., "text", "password", etc.
 * - `id`: Unique identifier used for linking label and input.
 * - `value`: Controlled value of the input.
 * - `onChange`: Change handler function for updating the value.
 * - `required`: Whether the input is required (default is true).
 * - `autoComplete`: Optional autocomplete attribute for browser hints.
 * - `placeholder`: Optional placeholder text inside the input.
 * - `darkMode`: Boolean indicating if dark mode styling should be applied.
 */

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
