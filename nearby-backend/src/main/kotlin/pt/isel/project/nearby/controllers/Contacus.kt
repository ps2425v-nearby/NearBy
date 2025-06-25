package pt.isel.project.nearby.controllers

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import pt.isel.project.nearby.PathTemplate
import pt.isel.project.nearby.services.EmailRequest
import pt.isel.project.nearby.services.EmailResponse
import pt.isel.project.nearby.services.EmailService

@RestController
class EmailController @Autowired constructor(private val emailService: EmailService) {

    @PostMapping(PathTemplate.EMAIL)
    fun sendEmail(@RequestBody request: EmailRequest): ResponseEntity<EmailResponse> {
        val success = emailService.sendEmail(
            name = request.name,
            email = request.email,
            message = request.message
        )

        return if (success) {
            ResponseEntity.ok(EmailResponse(true, "Email sent successfully"))
        } else {
            ResponseEntity.internalServerError().body(EmailResponse(false, "Failed to send email"))
        }
    }
}