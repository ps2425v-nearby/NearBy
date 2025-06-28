// ContactFormFields.tsx
import React, {useState} from 'react';
import {useNotification} from '@/context/Notifications/NotificationsContext';
import {DarkmodeContext} from '@/context/DarkMode/DarkmodeContext';
import {useContext} from 'react';
import {useCookies} from "react-cookie";
import {requestUrl} from "@/utils/Backend_URL";

interface Props {
    closeModal: () => void;
}


/**
 * ContactFormFields component renders the contact form fields for user input and handles form submission.
 *
 * Features:
 * - Controlled form inputs for name, email, and message.
 * - Uses dark mode context to apply appropriate styling.
 * - Integrates with Notifications context to display success/error messages.
 * - Sends form data to backend API with authorization token from cookies.
 * - Manages submission state to prevent multiple submissions and disables the submit button accordingly.
 * - Closes the parent modal on successful submission after a short delay.
 *
 * Props:
 * - closeModal: function to close the modal containing this form.
 *
 * Usage:
 * Render within a modal or any container where contact form functionality is needed.
 */

export const ContactFormFields: React.FC<Props> = ({closeModal}) => {
    const {showNotification} = useNotification();
    const {darkMode} = useContext(DarkmodeContext)!;
    const [cookies] = useCookies(['token']);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [inputValues, setInputValues] = useState({
        input1: '',
        input2: '',
        input3: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setInputValues((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch(`${requestUrl}/api/email`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json',
                Authorization: `Bearer ${cookies.token}`},
                body: JSON.stringify({
                    name: inputValues.input1,
                    email: inputValues.input2,
                    message: inputValues.input3,
                }),
            });

            const data = await response.json();
            if (data.success) {
                showNotification("Your message has been sent successfully!", "success");
                setInputValues({input1: '', input2: '', input3: ''});
                setTimeout(closeModal, 2000);
            } else {
        showNotification(data.message || 'Failed to send email', "error");
                setIsSubmitting(false);
                return; // para não continuar o código depois do erro
            }
        } catch {
            showNotification("Failed to send message. Please try again.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isDisabled = Object.values(inputValues).some((val) => !val) || isSubmitting;

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="input1" className="block mb-2 text-sm font-medium">
                    O teu nome
                </label>
                <input
                    id="input1"
                    name="input1"
                    value={inputValues.input1}
                    onChange={handleChange}
                    required
                    className={`w-full rounded-md border px-3 py-2 sm:text-sm ${
                        darkMode ? 'bg-gray-700 text-white border-gray-500' : 'bg-white text-gray-900 border-gray-300'
                    }`}
                />
            </div>
            <div>
                <label htmlFor="input2" className="block mb-2 text-sm font-medium">
                    O teu email
                </label>
                <input
                    id="input2"
                    name="input2"
                    type="email"
                    value={inputValues.input2}
                    onChange={handleChange}
                    required
                    className={`w-full rounded-md border px-3 py-2 sm:text-sm ${
                        darkMode ? 'bg-gray-700 text-white border-gray-500' : 'bg-white text-gray-900 border-gray-300'
                    }`}
                />
            </div>
            <div>
                <label htmlFor="input3" className="block mb-2 text-sm font-medium">
                    A tua Mensagem
                </label>
                <textarea
                    id="input3"
                    name="input3"
                    rows={4}
                    value={inputValues.input3}
                    onChange={handleChange}
                    required
                    className={`w-full rounded-md border px-3 py-2 sm:text-sm ${
                        darkMode ? 'bg-gray-700 text-white border-gray-500' : 'bg-white text-gray-900 border-gray-300'
                    }`}
                />
            </div>
            <button
                type="submit"
                disabled={isDisabled}
                className={`w-full py-3 px-5 text-sm font-medium rounded-lg focus:ring-4 ${
                    darkMode
                        ? 'text-white hover:bg-gray-400 focus:ring-blue-800'
                        : 'text-blue-950 hover:bg-gray-200 focus:ring-blue-300'
                }`}
            >
                {isSubmitting ? 'A Enviar...' : 'Enviar Mensagem'}
            </button>
        </form>
    );
};
