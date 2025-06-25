import { useEffect, useState } from "react";
import { useNotification } from "@/context/Notifications/NotificationsContext";
import { Comment } from "@/types/CommentType";
import { fetchUpdateComment } from "@/Fetch/Comments/fetchUpdateComments";
import { fetchCommentsByUser } from "@/Fetch/Comments/fetchCommentsByUser";
import { fetchDeleteComment } from "@/Fetch/Comments/fetchDeleteComments";
import {useCookies} from "react-cookie";

export const useCommentsPreview = () => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editedContent, setEditedContent] = useState<string>("");
    const { showNotification } = useNotification();
    const [cookies] = useCookies(['token']);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const userId = Number(localStorage.getItem("userID")) || null;
                if (!userId){
                    showNotification("User ID not found ", "error");
                    return;
                }
                const data = await fetchCommentsByUser(userId, cookies.token);
                setComments(data);
            } catch (err) {
                setComments([]);
            } finally {
                setLoading(false);
            }
        };

     void  fetchComments();
    }, []);

    const handleDeleteComment = async (commentId: number) => {
        try {
            await fetchDeleteComment(commentId, cookies.token);
            setComments(prev => prev.filter(comment => comment.id !== commentId));
            showNotification("Comentário apagado com sucesso!", "success");
        } catch (error) {
            showNotification("Erro ao apagar o comentário...", "error");
        }
    };

    const handleEditComment = (commentId: number, currentContent: string) => {
        setEditingId(commentId);
        setEditedContent(currentContent);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditedContent("");
    };

    const handleSaveComment = async (commentId: number) => {
        try {
            const userId = Number(localStorage.getItem("userID"));
            const placeId = comments.find(c => c.id === commentId)?.placeId;
            const placeName = comments.find(c => c.id === commentId)?.placeName;

            if (!userId || !placeId) {
                showNotification("User ID or Place ID not found", "error");
                return;
            }

            const updatedData = {
                userId,
                placeId,
                placeName,
                content: editedContent,
            };

            const data = await fetchUpdateComment(commentId, updatedData, cookies.token);
            const newDate = new Date(data.createdAt);

            setComments(prev =>
                prev.map(comment =>
                    comment.id === commentId
                        ? {
                            ...comment,
                            content: editedContent,
                            createdAt: newDate.toISOString(),
                        }
                        : comment
                )
            );

            showNotification("Comentário atualizado com sucesso!", "success");
        } catch (error) {
            showNotification("Erro ao atualizar o comentário.", "error");
        } finally {
            handleCancelEdit();
        }
    };

    return {
        comments,
        loading,
        editingId,
        editedContent,
        setEditedContent,
        handleDeleteComment,
        handleEditComment,
        handleCancelEdit,
        handleSaveComment,
    };
};