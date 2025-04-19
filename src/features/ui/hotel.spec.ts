import { test } from '@playwright/test';
import { HomePage, RoomsPage, ReservationPage, AdminPage } from '../../ui/pages';
import { Credentials, BookingDetails, ContactForm } from "../../types/types";

test.describe('Hotel Booking Website Tests', () => {
  let homePage: HomePage;
  let roomsPage: RoomsPage;
  let reservationPage: ReservationPage;
  let adminPage: AdminPage;

  
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    roomsPage = new RoomsPage(page);
    reservationPage = new ReservationPage(page);
    adminPage = new AdminPage(page);

    await test.step('Given I am on the home page', async () => {
      await homePage.navigateToHome();
    });

  });


  test('User should be able to book a room', async ({}) => {
    const bookingDetails: BookingDetails = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '12345678900'
    };

    await test.step('When I initiate a Double room reservation', async () => {
      await roomsPage.clickBookNowButton();
      await roomsPage.selectRoomType('Double');
      await reservationPage.clickReserveNow();
    });

    await test.step('And I enter my booking details and confirm reservation', async () => {
      await reservationPage.fillBookingDetails(bookingDetails);
      await reservationPage.clickReserveNow();
    });
    
    await test.step('Then confirmation message should be displayed', async () => {
      await reservationPage.verifyBookingConfirmationMessage();
    });

  });


  test('User should be able to submit contact form', async ({}) => {
    const contactFormData: ContactForm = {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '12345678900',
      subject: 'Test Inquiry',
      message: 'This is a test message'
    }

    await test.step('When I navigate to the contact page', async () => {
      await roomsPage.navigateToContact();
    });

    await test.step('And I fill out the contact form', async () => {
      await roomsPage.fillContactForm(contactFormData);
    });
    
    await test.step('Then I should be able to submit the form successfully', async () => {
      await roomsPage.submitContactForm();
      await roomsPage.verifyContactSubmissionMessage(contactFormData.name);
    });

  });


  test('Admin should handle login', async ({}) => {
    const adminCredentials: Credentials = {
      login: 'admin',
      password: 'password'
    }

    await test.step('When I navigate to the admin page', async () => {
      await roomsPage.navigateToAdmin();
    });
    
    await test.step('And I enter valid admin credentials', async () => {
      await adminPage.loginAsAdmin(adminCredentials);
    });
    
    await test.step('Then I should see the admin dashboard', async () => {
      await adminPage.verifyAdminNavigation();
    });
  });

}); 