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

@RestController
@RequestMapping("/comments")
class CommentController(private val commentService: CommentService) {

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

    @GetMapping(PathTemplate.COMMENTS_BY_USER_ID) // PathTemplate.COMMENTSBYUSERID
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
