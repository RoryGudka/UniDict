import { ApiError } from "@/_types/errors";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface RequestOptions {
  authToken?: string;
  params?: Record<string, string>;
  signal?: AbortSignal;
}

interface RequestConfigWithBody extends RequestOptions {
  body: unknown;
}

// Helper to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(response.statusText, response.status, errorData);
  }

  // Handle both JSON responses and empty responses (204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// Helper to build URL with query parameters
function buildUrl(endpoint: string, params?: Record<string, string>): string {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }
  return url.toString();
}

// Helper to create headers with optional auth token
function createHeaders(authToken?: string): Headers {
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  if (authToken) {
    headers.append("Authorization", `Bearer ${authToken}`);
  }

  return headers;
}

// GET request
export async function get<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { authToken, params, signal } = options;
  const url = buildUrl(endpoint, params);

  const response = await fetch(url, {
    method: "GET",
    headers: createHeaders(authToken),
    signal,
  });

  return handleResponse<T>(response);
}

// POST request
export async function post<T>(
  endpoint: string,
  { body, authToken, signal }: RequestConfigWithBody
): Promise<T> {
  const url = buildUrl(endpoint);

  const response = await fetch(url, {
    method: "POST",
    headers: createHeaders(authToken),
    body: JSON.stringify(body),
    signal,
  });

  return handleResponse<T>(response);
}

// PUT request
export async function put<T>(
  endpoint: string,
  { body, authToken, signal }: RequestConfigWithBody
): Promise<T> {
  const url = buildUrl(endpoint);

  const response = await fetch(url, {
    method: "PUT",
    headers: createHeaders(authToken),
    body: JSON.stringify(body),
    signal,
  });

  return handleResponse<T>(response);
}

// DELETE request
export async function del<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { authToken, signal } = options;
  const url = buildUrl(endpoint);

  const response = await fetch(url, {
    method: "DELETE",
    headers: createHeaders(authToken),
    signal,
  });

  return handleResponse<T>(response);
}

// Export type for use in other files
export type { RequestOptions, RequestConfigWithBody };
