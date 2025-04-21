import { Page, expect } from '@playwright/test';
import {Credentials} from "@types";

export class AdminPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async loginAsAdmin(adminCredentials: Credentials) {
        await this.page.getByLabel('Username').fill(adminCredentials.username);
        await this.page.getByPlaceholder('Password').fill(adminCredentials.password);
        await this.page.locator('#doLogin').click();
    }

    async verifyAdminNavigation() {
        await expect(this.page.getByRole('link', { name: 'Rooms' })).toBeVisible();
        await expect(this.page.getByRole('link', { name: 'Report' })).toBeVisible();
        await expect(this.page.getByRole('link', { name: 'Branding' })).toBeVisible();
        await expect(this.page.getByRole('link', { name: 'Messages' })).toBeVisible();
        await expect(this.page.getByRole('button', { name: 'Logout' })).toBeEnabled();
    }
} 