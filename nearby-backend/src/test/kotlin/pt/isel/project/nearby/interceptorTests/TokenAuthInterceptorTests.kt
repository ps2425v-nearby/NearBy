package pt.isel.project.nearby.interceptorTests

import io.mockk.*
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import pt.isel.project.nearby.domain.Either
import pt.isel.project.nearby.domain.User
import pt.isel.project.nearby.interceptors.TokenAuthInterceptor
import pt.isel.project.nearby.services.UserService
import java.io.PrintWriter
import kotlin.test.Test
import kotlin.test.assertFalse
import kotlin.test.assertTrue

class TokenAuthInterceptorTests {

    private val userService = mockk<UserService>()
    private val interceptor = TokenAuthInterceptor(userService)

    @Test
    fun `should allow request when token is valid`() {
        val request = mockk<HttpServletRequest>(relaxed = true)
        val response = mockk<HttpServletResponse>(relaxed = true)
        val handler = mockk<Any>()
        val token = "token123"

        every { request.getHeader("Authorization") } returns "Bearer $token"
        every { userService.isTokenValid(token) } returns Either.Right(true)

        val result = interceptor.preHandle(request, response, handler)

        assertTrue(result)
    }

    @Test
    fun `should block request when token is invalid`() {
        val request = mockk<HttpServletRequest>(relaxed = true)
        val response = mockk<HttpServletResponse>(relaxed = true)
        val writer = mockk<PrintWriter>(relaxed = true)
        val handler = mockk<Any>()

        every { request.getHeader("Authorization") } returns "Bearer invalid"
        every { userService.isTokenValid("invalid") } returns Either.Right(false)
        every { response.writer } returns writer

        val result = interceptor.preHandle(request, response, handler)

        assertFalse(result)
        verify { response.status = HttpServletResponse.SC_UNAUTHORIZED }
        verify { writer.write("Token inválido") }
    }

    @Test
    fun `should block request when Authorization header is missing`() {
        val request = mockk<HttpServletRequest>(relaxed = true)
        val response = mockk<HttpServletResponse>(relaxed = true)
        val writer = mockk<PrintWriter>(relaxed = true)
        val handler = mockk<Any>()

        every { request.getHeader("Authorization") } returns null
        every { response.writer } returns writer

        val result = interceptor.preHandle(request, response, handler)

        assertFalse(result)
        verify { response.status = HttpServletResponse.SC_UNAUTHORIZED }
        verify { writer.write("Token ausente ou mal formatado") }
    }
}
