package pt.isel.project.nearby.config

import okhttp3.internal.concurrent.TaskRunner.Companion.logger
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.InterceptorRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import pt.isel.project.nearby.interceptors.TokenAuthInterceptor

@Configuration
class WebConfig(
    private val tokenAuthInterceptor: TokenAuthInterceptor
) : WebMvcConfigurer {

    @Value("\${frontend.url}")
    private lateinit var frontendUrl: String

    override fun addCorsMappings(registry: CorsRegistry) {
        logger.info("Configuração de CORS aplicada") // Log de verificação

        println("Configuração de CORS aplicada para o frontend: $frontendUrl") // Log de verificação

        registry.addMapping("/**") // Permite todas as rotas
            .allowedOrigins(frontendUrl) // Permite o frontend especificado
            .allowedMethods("GET", "POST", "PUT", "DELETE") // Métodos HTTP permitidos
            .allowedHeaders("*") // Permite todos os headers
            .allowCredentials(true) // Permite enviar credenciais, se necessário
    }

    override fun addInterceptors(registry: InterceptorRegistry) {
        logger.info("Interceptor de autenticação de token adicionado") // Log de verificação

        registry.addInterceptor(tokenAuthInterceptor)
            .addPathPatterns("/**")
            .excludePathPatterns("/session", "/all-places", "/zones","/housing/prices","/comments/search","/users", "/locations")
    }
}
