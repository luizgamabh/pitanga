export interface HttpClientConfig {
  baseUrl: string;
  getAccessToken?: () => string | null;
  onTokenRefresh?: (tokens: { accessToken: string; refreshToken: string }) => void;
  onAuthError?: () => void;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
}

export class HttpClient {
  private baseUrl: string;
  private getAccessToken?: () => string | null;
  private onTokenRefresh?: (tokens: { accessToken: string; refreshToken: string }) => void;
  private onAuthError?: () => void;
  private isRefreshing = false;
  private refreshPromise: Promise<boolean> | null = null;

  constructor(config: HttpClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.getAccessToken = config.getAccessToken;
    this.onTokenRefresh = config.onTokenRefresh;
    this.onAuthError = config.onAuthError;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options?.headers,
    };

    const accessToken = this.getAccessToken?.();
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      credentials: options?.credentials ?? 'include',
    });

    // Handle 401 - try to refresh token
    if (response.status === 401 && this.onTokenRefresh) {
      const refreshed = await this.handleTokenRefresh();
      if (refreshed) {
        // Retry the request with new token
        return this.request<T>(method, path, body, options);
      }
      this.onAuthError?.();
      throw new ApiError('Unauthorized', 401);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) as { message?: string };
      throw new ApiError(
        errorData.message || response.statusText,
        response.status,
        errorData,
      );
    }

    // Handle empty responses
    const text = await response.text();
    if (!text) {
      return {} as T;
    }

    return JSON.parse(text) as T;
  }

  private async handleTokenRefresh(): Promise<boolean> {
    // Prevent multiple refresh requests
    if (this.isRefreshing) {
      return this.refreshPromise ?? false;
    }

    this.isRefreshing = true;
    this.refreshPromise = this.performRefresh();

    try {
      return await this.refreshPromise;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  private async performRefresh(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        return false;
      }

      const tokens = await response.json() as { accessToken: string; refreshToken: string };
      this.onTokenRefresh?.(tokens);
      return true;
    } catch {
      return false;
    }
  }

  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('GET', path, undefined, options);
  }

  async post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('POST', path, body, options);
  }

  async put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('PUT', path, body, options);
  }

  async patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('PATCH', path, body, options);
  }

  async delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('DELETE', path, undefined, options);
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
