export interface Credentials {
    username: string;
    password: string;
}

export interface ContactForm {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}

export interface BookingDetails {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

export type RoomType = 'Suite' | 'Double' | 'Single';

export interface Room {
    roomid?: number;
    roomName: string;
    type: RoomType;
    accessible: boolean;
    image: string;
    description: string;
    features: string[];
    roomPrice: number;
}

export interface Booking {
    bookingid: number; // int32
    roomid: number; // int32, >= 1
    firstname: string; // 3 to 18 characters
    lastname: string;  // 3 to 30 characters
    depositpaid: boolean;
    email: string; // >= 1 character
    phone: string; // 11 to 21 characters
    bookingdates: {
        checkin: string;  // ISO 8601 date e.g. '2025-04-20'
        checkout: string; // ISO 8601 date
    };
}

export type Record = Room | Booking;