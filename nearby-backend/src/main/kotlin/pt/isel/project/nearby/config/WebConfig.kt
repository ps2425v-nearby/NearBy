package pt.isel.project.nearby.config

import okhttp3.internal.concurrent.TaskRunner.Companion.logger
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.InterceptorRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import pt.isel.project.nearby.interceptors.TokenAuthInterceptor

/**
 * This configuration class sets up CORS (Cross-Origin Resource Sharing) and registers an interceptor
 * for token-based authentication in the Spring application.
 *
 * It allows the frontend application to communicate with the backend by enabling CORS for all routes
 * and registering an interceptor that checks for a valid token in the Authorization header of incoming requests.
 *
 * @param tokenAuthInterceptor The interceptor that handles token authentication.
 *
 * This class implements the WebMvcConfigurer interface to customize the Spring MVC configuration.
 * It overrides the addCorsMappings method to configure CORS settings and the addInterceptors method
 * to register the TokenAuthInterceptor.
 */

@Configuration
class WebConfig(
    private val tokenAuthInterceptor: TokenAuthInterceptor
) : WebMvcConfigurer {

    @Value("\${frontend.url}")
    private lateinit var frontendUrl: String


    /**
     * This method allows the frontend application to make requests to the backend
     * by specifying the allowed origins, methods, and headers.
     *
     * It enables CORS for all routes and allows requests from the specified frontend URL.
     * The allowed methods are GET, POST, PUT, and DELETE, and all headers are permitted.
     * This configuration is essential for enabling communication between the frontend and backend
     * when they are hosted on different domains or ports, which is common in modern web applications.
     *
     * @param registry The CorsRegistry to configure CORS settings.
     *
     */
    override fun addCorsMappings(registry: CorsRegistry) {
        logger.info("Configuração de CORS aplicada") // Log de verificação

        println("Configuração de CORS aplicada para o frontend: $frontendUrl") // Log de verificação

        registry.addMapping("/**") // Permite todas as rotas
            .allowedOrigins(frontendUrl) // Permite o frontend especificado
            .allowedMethods("GET", "POST", "PUT", "DELETE") // Métodos HTTP permitidos
            .allowedHeaders("*") // Permite todos os headers
            .allowCredentials(true) // Permite enviar credenciais, se necessário
    }

    /**
     * This method registers the TokenAuthInterceptor to intercept all incoming requests
     * except for specific paths that are excluded from token authentication.
     *
     * @param registry The InterceptorRegistry to register the interceptor.
     */
    override fun addInterceptors(registry: InterceptorRegistry) {
        logger.info("Interceptor de autenticação de token adicionado") // Log de verificação

        registry.addInterceptor(tokenAuthInterceptor)
            .addPathPatterns("/**")
            .excludePathPatterns("/session", "/all-places", "/zones","/housing/prices","/comments/search","/users", "/locations")
    }
}
