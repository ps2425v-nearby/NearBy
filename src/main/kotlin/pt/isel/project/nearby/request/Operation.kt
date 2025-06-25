package pt.isel.project.nearby.request

import okhttp3.Call
import okhttp3.Callback
import okhttp3.Response
import pt.isel.project.nearby.controllers.models.exceptions.ApiRequestException
import pt.isel.project.nearby.controllers.models.exceptions.ApiResponseException
import java.io.IOException
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException
import kotlin.coroutines.suspendCoroutine


suspend fun <T> Call.doAsync(transform: (Response) -> T): T =
        suspendCoroutine { continuation ->
            enqueue(object : Callback {
                override fun onFailure(call: Call, e: IOException) {
                    continuation.resumeWithException(ApiRequestException(cause = e.cause))
                }

                override fun onResponse(call: Call, response: Response) {
                    try {
                        if (!response.isSuccessful || response.body == null) {
                            continuation.resumeWithException(ApiResponseException(message = response.message))
                        } else {
                            continuation.resume(transform(response))
                        }
                    } catch (e: Exception) {
                        continuation.resumeWithException(e)
                    }
                }
            })
        }

fun <T> Call.doSync(transform: (Response) -> T): T {
        return execute().use { response ->
            if (!response.isSuccessful || response.body == null) {
                throw ApiResponseException(message = response.message)
            } else {
                transform(response)
            }
        }
    }
