package pt.isel.project.nearby.services

import org.springframework.stereotype.Service
import java.util.Properties
import javax.mail.Authenticator
import javax.mail.Message
import javax.mail.PasswordAuthentication
import javax.mail.Session
import javax.mail.Transport
import javax.mail.internet.InternetAddress
import javax.mail.internet.MimeMessage

data class EmailRequest(
    val name: String,
    val email: String,
    val message: String
)

data class EmailResponse(
    val success: Boolean,
    val message: String
)

@Service
class EmailService {

    fun sendEmail(name: String, email: String, message: String): Boolean {
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
            true
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }
}