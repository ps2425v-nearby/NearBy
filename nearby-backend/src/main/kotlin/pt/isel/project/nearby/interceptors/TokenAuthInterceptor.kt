package pt.isel.project.nearby.interceptors

import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import okhttp3.internal.concurrent.TaskRunner.Companion.logger
import org.springframework.stereotype.Component
import org.springframework.web.servlet.HandlerInterceptor
import pt.isel.project.nearby.domain.Either
import pt.isel.project.nearby.services.UserService

@Component
class TokenAuthInterceptor(
    private val userService: UserService
) : HandlerInterceptor {

    /**
     * Intercepts incoming HTTP requests to check for a valid Bearer token in the Authorization header.
     * If the token is missing or invalid, it rejects the request with a 401 Unauthorized status.
     * If the request is an OPTIONS request (CORS preflight), it allows the request to pass through without token validation.
     *
     * @param request The incoming HTTP request.
     * @param response The HTTP response to be sent back.
     * @param handler The handler for the request.
     *
     * @return Boolean indicating whether to proceed with the request (true) or reject it (false).
     */
    override fun preHandle(
        request: HttpServletRequest,
        response: HttpServletResponse,
        handler: Any
    ): Boolean {
        if (request.method.equals("OPTIONS", ignoreCase = true)) {
            return true
        }

        
        val authHeader = request.getHeader("Authorization")
        if (authHeader.isNullOrBlank() || !authHeader.startsWith("Bearer ")) {
            return reject(response, "Token ausente ou mal formatado")
        }

        val token = authHeader.removePrefix("Bearer ").trim()
        return when (val result = userService.isTokenValid(token)) {
            is Either.Right -> {
                if (result.value) true
                else reject(response, "Token inválido")
            }
            is Either.Left -> {
                reject(response, "Erro interno na validação do token")
            }
        }
    }


    /**
     * Sends a 401 Unauthorized response with the provided message.
     *
     * @param response The HTTP response to be sent back.
     * @param message The message to include in the response body.
     *
     * @return Boolean indicating that the request is rejected.
     */
    private fun reject(response: HttpServletResponse, message: String): Boolean {
        response.status = HttpServletResponse.SC_UNAUTHORIZED
        response.writer.write(message)
        return false
    }

}