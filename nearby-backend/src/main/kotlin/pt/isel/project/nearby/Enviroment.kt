package pt.isel.project.nearby

object Environment {
    fun getDbUrl() = System.getenv(KEY_DB_URL) ?: throw RuntimeException("Environment variable $KEY_DB_URL not found")
    fun getDbUser() = "postgres"
    fun getDbPassword() = "manuecana"
    private const val KEY_DB_URL = "KEY_DB_URL"

}

