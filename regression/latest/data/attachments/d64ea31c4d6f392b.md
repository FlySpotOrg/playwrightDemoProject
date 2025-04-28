# Test info

- Name: Hotel Booking Website Tests >> User should be able to book a room
- Location: /home/runner/work/playwrightDemoProject/playwrightDemoProject/src/features/ui/hotel-room.ui.spec.ts:19:7

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: getByText('Booking Confirmed')
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for getByText('Booking Confirmed')

    at ReservationPage.verifyBookingConfirmationMessage (/home/runner/work/playwrightDemoProject/playwrightDemoProject/src/ui/pages/reservation.ts:18:60)
    at /home/runner/work/playwrightDemoProject/playwrightDemoProject/src/features/ui/hotel-room.ui.spec.ts:57:31
    at /home/runner/work/playwrightDemoProject/playwrightDemoProject/src/features/ui/hotel-room.ui.spec.ts:56:18
```

# Page snapshot

```yaml
- 'heading "Application error: a client-side exception has occurred while loading automationintesting.online (see the browser console for more information)." [level=2]'
```

# Test source

```ts
   1 | import { expect } from "@playwright/test";
   2 | import { FrontPage } from "../../ui/pages/front-page";
   3 | import { BookingDetails } from "../../types/types";
   4 |
   5 | export class ReservationPage extends FrontPage {
   6 |   async fillBookingDetails(bd: BookingDetails) {
   7 |     await this.page.getByRole("textbox", { name: "Firstname" }).fill(bd.firstName);
   8 |     await this.page.getByRole("textbox", { name: "Lastname" }).fill(bd.lastName);
   9 |     await this.page.getByRole("textbox", { name: "Email" }).fill(bd.email);
  10 |     await this.page.getByRole("textbox", { name: "Phone" }).fill(bd.phone);
  11 |   }
  12 |
  13 |   async clickReserveNow() {
  14 |     await this.page.getByRole("button", { name: "Reserve Now" }).click();
  15 |   }
  16 |
  17 |   async verifyBookingConfirmationMessage() {
> 18 |     await expect(this.page.getByText("Booking Confirmed")).toBeVisible();
     |                                                            ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
  19 |   }
  20 | }
  21 |
```