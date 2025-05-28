# Test info

- Name: @neevadmin-compass-integration @UI Hotel Booking Website Tests >> Admin should handle login
- Location: /home/runner/work/playwrightDemoProject/playwrightDemoProject/src/features/ui/hotel-room.ui.spec.ts:90:7

# Error details

```
Error: browserType.launch: 
╔══════════════════════════════════════════════════════╗
║ Host system is missing dependencies to run browsers. ║
║ Missing libraries:                                   ║
║     libgtk-4.so.1                                    ║
║     libgraphene-1.0.so.0                             ║
║     libwoff2dec.so.1.0.2                             ║
║     libvpx.so.9                                      ║
║     libevent-2.1.so.7                                ║
║     libopus.so.0                                     ║
║     libgstallocators-1.0.so.0                        ║
║     libgstapp-1.0.so.0                               ║
║     libgstpbutils-1.0.so.0                           ║
║     libgstaudio-1.0.so.0                             ║
║     libgsttag-1.0.so.0                               ║
║     libgstvideo-1.0.so.0                             ║
║     libgstgl-1.0.so.0                                ║
║     libgstcodecparsers-1.0.so.0                      ║
║     libgstfft-1.0.so.0                               ║
║     libflite.so.1                                    ║
║     libflite_usenglish.so.1                          ║
║     libflite_cmu_grapheme_lang.so.1                  ║
║     libflite_cmu_grapheme_lex.so.1                   ║
║     libflite_cmu_indic_lang.so.1                     ║
║     libflite_cmu_indic_lex.so.1                      ║
║     libflite_cmulex.so.1                             ║
║     libflite_cmu_time_awb.so.1                       ║
║     libflite_cmu_us_awb.so.1                         ║
║     libflite_cmu_us_kal16.so.1                       ║
║     libflite_cmu_us_kal.so.1                         ║
║     libflite_cmu_us_rms.so.1                         ║
║     libflite_cmu_us_slt.so.1                         ║
║     libavif.so.16                                    ║
║     libharfbuzz-icu.so.0                             ║
║     libsecret-1.so.0                                 ║
║     libhyphen.so.0                                   ║
║     libmanette-0.2.so.0                              ║
║     libGLESv2.so.2                                   ║
║     libx264.so                                       ║
╚══════════════════════════════════════════════════════╝
```

# Test source

```ts
   1 | import { test } from "../test-base";
   2 | import { HomePage, RoomsPage, ReservationPage, AdminPage } from "../../ui/pages";
   3 | import { Credentials, BookingDetails, ContactForm } from "../../types/types";
   4 | import { admin } from "../../config/auth.config";
   5 |
   6 | let homePage: HomePage;
   7 | let roomsPage: RoomsPage;
   8 | let reservationPage: ReservationPage;
   9 | let adminPage: AdminPage;
   10 |
   11 | test.describe("@neevadmin-compass-integration @UI Hotel Booking Website Tests", () => {
   12 |   test.beforeEach(async ({ page }) => {
   13 |     homePage = new HomePage(page);
   14 |     roomsPage = new RoomsPage(page);
   15 |     reservationPage = new ReservationPage(page);
   16 |     adminPage = new AdminPage(page);
   17 |   });
   18 |
   19 |   test(
   20 |     "User should be able to book a room",
   21 |     { tag: ["@smoke", "@regression"] },
   22 |     async ({ authHelper, bookingApiHelper, roomApiHelper }) => {
   23 |
   24 |       const bookingDetails: BookingDetails = {
   25 |         firstName: "John",
   26 |         lastName: "Doe",
   27 |         email: "john.doe@example.com",
   28 |         phone: "12345678900",
   29 |       };
   30 |
   31 |       await test.step("Given I have a free Single room", async () => {
   32 |         await authHelper.login_as(admin);
   33 |         const allRooms = await roomApiHelper.getAllRooms();
   34 |         const singleRoom = allRooms.find((room) => room.type === "Single");
   35 |         if (!singleRoom || !singleRoom.roomid) {
   36 |           throw new Error("No Single room found");
   37 |         }
   38 |         await bookingApiHelper.deleteAllBookings(singleRoom.roomid);
   39 |         await authHelper.logout();
   40 |       });
   41 |
   42 |       await test.step("And I am on the home page", async () => {
   43 |         await homePage.navigateToHome();
   44 |       });
   45 |
   46 |       await test.step("When I initiate a room reservation", async () => {
   47 |         await roomsPage.clickBookNowButton();
   48 |         await roomsPage.selectRoom("Single");
   49 |         await reservationPage.clickReserveNow();
   50 |       });
   51 |
   52 |       await test.step("And I enter my booking details and confirm reservation", async () => {
   53 |         await reservationPage.fillBookingDetails(bookingDetails);
   54 |         await reservationPage.clickReserveNow();
   55 |       });
   56 |
   57 |       await test.step("Then confirmation message should be displayed", async () => {
   58 |         await reservationPage.verifyBookingConfirmationMessage();
   59 |       });
   60 |     }
   61 |   );
   62 |
   63 |   test("User should be able to submit contact form", { tag: ["@regression"] }, async ({}) => {
   64 |     const contactFormData: ContactForm = {
   65 |       name: "Jane Smith",
   66 |       email: "jane.smith@example.com",
   67 |       phone: "12345678900",
   68 |       subject: "Test Inquiry",
   69 |       message: "This is a test message",
   70 |     };
   71 |
   72 |     await test.step("Given I am on the home page", async () => {
   73 |       await homePage.navigateToHome();
   74 |     });
   75 |
   76 |     await test.step("When I navigate to the contact page", async () => {
   77 |       await roomsPage.navigateToContact();
   78 |     });
   79 |
   80 |     await test.step("And I fill out the contact form", async () => {
   81 |       await roomsPage.fillContactForm(contactFormData);
   82 |     });
   83 |
   84 |     await test.step("Then I should be able to submit the form successfully", async () => {
   85 |       await roomsPage.submitContactForm();
   86 |       await roomsPage.verifyContactSubmissionMessage(contactFormData.name);
   87 |     });
   88 |   });
   89 |
>  90 |   test("Admin should handle login", { tag: ["@regression"] }, async ({}) => {
      |       ^ Error: browserType.launch: 
   91 |     const adminCredentials: Credentials = {
   92 |       username: "admin",
   93 |       password: "password",
   94 |     };
   95 |
   96 |     await test.step("Given I am on the home page", async () => {
   97 |       await homePage.navigateToHome();
   98 |     });
   99 |
  100 |     await test.step("When I navigate to the admin page", async () => {
  101 |       await roomsPage.navigateToAdmin();
  102 |     });
  103 |
  104 |     await test.step("And I enter valid admin credentials", async () => {
  105 |       await adminPage.loginAsAdmin(adminCredentials);
  106 |     });
  107 |
  108 |     await test.step("Then I should see the admin dashboard", async () => {
  109 |       await adminPage.verifyAdminNavigation();
  110 |     });
  111 |   });
  112 | });
  113 |
```