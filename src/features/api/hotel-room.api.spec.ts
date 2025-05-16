import { expect } from "@playwright/test";
import { test } from "../test-base";
import { Room } from "../../types/types";
import { admin } from "../../config/auth.config";
import { getRandomDigits } from "../../utils/randomizer";
import { AxiosResponse } from "axios";

test.describe("Room API Tests", () => {
  test(
    "User should get all rooms",
    { tag: ["@smoke", "@regression", "@new"] },
    async ({ roomApiHelper: roomApi, authHelper, registerCleanup }) => {
      let allRooms: Room[];
      let createdRoom1: Room, createdRoom2: Room, createdRoom3: Room;

      await test.step("Given I have three rooms", async () => {
        const roomSample1 = roomApi.sample(`Single ${getRandomDigits(8)}`, "Single");
        const roomSample2 = roomApi.sample(`Double ${getRandomDigits(8)}`, "Double");
        const roomSample3 = roomApi.sample(`Suite ${getRandomDigits(8)}`, "Suite");

        await authHelper.login_as(admin);
        createdRoom1 = await roomApi.createRoom(roomSample1);
        createdRoom2 = await roomApi.createRoom(roomSample2);
        createdRoom3 = await roomApi.createRoom(roomSample3);
        await authHelper.logout();
      });

      await test.step("When I retrieve all rooms", async () => {
        allRooms = await roomApi.getAllRooms();
      });

      await test.step("Then I should see all three rooms", async () => {
        expect(allRooms).toEqual(expect.arrayContaining([createdRoom1, createdRoom2, createdRoom3]));
      });

      registerCleanup([
        { type: "room", data: createdRoom1 },
        { type: "room", data: createdRoom2 },
        { type: "room", data: createdRoom3 },
      ]);
    }
  );

  test(
    "User should get a specific room by ID",
    { tag: ["@regression", "@admin"] },
    async ({ roomApiHelper: roomApi, authHelper, registerCleanup }) => {
      let createdRoom: Room, retrievedRoom: Room;

      await test.step("Given I have a room", async () => {
        await authHelper.login_as(admin);
        const roomSample = roomApi.sample(`Double ${getRandomDigits(8)}`, "Double");
        createdRoom = await roomApi.createRoom(roomSample);
        await authHelper.logout();
      });

      await test.step("When I retrieve the room by ID", async () => {
        retrievedRoom = await roomApi.getRoomById(createdRoom.roomid);
      });

      await test.step("Then I should see get all room details", async () => {
        expect(retrievedRoom).toStrictEqual(createdRoom);
      });

      registerCleanup({ type: "room", data: createdRoom });
    }
  );

  test("User should not get a non-existent room by ID", async ({ roomApiHelper: roomApi }) => {
    let response: AxiosResponse<Room>;
    let nonExistentId: number;

    await test.step("Given I have a non-existent room ID", async () => {
      nonExistentId = 99999;
    });

    await test.step("When I retrieve the room by ID", async () => {
      response = await roomApi.getRoomByIdRaw(nonExistentId);
    });

    await test.step("Then I should see an error", async () => {
      expect(response.status).toEqual(500);
    });
  });

  test("User should create a new room", async ({ roomApiHelper: roomApi, authHelper, registerCleanup }) => {
    let roomParams: Room, createdRoom: Room;

    await test.step("Given I have a room parameters", async () => {
      roomParams = roomApi.sample(`Single ${getRandomDigits(8)}`, "Single");
    });

    await test.step("When I create the room with the parameters", async () => {
      await authHelper.login_as(admin);
      createdRoom = await roomApi.createRoom(roomParams);
      await authHelper.logout();
    });

    await test.step("Then created room should have the same parameters", async () => {
      expect(createdRoom).toEqual(
        expect.objectContaining({
          roomName: roomParams.roomName,
          type: roomParams.type,
          accessible: roomParams.accessible,
          description: roomParams.description,
          features: roomParams.features,
          image: roomParams.image,
          roomPrice: roomParams.roomPrice,
        })
      );
    });

    registerCleanup({ type: "room", data: createdRoom });
  });

  test("Admin should update an existing room", async ({ roomApiHelper: roomApi, authHelper, registerCleanup }) => {
    let createdRoom: Room, updatedRoom: Room, updatedParams: Room;

    await test.step("Given I have a room", async () => {
      await authHelper.login_as(admin);
      const roomParams = roomApi.sample(`Double ${getRandomDigits(8)}`, "Double");
      createdRoom = await roomApi.createRoom(roomParams);
    });

    await test.step("When I update the room", async () => {
      updatedParams = { ...createdRoom, description: `Updated description ${getRandomDigits(8)}` };
      updatedRoom = await roomApi.updateRoom(updatedParams.roomid, updatedParams);
    });

    await test.step("Then updated room should have updated parameters", async () => {
      expect(updatedRoom).toStrictEqual(updatedParams);
    });

    registerCleanup({ type: "room", data: createdRoom });
  });

  test("Admin should delete a room", async ({ roomApiHelper: roomApi, authHelper }) => {
    let createdRoom: Room;

    await test.step("Given I have a room", async () => {
      await authHelper.login_as(admin);
      const roomParams = roomApi.sample(`Double ${getRandomDigits(8)}`, "Double");
      createdRoom = await roomApi.createRoom(roomParams);
    });

    await test.step("When I delete the room", async () => {
      await roomApi.deleteRoom(createdRoom.roomid);
    });

    await test.step("Then the room should be deleted", async () => {
      const response = await roomApi.getRoomByIdRaw(createdRoom.roomid);
      expect(response.status).toEqual(500);
    });
  });

  test("User should find rooms with type Single", async ({ roomApiHelper: roomApi, authHelper, registerCleanup }) => {
    let createdRoom: Room;
    let singleRooms: Room[];

    await test.step("Given I have a Single room", async () => {
      await authHelper.login_as(admin);
      const roomParams = roomApi.sample(`Single ${getRandomDigits(8)}`, "Single");
      createdRoom = await roomApi.createRoom(roomParams);
    });

    await test.step("When I retrieve all rooms and filter by type Single", async () => {
      const allRooms = await roomApi.getAllRooms();
      singleRooms = allRooms.filter((room) => room.type === "Single");
    });

    await test.step("Then I should see my Single room in the results", async () => {
      expect(singleRooms.length).toBeGreaterThan(0);
      expect(singleRooms).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            roomid: createdRoom.roomid,
            type: "Single",
          }),
        ])
      );
    });

    registerCleanup({ type: "room", data: createdRoom });
  });
});
