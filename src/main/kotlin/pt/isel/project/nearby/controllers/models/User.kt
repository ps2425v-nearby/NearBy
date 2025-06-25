package pt.isel.project.nearby.controllers.models

data class UserInputModel(val name: String, val password: String)

data class UserCreateModel(val email:String, val name: String, val password: String)

data class UserLogoutModel(val token: String)