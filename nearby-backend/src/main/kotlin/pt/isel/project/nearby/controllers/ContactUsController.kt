package pt.isel.project.nearby.controllers

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import pt.isel.project.nearby.PathTemplate
import pt.isel.project.nearby.controllers.models.EmailRequest
import pt.isel.project.nearby.controllers.models.EmailResponse
import pt.isel.project.nearby.domain.Either
import pt.isel.project.nearby.services.EmailService

/**
 * Controller for handling email-related requests.
 * This controller provides an endpoint to send emails.
 * It uses the EmailService to perform email operations and returns appropriate HTTP responses.
 *
 * @RestController annotation indicates that this class is a Spring MVC controller.
 * @Autowired annotation is used to inject the EmailService dependency.
 */
@RestController
class EmailController @Autowired constructor(private val emailService: EmailService) {

    /**
     * Sends an email based on the provided request data.
     *
     * @param request the email details including sender name, email address, and message content
     * @return a ResponseEntity containing the result of the operation, indicating success or failure
     */
    @PostMapping(PathTemplate.EMAIL)
    fun sendEmail(@RequestBody request: EmailRequest): ResponseEntity<EmailResponse> {

        return when (val res = emailService.sendEmail(name = request.name, email = request.email, message = request.message)) {
            is Either.Right -> {
                ResponseEntity.ok(res.value)
            }
            is Either.Left -> {
                ResponseEntity.internalServerError().body(EmailResponse(false, "Failed to send email"))
            }
        }
    }
}