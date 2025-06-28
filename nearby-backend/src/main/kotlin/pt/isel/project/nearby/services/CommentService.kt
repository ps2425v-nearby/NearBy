package pt.isel.project.nearby.services

import org.springframework.stereotype.Service
import pt.isel.project.nearby.domain.Comment
import pt.isel.project.nearby.domain.Either
import pt.isel.project.nearby.domain.failure
import pt.isel.project.nearby.domain.success
import pt.isel.project.nearby.repository.TransactionManager
import  pt.isel.project.nearby.utils.Error


/**
 * CommentService is a service class that provides methods to manage comments
 * related to locations in the application. It interacts with the comments repository
 * through a transaction manager to perform operations such as retrieving, creating,
 * updating, and deleting comments.
 *
 * @property transactionManager The TransactionManager used to handle database transactions.
 */
@Service
class CommentService(
    private val transactionManager: TransactionManager
) {

    /**
     * Retrieves all comments from the database.
     * This method executes a transaction to fetch all comments
     * and returns them as a list.
     *
     * @return Either an Error or a list of Comment objects.
     */
    fun getCommentsByPlaceId(placeId: Int): Either<Error, List<Comment>> =
        transactionManager.executeTransaction {
            try {
                val comments = it.commentsRepository.getCommentsByPlaceId(placeId)
                success(comments)
            } catch (e: Exception) {
                e.printStackTrace()
                failure(Error.InternalServerError)
            }
        }

    /**
     * Searches for comments based on latitude, longitude, and radius.
     * This method executes a transaction to search for comments
     * within the specified geographical area and returns them as a list.
     *
     * @param lat The latitude to search around.
     * @param lon The longitude to search around.
     * @param radius The radius in meters to search within.
     * @return Either an Error or a list of Comment objects.
     */
    fun searchComments(lat: Double?, lon: Double?, radius: Int?): Either<Error, List<Comment>> =
        transactionManager.executeTransaction {
            try {
                val comments = it.commentsRepository.searchComments(lat, lon, radius)
                success(comments)
            } catch (e: Exception) {
                e.printStackTrace()
                failure(Error.InternalServerError)
            }
        }

    /**
     * Retrieves comments made by a specific user based on their user ID.
     * This method executes a transaction to fetch comments associated with the given user ID.
     *
     * @param userId The ID of the user whose comments are to be retrieved.
     * @return Either an Error or a list of Comment objects made by the user.
     */
    fun getCommentsByUserId(userId: Int): Either<Error, List<Comment>> =
        transactionManager.executeTransaction {
            try {
                val comments = it.commentsRepository.getCommentsByUserId(userId)
                success(comments)
            } catch (e: Exception) {
                e.printStackTrace()
                failure(Error.InternalServerError)
            }
        }

    /**
     * Creates a new comment for a specific place by a user.
     * This method checks if the user has exceeded the comment limit before creating a new comment.
     *
     * @param userId The ID of the user creating the comment.
     * @param placeId The ID of the place for which the comment is being created.
     * @param placeName The name of the place for which the comment is being created.
     * @param content The content of the comment.
     * @return Either an Error or the newly created Comment object.
     */
    fun createComment(userId: Int, placeId: Int, placeName:String ,content: String): Either<Error, Comment> =
        transactionManager.executeTransaction {
            try {
                val existingComment = it.commentsRepository.getCommentsByUserId(userId)
                if (existingComment.size >= 3) {
                    return@executeTransaction failure(Error.ExceededCommentLimit)
                }
                val comment: Comment = it.commentsRepository.createComment(userId, placeId, placeName,content)
                success(comment)
            } catch (e: Exception) {
                e.printStackTrace()
                failure(Error.CommentRepositoryError)
            }
        }

    /**
     * Updates an existing comment by its ID.
     * This method executes a transaction to update the content of the specified comment.
     *
     * @param commentId The ID of the comment to be updated.
     * @param content The new content for the comment.
     * @return Either an Error or the updated Comment object.
     */
    fun updateComment(commentId: Int, content: String): Either<Error, Comment> =
        transactionManager.executeTransaction {
            try {
                val updatedComment = it.commentsRepository.updateComment(commentId, content)
                if (updatedComment == null) {
                    failure(Error.CommentNotFound)
                } else {
                    success(updatedComment)
                }
            } catch (e: Exception) {
                e.printStackTrace()
                failure(Error.InternalServerError)
            }
        }

    /**
     * Deletes a comment by its ID.
     * This method executes a transaction to delete the specified comment from the database.
     *
     * @param commentId The ID of the comment to be deleted.
     * @return Either an Error or a Boolean indicating success or failure of the deletion.
     */
    fun deleteComment(commentId: Int): Either<Error, Boolean> =
        transactionManager.executeTransaction {
            try {
                val result = it.commentsRepository.deleteComment(commentId)
                if (result <= 0) {
                    failure(Error.CommentNotFound)
                } else {
                    success(true)
                }
            } catch (e: Exception) {
                e.printStackTrace()
                failure(Error.InternalServerError)
            }
        }
}