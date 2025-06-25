
import { useEffect, useState } from "react";
import { useNotification } from "@/context/Notifications/NotificationsContext";
import { Comment } from "@/types/CommentType";
import { fetchUpdateComment } from "@/Fetch/Comments/fetchUpdateComments";
import { fetchCommentsByUser } from "@/Fetch/Comments/fetchCommentsByUser";
import { fetchDeleteComment } from "@/Fetch/Comments/fetchDeleteComments";
import { useCookies } from "react-cookie";

/** 
 * Custom hook to manage fetching, editing, deleting, and updating user comments. 
 * Handles loading state and notification feedback. 
*/
export const useCommentsPreview = () => {
    /** 
     * State to hold the list of user comments. 
     */
    const [comments, setComments] = useState<Comment[]>([]);

    /** 
     * State to track loading status while fetching comments. 
     */
    const [loading, setLoading] = useState(true);

    /** 
     * Holds the ID of the comment currently being edited or null if none. 
     */
    const [editingId, setEditingId] = useState<number | null>(null);

    /** 
     * Holds the current text content for the comment being edited. 
     */
    const [editedContent, setEditedContent] = useState<string>("");

    /** 
     * Retrieves notification functions to show user feedback messages. 
     */
    const { showNotification } = useNotification();

    /** 
     * Retrieves authentication token from cookies for authorized API requests. 
     */
    const [cookies] = useCookies(['token']);

    /** 
     * Fetches comments for the current user on mount. 
     * Shows error notification if user ID is missing or fetch fails. 
     */
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

        void fetchComments();
    }, []);

    /** 
     * Handles deleting a comment by ID, updating state and showing notification. 
     */
    const handleDeleteComment = async (commentId: number) => {
        try {
            await fetchDeleteComment(commentId, cookies.token);
            setComments(prev => prev.filter(comment => comment.id !== commentId));
            showNotification("Comentário apagado com sucesso!", "success");
        } catch (error) {
            showNotification("Erro ao apagar o comentário...", "error");
        }
    };

    /** 
     * Sets the comment to be edited and loads its current content into state. 
     */
    const handleEditComment = (commentId: number, currentContent: string) => {
        setEditingId(commentId);
        setEditedContent(currentContent);
    };

    /** 
     * Cancels editing by clearing editing state and content. 
     */
    const handleCancelEdit = () => {
        setEditingId(null);
        setEditedContent("");
    };

    /** 
     * Saves the updated comment content by calling the API, 
     * updates the local state with new content and timestamp, 
     * shows success or error notifications, and resets editing state. 
     */
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

    /** 
     * Returns the state and handler functions to be used in components. 
     */
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
