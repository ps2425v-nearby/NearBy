package pt.isel.project.nearby.controllers.models


/**
 * Represents the input model for user authentication.
 *
 * @property name The name of the user attempting to log in.
 * @property password The password of the user attempting to log in.
 */
data class UserInputModel(val name: String, val password: String)

/**
 * Represents the creation model for user authentication.
 *
 * @property email The email address of the user.
 * @property name The name of the user.
 * @property password The password of the user.
 */
data class UserCreateModel(val email:String, val name: String, val password: String)

/**
 * Represents the output model for user authentication.
 *
 * @property token The authentication token generated for the user.
 */
data class UserLogoutModel(val token: String)