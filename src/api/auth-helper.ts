import AxiosInstance from 'axios';
import { logger } from '@utils/logger.js';
import ApiClient from '@/api/api-client';
import { Credentials } from "@types";
import { status_is_ok } from '@api/api-status-check';


export default class AuthHelper {
  constructor(private apiClient: ApiClient) { }

  async login_as(credentials: Credentials): Promise<void> {
    logger.debug(`The user ${credentials.username} is logged in.`);
    const response = await this.apiClient.post('/auth/login', { data: credentials });
    status_is_ok(response, 200);

    if ('token' in response.data) {
      this.apiClient.token = response.data.token;
      this.apiClient.credentials = credentials;
    }

    logger.debug(`The auth token is set.`);
  }

  async logout(): Promise<void> {
    this.apiClient.token = '';
    delete AxiosInstance.defaults.headers.common['Cookie'];
    this.apiClient.credentials = {} as Credentials;
    logger.info('User has been logged out.');
  }

} 