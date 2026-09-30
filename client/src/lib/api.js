// Small wrapper around fetch for our Express API.
// Usage: const data = await api("/auth/login", { method: "POST", body: { email, password } })

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export async function api(path, { method = "GET", body, headers, ...options } = {}) {
  const isForm = body instanceof FormData;

  let res;
  try {
    res = await fetch(`/api${path}`, {
      method,
      credentials: "include", // send the login cookie
      headers: {
        ...(body && !isForm && { "Content-Type": "application/json" }),
        ...headers,
      },
      body: body && !isForm ? JSON.stringify(body) : body,
      ...options,
    });
  } catch {
    throw new ApiError(
      "Can't reach the server. Please check your connection and try again.",
      0
    );
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(
      data?.message || `Something went wrong (${res.status})`,
      res.status,
      data
    );
  }

  return data;
}
