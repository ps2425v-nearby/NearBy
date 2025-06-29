package pt.isel.project.nearby.services

import org.springframework.stereotype.Service
import pt.isel.project.nearby.controllers.models.EmailResponse
import pt.isel.project.nearby.domain.EmailSendingResult
import pt.isel.project.nearby.domain.failure
import pt.isel.project.nearby.domain.success
import pt.isel.project.nearby.utils.Error
import java.util.Properties
import javax.mail.Authenticator
import javax.mail.Message
import javax.mail.PasswordAuthentication
import javax.mail.Session
import javax.mail.Transport
import javax.mail.internet.InternetAddress
import javax.mail.internet.MimeMessage


/**
 * EmailService is a service class that provides methods to send emails.
 * It uses JavaMail API to construct and send emails with the specified details.
 * The service handles email sending errors and returns appropriate responses.
 *
 * @property name The name of the sender.
 * @property email The email address of the sender.
 * @property message The content of the email message.
 */
@Service
class EmailService {

    /**
     * Sends an email with the provided name, email, and message.
     * It constructs a MIME message and sends it using the JavaMail API.
     * If the email is sent successfully, it returns a success response;
     * otherwise, it returns an error response.
     *
     * @param name The name of the sender.
     * @param email The email address of the sender.
     * @param message The content of the email message.
     * @return An EmailSendingResult indicating success or failure of the email sending operation.
     */

    fun sendEmail(name: String, email: String, message: String): EmailSendingResult {
        return try {
            val properties = Properties().apply {
                put("mail.smtp.auth", "true")
                put("mail.smtp.starttls.enable", "true")
                put("mail.smtp.host", "smtp.gmail.com")
                put("mail.smtp.port", "587")
                put("mail.smtp.ssl.trust", "smtp.gmail.com")
            }

            val session = Session.getInstance(
                properties,
                object : Authenticator() {
                    override fun getPasswordAuthentication() =
                        PasswordAuthentication(
                            "melsalinho2@gmail.com",
                            "xcgv zlkn tmji tnqq"
                        )
                }
            )

            val mimeMessage = MimeMessage(session).apply {
                setFrom(InternetAddress("melsalinho2@gmail.com"))
                addRecipient(Message.RecipientType.TO, InternetAddress("a49459@alunos.isel.pt"))
                addRecipient(Message.RecipientType.TO, InternetAddress("a49436@alunos.isel.pt"))
                addRecipient(Message.RecipientType.TO, InternetAddress("a49489@alunos.isel.pt"))
                subject = "*NearBy* Contact Form Submission from: $name"
                setContent(
                    """
                    <b>Name:</b> $name<br>
                    <b>Email:</b> $email<br>
                    <b>Message:</b> $message
                    """.trimIndent(),
                    "text/html; charset=utf-8"
                )
            }

            Transport.send(mimeMessage)
            success(EmailResponse(true, "Email sent successfully"))
        } catch (e: Exception) {
            failure(Error.EmailSendingError)
        }
    }
}