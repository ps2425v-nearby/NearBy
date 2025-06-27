    package pt.isel.project.nearby

    object Environment {
        private const val KEY_DB_URL = "KEY_DB_URL"
        private const val KEY_DB_USER = "KEY_DB_USER"
        private const val KEY_DB_PASSWORD = "KEY_DB_PASSWORD"
        fun getDbUrl() = System.getenv(KEY_DB_URL) ?: throw RuntimeException("Environment variable $KEY_DB_URL not found")
        fun getDbUser() = System.getenv(KEY_DB_USER) ?: throw RuntimeException("Environment variable $KEY_DB_USER not found")
        fun getDbPassword() = System.getenv(KEY_DB_PASSWORD) ?: throw RuntimeException("Environment variable $KEY_DB_PASSWORD not found")

    }

