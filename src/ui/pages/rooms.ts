import { expect } from '@playwright/test';
import {FrontPage} from "@ui/pages/front-page";
import {ContactForm} from "@types";

export class RoomsPage extends FrontPage {

    async clickBookNowButton() {
        await this.page.locator('.hero')
            .getByRole('link', { name: 'Book Now'}).click();
    }

    async selectRoom(description: string) {
        await this.page.locator(
            `.card:has(.card-title:has-text("${description}")) .btn-primary`).click();
    }

    async navigateToContact() {
        await this.page.getByRole('navigation').getByRole('link', { name: 'Contact' }).click();
    }

    async fillContactForm(cf: ContactForm) {
        await this.page.getByTestId('ContactName').fill(cf.name);
        await this.page.getByTestId('ContactEmail').fill(cf.email);
        await this.page.getByTestId('ContactPhone').fill(cf.phone);
        await this.page.getByTestId('ContactSubject').fill(cf.subject);
        await this.page.getByTestId('ContactDescription').fill(cf.message);
    }

    async submitContactForm() {
        await this.page.getByRole('button', { name: 'Submit' }).click();
    }

    async verifyContactSubmissionMessage(name: string) {
        await expect(this.page.getByText(`Thanks for getting in touch ${name}!`)).toBeVisible();
    }

    async navigateToAdmin() {
        await this.page.goto('/admin');
    }
} 