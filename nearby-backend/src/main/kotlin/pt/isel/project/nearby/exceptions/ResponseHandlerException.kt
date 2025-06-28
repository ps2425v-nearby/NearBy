package pt.isel.project.nearby.exceptions

import jakarta.servlet.http.HttpServletRequest
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.web.bind.MissingServletRequestParameterException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import java.time.LocalDateTime

/**
 * Centralized exception handler for the entire application.
 *
 * This controller advice intercepts exceptions thrown by controllers and services,
 * mapping them to appropriate HTTP responses with structured error information.
 *
 * Each specific exception is mapped to a corresponding HTTP status code and message,
 * ensuring consistent error reporting across the API.
 */
@ControllerAdvice
class GlobalExceptionHandler {

    /**
     * Handles specific exceptions related to fetching zone data.
     * Maps the exception to a 400 Bad Request response with an error message.
     *
     * @param e The exception thrown during the fetch operation.
     * @param request The HTTP request that caused the exception.
     * @return A ResponseEntity containing the error response with status 400 Bad Request.
     */
    @ExceptionHandler(FetchZoneException::class)
    fun handleFetchZoneException(e: FetchZoneException, request: HttpServletRequest): ResponseEntity<ErrorResponse> {
        val errorResponse = ErrorResponse(
            timestamp = LocalDateTime.now(),
            status = HttpStatus.BAD_REQUEST.value(),
            error = HttpStatus.BAD_REQUEST.reasonPhrase,
            message = e.message ?: "Erro ao buscar zona.",
            path = request.requestURI
        )
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse)
    }

    /**
     * Handles exceptions related to fetching wind data.
     * Maps the exception to a 400 Bad Request response with an error message.
     *
     * @param e The exception thrown during the fetch operation.
     * @param request The HTTP request that caused the exception.
     * @return A ResponseEntity containing the error response with status 400 Bad Request.
     */
    @ExceptionHandler(FetchWindException::class)
    fun handleFetchWindException(e: FetchWindException, request: HttpServletRequest): ResponseEntity<ErrorResponse> {
        val errorResponse = ErrorResponse(
            timestamp = LocalDateTime.now(),
            status = HttpStatus.BAD_REQUEST.value(),
            error = HttpStatus.BAD_REQUEST.reasonPhrase,
            message = e.message ?: "Erro ao buscar velocidade do vento.",
            path = request.requestURI
        )
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse)
    }

    /**
     * Handles exceptions related to fetching traffic data.
     * Maps the exception to a 500 Internal Server Error response with an error message.
     *
     * @param e The exception thrown during the fetch operation.
     * @param request The HTTP request that caused the exception.
     * @return A ResponseEntity containing the error response with status 500 Internal Server Error.
     */
    @ExceptionHandler(FetchTrafficException::class)
    fun handleFetchTrafficException(
        e: FetchTrafficException,
        request: HttpServletRequest
    ): ResponseEntity<ErrorResponse> {
        val errorResponse = ErrorResponse(
            timestamp = LocalDateTime.now(),
            status = HttpStatus.INTERNAL_SERVER_ERROR.value(),
            error = HttpStatus.INTERNAL_SERVER_ERROR.reasonPhrase,
            message = e.message ?: "Erro ao buscar tráfego.",
            path = request.requestURI
        )
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse)
    }

    /**
     * Handles exceptions related to saving places.
     * Maps the exception to a 500 Internal Server Error response with an error message.
     *
     * @param e The exception thrown during the save operation.
     * @param request The HTTP request that caused the exception.
     * @return A ResponseEntity containing the error response with status 500 Internal Server Error.
     */
    @ExceptionHandler(SavePlacesException::class)
    fun handleSavePlacesException(e: SavePlacesException, request: HttpServletRequest): ResponseEntity<ErrorResponse> {
        val errorResponse = ErrorResponse(
            timestamp = LocalDateTime.now(),
            status = HttpStatus.INTERNAL_SERVER_ERROR.value(),
            error = HttpStatus.INTERNAL_SERVER_ERROR.reasonPhrase,
            message = e.message ?: "Erro ao salvar os lugares.",
            path = request.requestURI
        )
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse)
    }

    /**
     * Handles exceptions when no parking spaces are found.
     * Maps the exception to a 204 No Content response with an error message.
     *
     * @param e The exception thrown when no parking spaces are found.
     * @param request The HTTP request that caused the exception.
     * @return A ResponseEntity containing the error response with status 204 No Content.
     */
    @ExceptionHandler(NoParkingSpacesFoundException::class)
    fun handleNoParkingSpacesFoundException(
        e: NoParkingSpacesFoundException,
        request: HttpServletRequest
    ): ResponseEntity<ErrorResponse> {
        val errorResponse = ErrorResponse(
            timestamp = LocalDateTime.now(),
            status = HttpStatus.NOT_FOUND.value(),
            error = HttpStatus.NOT_FOUND.reasonPhrase,
            message = e.message ?: "Nenhum estacionamento encontrado.",
            path = request.requestURI
        )
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(errorResponse)
    }

    /**
     * Handles exceptions when no places are found.
     * Maps the exception to a 404 Not Found response with an error message.
     *
     * @param e The exception thrown when no places are found.
     * @param request The HTTP request that caused the exception.
     * @return A ResponseEntity containing the error response with status 404 Not Found.
     */
    @ExceptionHandler(NoPlacesFoundException::class)
    fun handleNoPlacesFoundException(
        e: NoPlacesFoundException,
        request: HttpServletRequest
    ): ResponseEntity<ErrorResponse> {
        val errorResponse = ErrorResponse(
            timestamp = LocalDateTime.now(),
            status = HttpStatus.NOT_FOUND.value(),
            error = HttpStatus.NOT_FOUND.reasonPhrase,
            message = e.message ?: "Nenhum lugar encontrado.",
            path = request.requestURI
        )
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse)
    }

    /**
     * Handles exceptions when a requested resource is not found.
     * Maps the exception to a 404 Not Found response with an error message.
     *
     * @param request The HTTP request that caused the exception.
     * @return A ResponseEntity containing the error response with status 404 Not Found.
     */
    @ExceptionHandler(NoSuchElementException::class)
    fun handleNoSuchElementException(
        request: HttpServletRequest
    ): ResponseEntity<ErrorResponse> {
        val errorResponse = ErrorResponse(
            timestamp = LocalDateTime.now(),
            status = HttpStatus.NOT_FOUND.value(),
            error = HttpStatus.NOT_FOUND.reasonPhrase,
            message = "Recurso não encontrado.",
            path = request.requestURI
        )
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse)
    }

    /**
     * Handles generic exceptions that are not specifically handled by other methods.
     * Maps the exception to a 500 Internal Server Error response with an error message.
     *
     * @param e The exception thrown during the operation.
     * @param request The HTTP request that caused the exception.
     * @return A ResponseEntity containing the error response with status 500 Internal Server Error.
     */
    @ExceptionHandler(Exception::class)
    fun handleGenericException(
        e: Exception,
        request: HttpServletRequest
    ): ResponseEntity<ErrorResponse> {
        e.printStackTrace() // ou logger.warn() se preferires
        val errorResponse = ErrorResponse(
            timestamp = LocalDateTime.now(),
            status = HttpStatus.INTERNAL_SERVER_ERROR.value(),
            error = HttpStatus.INTERNAL_SERVER_ERROR.reasonPhrase,
            message = e.message ?: "Erro interno do servidor.",
            path = request.requestURI
        )
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse)
    }

    /**
     * Handles exceptions related to invalid JSON input.
     * Maps the exception to a 400 Bad Request response with an error message.
     *
     * @param request The HTTP request that caused the exception.
     * @return A ResponseEntity containing the error response with status 400 Bad Request.
     */
    @ExceptionHandler(HttpMessageNotReadableException::class)
    fun handleInvalidJsonException(
        request: HttpServletRequest
    ): ResponseEntity<ErrorResponse> {
        val errorResponse = ErrorResponse(
            timestamp = LocalDateTime.now(),
            status = HttpStatus.BAD_REQUEST.value(),
            error = HttpStatus.BAD_REQUEST.reasonPhrase,
            message = "Pedido inválido. Verifica os campos obrigatórios.",
            path = request.requestURI
        )
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse)
    }

    /**
     * Handles exceptions when a required request parameter is missing.
     * Maps the exception to a 400 Bad Request response with an error message.
     *
     * @param e The exception thrown when a required parameter is missing.
     * @param request The HTTP request that caused the exception.
     * @return A ResponseEntity containing the error response with status 400 Bad Request.
     */
    @ExceptionHandler(MissingServletRequestParameterException::class)
    fun handleMissingParams(
        e: MissingServletRequestParameterException,
        request: HttpServletRequest
    ): ResponseEntity<ErrorResponse> {
        val errorResponse = ErrorResponse(
            timestamp = LocalDateTime.now(),
            status = HttpStatus.BAD_REQUEST.value(),
            error = HttpStatus.BAD_REQUEST.reasonPhrase,
            message = "Parâmetro '${e.parameterName}' em falta.",
            path = request.requestURI
        )
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse)
    }


}
