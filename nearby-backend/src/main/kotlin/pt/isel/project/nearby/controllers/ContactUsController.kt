package pt.isel.project.nearby.controllers

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import pt.isel.project.nearby.PathTemplate
import pt.isel.project.nearby.controllers.models.EmailRequest
import pt.isel.project.nearby.controllers.models.EmailResponse
import pt.isel.project.nearby.domain.Either
import pt.isel.project.nearby.services.EmailService

@RestController
class EmailController @Autowired constructor(private val emailService: EmailService) {

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