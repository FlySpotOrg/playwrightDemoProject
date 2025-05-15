import { test as baseTest, expect } from "@playwright/test";
import AuthHelper from "../api/auth-helper";
import { logger } from "../utils/logger";
import { Record } from "../types/types";
import ApiClient from "../api/api-client";
import { CleanupHelper } from "../api/cleanup-helper";
import { RoomApiHelper } from "../api/room-helper";
import { BookingApiHelper } from "../api/booking-helper";
import allure from "allure-js-commons";

baseTest.beforeEach(async ({}, testInfo) => {
  for (const annotation of testInfo.annotations) {
    if (annotation.type === 'tag') {
      allure.tag(annotation.description);
      allure.suite(annotation.description);
    }
  }
});

export const test = baseTest.extend<{
  apiClient: ApiClient;
  authHelper: AuthHelper;
  roomApiHelper: RoomApiHelper;
  bookingApiHelper: BookingApiHelper;
  logger: typeof logger;
  registerCleanup: (entry: { type: string; data: Record } | { type: string; data: Record }[]) => void;
}>({
  apiClient: async ({}, use) => {
    const client = new ApiClient();
    await use(client);
  },

  authHelper: async ({ apiClient }, use) => {
    const authHelper = new AuthHelper(apiClient);
    await use(authHelper);
  },

  roomApiHelper: async ({ apiClient }, use) => {
    const roomHelper = new RoomApiHelper(apiClient);
    await use(roomHelper);
  },

  bookingApiHelper: async ({ apiClient }, use) => {
    const bookingHelper = new BookingApiHelper(apiClient);
    await use(bookingHelper);
  },

  registerCleanup: async ({ apiClient, authHelper }, use, testInfo) => {
    const cleanupHelper = new CleanupHelper(testInfo, apiClient, authHelper);
    await use((entry) => cleanupHelper.register(entry));
    await cleanupHelper.cleanup();
  },

  logger: [
    async ({}, use) => {
      await use(logger);
    },
    { auto: true },
  ],
});

export { expect };
