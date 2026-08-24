/**
 * Single source of truth for admin credentials.
 * Used to protect the Swagger UI and the write endpoints (PATCH / DELETE).
 *
 * Values come from environment variables so no secret lives in source control.
 * Set ADMIN_USERNAME / ADMIN_PASSWORD in the server's .env file.
 */
export const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME ?? 'admin',
  password: process.env.ADMIN_PASSWORD ?? '',
};
