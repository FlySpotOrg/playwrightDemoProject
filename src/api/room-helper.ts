import { AxiosResponse } from 'axios';
import { logger } from '@utils/logger';
import { Room, RoomType } from "@types";
import ApiClient from "@/api/api-client";

export class RoomApiHelper {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async getAllRooms(): Promise<Room[]> {
    const response = await this.apiClient.get('/room/');
    return response.data.rooms;
  }

  getRoomByIdRaw(roomId: number): Promise<AxiosResponse<Room>> {
    return this.apiClient.get(`/room/${roomId}`, {
      validateStatus: () => true,
    });
  }

  async getRoomById(roomId: number): Promise<Room> {
    const response = await this.getRoomByIdRaw(roomId);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Error: ${response.status}`);
    }
  }

  async createRoom(room: Room): Promise<Room> {
    try {
      logger.info('Creating new room:', room);
      const created = await this.apiClient.post('/room/', { data: room });
      if (created) logger.info('Successfully created room');
      return (await this.getAllRooms()).find(r => r.roomName == room.roomName);
    } catch (error) {
      logger.error('Failed to create room:', error);
      throw error;
    }
  }

  async updateRoom(id: number, room: Room): Promise<Room> {
    try {
      logger.info(`Updating room with ID ${id}:`, room);
      await this.apiClient.put(`/room/${id}`, { data: room });
      logger.info('Successfully updated room');
      return (await this.getRoomById(id));
    } catch (error) {
      logger.error(`Failed to update room with ID ${id}:`, error);
      throw error;
    }
  }

  async deleteRoom(roomId: number): Promise<void> {
    await this.apiClient.delete(`/room/${roomId}`);
  }

  sample(roomName: string, type: RoomType): Room {
    let roomPrice: number;
    switch (type) {
      case 'Single':
        roomPrice = 100;
        break;
      case 'Double':
        roomPrice = 200;
        break;
      case 'Suite':
        roomPrice = 300;
        break;
    }

    return {
      roomName,
      type,
      accessible: true,
      description: `A comfortable ${type.toLowerCase()} room with modern amenities`,
      features: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar'],
      image: 'https://www.mwtestconsultancy.co.uk/img/room1.png',
      roomPrice
    };
  }

  async deleteAllRooms(): Promise<void> {
    const rooms = await this.getAllRooms();
    if (rooms.length == 0) return;
    for (const room of rooms) {
      if (room.roomid) {
        await this.deleteRoom(room.roomid);
      }
    }
  }
} 