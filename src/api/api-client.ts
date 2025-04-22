import type { AxiosInstance, AxiosRequestConfig } from "axios";
import axios from "axios";
import { logger } from "../utils/logger";
import { Credentials } from "../types/types";
import config from "playwright.config";

export default class ApiClient {
  protected _token: string;
  private _credentials: Credentials;
  protected axios_instance: AxiosInstance;

  public constructor() {
    const baseURL = config.use.baseURL.concat("/api");
    const axiosConfig = {
      baseURL: baseURL,
      validateStatus: null,
      headers: {
        "Content-Type": "application/json",
      },
    };

    this.axios_instance = axios.create(axiosConfig);

    let retries = 5;

    this.axios_instance.interceptors.response.use(async (config) => {
      const original_request = config.config as AxiosRequestConfig & { __retried: number };

      if ([423, 429, 403, 409].some((error_status_code) => error_status_code === config.status) && retries) {
        retries--;

        const timeout = config.headers["retry-after"] ? parseInt(config.headers["retry-after"], 10) * 1000 : 5000;

        const sleep = (milliseconds) => {
          return new Promise((resolve) => setTimeout(resolve, milliseconds));
        };

        logger.debug(`Received status: ${config.status}. Retrying after ${timeout}. Attempts left: ${retries}`);
        await sleep(timeout);

        return this.axios_instance.request(original_request);
      }

      const { method, url, params } = config.config as AxiosRequestConfig;
      const { status, data: responseData, headers: responseHeaders } = config;
      logger.info(
        `[HTTP RESPONSE] ${method?.toUpperCase()} ${url} → ${status}\n` +
          `  ← params: ${JSON.stringify(params)}\n` +
          `  ← data: ${JSON.stringify(responseData)}\n` +
          `  ← headers: ${JSON.stringify(responseHeaders)}`
      );

      return config;
    });

    this.axios_instance.interceptors.request.use((config: any) => {
      const { method, baseURL, url, params, data, headers } = config as AxiosRequestConfig;

      if (this.token) {
        config.headers["Cookie"] = `token=${this._token}`;
      } else {
        delete config.headers["Cookie"];
      }

      logger.info(
        `[HTTP REQUEST] ${method?.toUpperCase()} ${baseURL}${url}\n` +
          `  → params: ${JSON.stringify(params)}\n` +
          `  → data:   ${JSON.stringify(data)}\n` +
          `  → headers:${JSON.stringify(headers)}`
      );

      return config;
    });
  }

  set token(token: string) {
    this._token = token;
  }

  get token(): string {
    return this._token;
  }

  set credentials(value: Credentials) {
    this._credentials = value;
  }

  get credentials(): Credentials {
    return this._credentials;
  }

  async get(url: string, config?: AxiosRequestConfig) {
    return this.axios_instance.request({ method: "GET", url, ...config });
  }

  async post(url: string, config?: AxiosRequestConfig) {
    return this.axios_instance.request({ method: "POST", url, ...config });
  }

  async delete(url: string, config?: AxiosRequestConfig) {
    return this.axios_instance.request({ method: "DELETE", url, ...config });
  }

  async put(url: string, config?: AxiosRequestConfig) {
    return this.axios_instance.request({ method: "PUT", url, ...config });
  }
}
