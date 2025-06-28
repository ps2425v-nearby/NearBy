export const requestUrl = process.env.BACKEND_URL;

if (!requestUrl) {
    throw new Error("BACKEND_URL is not defined. Check your Webpack DefinePlugin and .env file");
}