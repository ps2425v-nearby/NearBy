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


/**
 * Extension function to execute an OkHttp Call asynchronously and transform the response.
 * This function allows you to perform an HTTP request and handle the response in a coroutine-friendly way.
 * It uses the OkHttp library to make the request and provides a callback mechanism
 * to handle the response or failure.
 *
 * This function is designed to be used with Kotlin coroutines, allowing you to
 * suspend the execution until the HTTP request is completed.
 * It takes a lambda function `transform` that processes the response
 * and returns a result of type T.
 *
 * @param transform A function that takes a Response and returns a transformed result of type T.
 * @return A result of type T obtained from the transformed response.
 * @throws ApiRequestException if the request fails.
 * @throws ApiResponseException if the response is not successful or has no body.
 */
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

/**
 * Extension function to execute an OkHttp Call synchronously and transform the response.
 * This function allows you to perform an HTTP request and handle the response in a blocking manner.
 * It uses the OkHttp library to make the request and processes the response immediately.
 *
 * This function is designed for synchronous operations, meaning it will block the current thread
 * until the HTTP request is completed.
 * It takes a lambda function `transform` that processes the response
 * and returns a result of type T.
 *
 * @param transform A function that takes a Response and returns a transformed result of type T.
 * @return A result of type T obtained from the transformed response.
 * @throws ApiResponseException if the response is not successful or has no body.
 */
fun <T> Call.doSync(transform: (Response) -> T): T {
        return execute().use { response ->
            if (!response.isSuccessful || response.body == null) {
                throw ApiResponseException(message = response.message)
            } else {
                transform(response)
            }
        }
    }
