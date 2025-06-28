package pt.isel.project.nearby.controllers

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import pt.isel.project.nearby.PathTemplate
import pt.isel.project.nearby.PathTemplate.COMMENT_BY_ID
import pt.isel.project.nearby.controllers.models.CommentInputModel
import pt.isel.project.nearby.controllers.models.CommentOutputModel
import pt.isel.project.nearby.domain.Either
import pt.isel.project.nearby.services.CommentService
import pt.isel.project.nearby.utils.Error

/**
 * Controller for handling comment-related requests.
 * This controller provides endpoints for creating, retrieving, updating, and deleting comments.
 * It uses the CommentService to perform operations and returns appropriate HTTP responses.
 *
 * @property commentService The service used to handle comment operations.
 * @constructor Creates a CommentController with the specified CommentService.
 *
 * @RestController annotation indicates that this class is a Spring MVC controller.
 * @RequestMapping annotation specifies the base URL for all endpoints in this controller.
 */
@RestController
@RequestMapping("/comments")
class CommentController(private val commentService: CommentService) {

    /**
     * Returns the list of comments associated with a specific location.
     *
     * @param placeId the ID of the place whose comments are being retrieved
     * @return a ResponseEntity containing the list of comments, or an error response if the request fails
     */
    @GetMapping(PathTemplate.COMMENTS_BY_PLACE_ID) // PathTemplate.COMMENTSBYPLACEID
    fun getCommentsByPlaceId(@PathVariable placeId: Int): ResponseEntity<List<CommentOutputModel>> {
        return when (val result = commentService.getCommentsByPlaceId(placeId)) {
            is Either.Right -> ResponseEntity.ok(result.value.map {
                CommentOutputModel(
                    id = it.id,
                    userId = it.userId,
                    placeId = it.placeId,
                    content = it.content,
                    createdAt = it.createdAt,
                    updatedAt = it.updatedAt,
                    placeName = it.placeName
                )
            })
            is Either.Left -> when (result.value) {
                Error.InternalServerError -> ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()
                else -> ResponseEntity.status(HttpStatus.BAD_REQUEST).build()
            }
        }
    }

    /**
     * Searches for comments within a specified radius of a geographic coordinate.
     *
     * @param lat the latitude of the search center
     * @param lon the longitude of the search center
     * @param radius the radius (in meters) to search within
     * @return a ResponseEntity containing the list of matching comments, or an error response if the request fails
     */
    @GetMapping(PathTemplate.COMMENTS_SEARCH) // PathTemplate.COMMENTSSEARCH
    fun searchComments(
        @RequestParam lat: Double?,
        @RequestParam lon: Double?,
        @RequestParam radius: Int?
    ): ResponseEntity<List<CommentOutputModel>>{
        return when (val result = commentService.searchComments(lat, lon, radius)) {
            is Either.Right -> ResponseEntity.ok(result.value.map {
                CommentOutputModel(
                    id = it.id,
                    userId = it.userId,
                    placeId = it.placeId,
                    content = it.content,
                    createdAt = it.createdAt,
                    updatedAt = it.updatedAt,
                    placeName = it.placeName
                )
            })
            is Either.Left -> when (result.value) {
                Error.InternalServerError -> ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()
                else -> ResponseEntity.status(HttpStatus.BAD_REQUEST).build()
            }
        }
    }

    /**
     * Returns the list of comments made by the user with the given ID.
     *
     * @param userId the ID of the user whose comments are being requested
     * @return a ResponseEntity containing the list of comments, or an error response if the request fails
     */
    @GetMapping(PathTemplate.COMMENTS_BY_USER_ID)
    fun getCommentsByUserId(@PathVariable userId: Int): ResponseEntity<List<CommentOutputModel>> {
        return when (val result = commentService.getCommentsByUserId(userId)) {
            is Either.Right -> ResponseEntity.ok(result.value.map {
                CommentOutputModel(
                    id = it.id,
                    userId = it.userId,
                    placeId = it.placeId,
                    content = it.content,
                    createdAt = it.createdAt,
                    updatedAt = it.updatedAt,
                    placeName = it.placeName
                )
            })
            is Either.Left -> when (result.value) {
                Error.InternalServerError -> ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()
                else -> ResponseEntity.status(HttpStatus.BAD_REQUEST).build()
            }
        }
    }

    /**
     * Creates a new comment with the provided data.
     *
     * @param input the data required to create the comment, including user, place, and content
     * @return a ResponseEntity containing the created comment, or an error response if creation fails
     */
    @PostMapping
    fun createComment(@RequestBody input: CommentInputModel): ResponseEntity<CommentOutputModel> {
        return when (val result = commentService.createComment(input.userId, input.placeId, input.placeName,input.content)) {
            is Either.Right -> ResponseEntity.status(HttpStatus.CREATED).body(
                CommentOutputModel(
                    id = result.value.id,
                    userId = result.value.userId,
                    placeId = result.value.placeId,
                    content = result.value.content,
                    createdAt = result.value.createdAt,
                    updatedAt = result.value.updatedAt,
                    placeName = result.value.placeName
                )
            )
            is Either.Left -> when (result.value) {
                Error.ExceededCommentLimit -> ResponseEntity.status(HttpStatus.FORBIDDEN).build()
                Error.CommentRepositoryError -> ResponseEntity.status(HttpStatus.BAD_REQUEST).build()
                Error.InternalServerError -> ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()
                else -> ResponseEntity.status(HttpStatus.BAD_REQUEST).build()
            }
        }
    }

    /**
     * Updates the content of an existing comment.
     *
     * @param commentId the ID of the comment to be updated
     * @param input the new content to update the comment with
     * @return a ResponseEntity containing the updated comment, or an error response if the comment was not found or the update failed
     */
    @PutMapping(COMMENT_BY_ID)
    fun updateComment(
        @PathVariable commentId: Int,
        @RequestBody input: CommentInputModel
    ): ResponseEntity<CommentOutputModel> {
        return when (val result = commentService.updateComment(commentId, input.content)) {
            is Either.Right -> ResponseEntity.ok(
                CommentOutputModel(
                    id = result.value.id,
                    userId = result.value.userId,
                    placeId = result.value.placeId,
                    content = result.value.content,
                    createdAt = result.value.createdAt,
                    updatedAt = result.value.updatedAt,
                    placeName = result.value.placeName
                )
            )
            is Either.Left -> when (result.value) {
                Error.CommentNotFound -> ResponseEntity.status(HttpStatus.NOT_FOUND).build()
                Error.InternalServerError -> ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()
                else -> ResponseEntity.status(HttpStatus.BAD_REQUEST).build()
            }
        }
    }

    /**
     * Deletes a comment by its ID.
     *
     * @param commentId the ID of the comment to delete
     * @return a ResponseEntity with no content if deletion was successful, or an error response if the comment was not found or the deletion failed
     */
    @DeleteMapping(COMMENT_BY_ID)
    fun deleteComment(@PathVariable commentId: Int): ResponseEntity<Unit> {
        return when (val result = commentService.deleteComment(commentId)) {
            is Either.Right -> ResponseEntity.noContent().build()
            is Either.Left -> when (result.value) {
                Error.CommentNotFound -> ResponseEntity.status(HttpStatus.NOT_FOUND).build()
                Error.InternalServerError -> ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()
                else -> ResponseEntity.status(HttpStatus.BAD_REQUEST).build()
            }
        }
    }
}
