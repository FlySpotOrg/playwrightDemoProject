import {Page} from "@playwright/test";
import { environments } from "src/config/auth.config";

export class FrontPage {
    protected page: Page;
    protected baseURL: string;

    constructor(page: Page) {
        this.page = page;
        this.baseURL = environments[process.env.ENV].applications.neevadmin.baseURL;
    }

    async navigateToHome() {
        await this.page.goto(`${this.baseURL}/`);
        await this.page.locator('.spinner-border').waitFor({state: 'hidden'});
    }
}