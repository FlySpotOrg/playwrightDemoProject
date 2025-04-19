import { expect } from '@playwright/test';
import {FrontPage} from "./front-page";
import {BookingDetails} from "../../types/types";

export class ReservationPage extends FrontPage {

    async fillBookingDetails(bd: BookingDetails) {
        await this.page.getByRole('textbox', { name: 'Firstname' }).fill(bd.firstName);
        await this.page.getByRole('textbox', { name: 'Lastname' }).fill(bd.lastName);
        await this.page.getByRole('textbox', { name: 'Email' }).fill(bd.email);
        await this.page.getByRole('textbox', { name: 'Phone' }).fill(bd.phone);
    }

    async clickReserveNow() {
        await this.page.getByRole('button', {name: 'Reserve Now'}).click();
    }

    async verifyBookingConfirmationMessage() {
        await expect(this.page.getByText('Booking Confirmed')).toBeVisible();
    }
} 