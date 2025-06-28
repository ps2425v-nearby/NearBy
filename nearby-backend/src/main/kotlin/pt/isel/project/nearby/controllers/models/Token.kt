package pt.isel.project.nearby.controllers.models


/**
 * Represents the input model for creating a user token.
 * This model contains the user ID for which the token is being created.
 *
 * @property token The authentication token to be created for the user.
 * @property userID The ID of the user for whom the token is being created.
 */
data class UserTokenCreateOutputModel(val token: String, val userID: Int)


/**
 * Represents the output model for removing a user token.
 * This model indicates whether the token removal was successful.
 *
 * @property success A boolean indicating if the token was successfully removed.
 */
data class UserTokenRemoveOutputModel(val success: Boolean)
