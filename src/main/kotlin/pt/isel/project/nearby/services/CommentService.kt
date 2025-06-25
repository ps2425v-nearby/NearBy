package pt.isel.project.nearby.services

import org.springframework.stereotype.Service
import pt.isel.project.nearby.domain.Comment
import pt.isel.project.nearby.domain.Either
import pt.isel.project.nearby.domain.failure
import pt.isel.project.nearby.domain.success
import pt.isel.project.nearby.repository.TransactionManager
import  pt.isel.project.nearby.utils.Error


@Service
class CommentService(
    private val transactionManager: TransactionManager
) {
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