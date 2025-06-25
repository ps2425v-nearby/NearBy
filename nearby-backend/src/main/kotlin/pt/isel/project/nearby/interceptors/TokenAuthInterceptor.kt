package pt.isel.project.nearby.interceptors

import okhttp3.internal.concurrent.TaskRunner.Companion.logger
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.stereotype.Component
import org.springframework.web.servlet.HandlerInterceptor
import pt.isel.project.nearby.domain.Either
import pt.isel.project.nearby.services.UserService

@Component
class TokenAuthInterceptor(
    private val userService: UserService
) : HandlerInterceptor {

    override fun preHandle(
        request: HttpServletRequest,
        response: HttpServletResponse,
        handler: Any
    ): Boolean {
        logger.info("Interceptando requisição para validação de token: ${request.method} ${request.requestURI}")

        if (request.method.equals("OPTIONS", ignoreCase = true)) {
            // Allow CORS preflight requests through without token
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


    private fun reject(response: HttpServletResponse, message: String): Boolean {
        response.status = HttpServletResponse.SC_UNAUTHORIZED
        response.writer.write(message)
        return false
    }

}