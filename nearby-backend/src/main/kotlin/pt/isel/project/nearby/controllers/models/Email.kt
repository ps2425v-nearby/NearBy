package pt.isel.project.nearby.controllers.models


/**
 * Data class representing a request to send an email.
 * This class contains the necessary fields to construct an email request.
 *
 * @property name The name of the person sending the email.
 * @property email The email address of the sender.
 * @property message The content of the email message.
 */
data class EmailRequest(
    val name: String,
    val email: String,
    val message: String
)

/**
 * Data class representing the response after sending an email.
 * This class contains the status of the email sending operation.
 *
 * @property success Indicates whether the email was sent successfully.
 * @property message A message providing additional information about the email sending operation.
 */
data class EmailResponse(
    val success: Boolean,
    val message: String
)

