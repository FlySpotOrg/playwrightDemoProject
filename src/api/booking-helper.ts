import { Booking } from "../types/types";
import ApiClient from "./api-client";

export class BookingApiHelper {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async getAllBookings(roomId: number): Promise<Booking[]> {
    const response = await this.apiClient.get(`/booking/?roomid=${roomId}`);
    return response.data.bookings;
  }

  async deleteBooking(bookingid: number): Promise<void> {
    await this.apiClient.delete(`/booking/${bookingid}`);
  }

  async deleteAllBookings(roomId: number): Promise<void> {
    const bookings = await this.getAllBookings(roomId);
    if (bookings.length == 0) return;
    for (const booking of bookings) {
      if (booking.bookingid) {
        await this.deleteBooking(booking.bookingid);
      }
    }
  }
} 