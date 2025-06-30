package pt.isel.project.nearby.config

import okhttp3.internal.concurrent.TaskRunner.Companion.logger
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.InterceptorRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import pt.isel.project.nearby.PathTemplate
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
    
    /**
     * This method registers the TokenAuthInterceptor to intercept all incoming requests
     * except for specific paths that are excluded from token authentication.
     *
     * @param registry The InterceptorRegistry to register the interceptor.
     */
    override fun addInterceptors(registry: InterceptorRegistry) {
        logger.info("Interceptor de autenticação de token adicionado")

        registry.addInterceptor(tokenAuthInterceptor)
            .addPathPatterns("/**")
            .excludePathPatterns(
                PathTemplate.LOGIN,
                PathTemplate.GET_ZONE_MARKER,
                PathTemplate.ZONE_IDENTIFIER,
                PathTemplate.HOUSING_PRICES,
                "/comments/search", // PathTemplate.COMMENTS_SEARCH,
                PathTemplate.CREATE_USER,
                PathTemplate.SAVE
            )
    }
}
