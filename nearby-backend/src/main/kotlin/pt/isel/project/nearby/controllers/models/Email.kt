package pt.isel.project.nearby.controllers.models

data class EmailRequest(
    val name: String,
    val email: String,
    val message: String
)

data class EmailResponse(
    val success: Boolean,
    val message: String
)