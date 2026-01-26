import axios, { AxiosInstance, AxiosError } from 'axios';

export class HttpClient {
  private client: AxiosInstance;

  constructor(baseURL: string, timeout: number = 10000) {
    this.client = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async get<T>(path: string, headers?: Record<string, string>): Promise<T> {
    try {
      const response = await this.client.get<T>(path, { headers });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async post<T>(path: string, data?: any, headers?: Record<string, string>): Promise<T> {
    try {
      const response = await this.client.post<T>(path, data, { headers });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async put<T>(path: string, data?: any, headers?: Record<string, string>): Promise<T> {
    try {
      const response = await this.client.put<T>(path, data, { headers });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async delete<T>(path: string, headers?: Record<string, string>): Promise<T> {
    try {
      const response = await this.client.delete<T>(path, { headers });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private handleError(error: any) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        // Server responded with error
        throw {
          statusCode: axiosError.response.status,
          message: axiosError.response.statusText,
          data: axiosError.response.data,
        };
      } else if (axiosError.request) {
        // Request made but no response
        throw {
          statusCode: 503,
          message: 'Service unavailable',
        };
      }
    }
    throw error;
  }
}
