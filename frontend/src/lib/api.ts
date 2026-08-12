export interface ApiResult<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(path, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    const body = await res.json();
    if (!res.ok) {
      return { ok: false, error: body?.error || `Request failed (${res.status})` };
    }
    return { ok: true, data: body as T };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Network error" };
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  del: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
