package pt.isel.project.nearby.controllers.models

data class UserTokenCreateOutputModel(val token: String, val userID: Int)
data class UserTokenRemoveOutputModel(val success: Boolean)
