import { HttpClient, HttpClientConfig, ApiError } from './http-client';
import { AuthApi } from './auth';

export interface ApiClientConfig extends HttpClientConfig {}

export class ApiClient {
  private readonly http: HttpClient;
  public readonly auth: AuthApi;

  constructor(config: ApiClientConfig) {
    this.http = new HttpClient(config);
    this.auth = new AuthApi(this.http);
  }

  // Add more API modules here as needed
  // public readonly users: UsersApi;
  // public readonly screens: ScreensApi;
  // etc.
}

export function createApiClient(config: ApiClientConfig): ApiClient {
  return new ApiClient(config);
}

export { HttpClient, ApiError };
export type { HttpClientConfig };
