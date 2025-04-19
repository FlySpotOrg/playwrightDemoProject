import {Page} from "@playwright/test";

export class FrontPage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigateToHome() {
        await this.page.goto('/');
        await this.page.locator('.spinner-border').waitFor({state: 'hidden'});
    }
}