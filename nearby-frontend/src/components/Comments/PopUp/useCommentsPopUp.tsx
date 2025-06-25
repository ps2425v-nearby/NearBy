import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '@/context/Notifications/NotificationsContext';
import { fetchCommentsUploadRequest } from "@/Fetch/Comments/fetchCommentsUpload";
import { useAuth } from "@/AuthContext";
import { useCookies } from "react-cookie";

/**
 * Props for the useCommentsPopup hook
 */
interface UseCommentsPopupProps {
    /** ID of the location to comment on */
    locationId: number | null;
    /** Name of the place being commented on */
    placeName: string | null;
    /** Callback to close the comment popup */
    onClose: () => void;
}

/**
 * A custom hook for managing the comment submission process in a popup.
 * Handles state for the message, submission status, and integrates notifications and navigation.
 *
 * @param locationId - The ID of the location being commented on
 * @param placeName - The name of the place being commented on
 * @param onClose - Function to close the comment popup
 * @returns Hook state and handlers for use in the CommentsPopup component
 */
export const useCommentsPopup = ({ locationId, placeName, onClose }: UseCommentsPopupProps) => {
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const { userID } = useAuth();
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [cookies] = useCookies(['token']);

    /**
     * Handles the form submission for posting a comment.
     * Performs validation, shows notifications, and handles redirection on success.
     *
     * @param e - Form submit event
     */
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (submitting || submitted) return;

        if (userID == null || !locationId || !message) {
            showNotification('Please fill all fields', 'warning');
            return;
        }

        setSubmitting(true);
        try {
            const response = await fetchCommentsUploadRequest({
                userId: userID,
                locationId,
                placeName,
                message,
                token: cookies.token
            });

            if (response.ok) {
                setSubmitted(true);
                showNotification('Comentário postado com sucesso!', 'success');
                setTimeout(() => {
                    navigate('/comments');
                    onClose();
                }, 1000);
            } else if (response.status === 403) {
                showNotification("Chegaste ao limite de comentários (Máx 3). Por favor, apaga um comentário para adicionar outro.", "warning");
            } else {
                showNotification('Failed to post comment', 'error');
            }
        } catch (error) {
            showNotification('Failed to post comment', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    /** Whether the submit button should be disabled */
    const isFormDisabled = !message.trim() || submitting || submitted;

    /** The text shown on the submit button depending on form state */
    const buttonText = submitted ? "Comentário Postado!" : submitting ? "A Postar..." : "Postar Comentário";

    return {
        message,
        setMessage,
        submitting,
        submitted,
        handleSubmit,
        isFormDisabled,
        buttonText,
    };
};
