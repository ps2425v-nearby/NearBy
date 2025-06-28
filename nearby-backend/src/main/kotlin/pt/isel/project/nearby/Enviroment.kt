package pt.isel.project.nearby

/**
 * Environment is an object that provides access to environment variables
 * related to database configuration.
 *
 * It retrieves the database URL, user, and password from the environment,
 * throwing an exception if any of these variables are not set.
 */
object Environment {
    private const val KEY_DB_URL = "KEY_DB_URL"
    private const val KEY_DB_USER = "KEY_DB_USER"
    private const val KEY_DB_PASSWORD = "KEY_DB_PASSWORD"

    /**
     * Retrieves the database URL from the environment variables.
     * Throws a RuntimeException if the variable is not found.
     *
     * @return The database URL as a String.
     */
    fun getDbUrl() = System.getenv(KEY_DB_URL) ?: throw RuntimeException("Environment variable $KEY_DB_URL not found")

    /**
     * Retrieves the database user from the environment variables.
     * Throws a RuntimeException if the variable is not found.
     *
     * @return The database user as a String.
     */
    fun getDbUser() = System.getenv(KEY_DB_USER) ?: throw RuntimeException("Environment variable $KEY_DB_USER not found")

    /**
     * Retrieves the database password from the environment variables.
     * Throws a RuntimeException if the variable is not found.
     *
     * @return The database password as a String.
     */
    fun getDbPassword() = System.getenv(KEY_DB_PASSWORD) ?: throw RuntimeException("Environment variable $KEY_DB_PASSWORD not found")

}

