import { TestInfo } from '@playwright/test';
import { Record } from "../types/types";
import ApiClient from "./api-client";
import AuthHelper from "./auth-helper";
import { admin } from "../config/auth.config";

export class CleanupHelper {
  private records: { type: string, data: Record }[] = [];

  constructor(
    private testInfo: TestInfo,
    private apiClient: ApiClient,
    private authHelper: AuthHelper
  ) { }

  register(entryOrEntries: { type: string, data: Record } | { type: string, data: Record }[]): void {
    const entries = Array.isArray(entryOrEntries) ? entryOrEntries : [entryOrEntries];
    for (const entry of entries) {
      this.records.push(entry);
    }
  }

  async cleanup(): Promise<void> {
    await this.testInfo.attach('cleanup-records', { body: JSON.stringify(this.records) });

    await this.authHelper.login_as(admin);

    for (const { type, data } of this.records) {
      const recordId = data[`${type}id`];
      if (!recordId) {
        console.warn(`Missing ID for type ${type} in record:`, data);
        continue;
      }
      await this.apiClient.delete(`${type}/${recordId}`);
    }

    await this.authHelper.logout();
  }
} 