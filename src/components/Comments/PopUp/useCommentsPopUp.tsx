import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '@/context/Notifications/NotificationsContext';
import { fetchCommentsUploadRequest } from "@/Fetch/Comments/fetchCommentsUpload";
import {useAuth} from "@/AuthContext";
import {useCookies} from "react-cookie";

interface UseCommentsPopupProps {
    locationId: number | null;
    placeName: string | null;
    onClose: () => void;
}

export const useCommentsPopup = ({ locationId, placeName, onClose }: UseCommentsPopupProps) => {
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const {userID} = useAuth();
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [cookies] = useCookies(['token']);

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

    const isFormDisabled = !message.trim() || submitting || submitted;
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