# Test info

- Name: Room API Tests >> User should get all rooms
- Location: /home/runner/work/playwrightDemoProject/playwrightDemoProject/src/features/api/hotel-room.api.spec.ts:9:7

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

Expected: 200
Received: 401
    at status_is_ok (/home/runner/work/playwrightDemoProject/playwrightDemoProject/src/api/api-status-check.ts:20:27)
    at AuthHelper.login_as (/home/runner/work/playwrightDemoProject/playwrightDemoProject/src/api/auth-helper.ts:13:17)
    at CleanupHelper.cleanup (/home/runner/work/playwrightDemoProject/playwrightDemoProject/src/api/cleanup-helper.ts:26:5)
    at Object.registerCleanup (/home/runner/work/playwrightDemoProject/playwrightDemoProject/src/features/test-base.ts:41:5)
```

# Test source

```ts
   1 | import type { AxiosResponse } from "axios";
   2 | import { expect } from "@playwright/test";
   3 | import { equal } from "assert";
   4 |
   5 | export const DO_NOT_CHECK_STATUS = -1;
   6 |
   7 | export const status_is_ok = (response: AxiosResponse, status = 200): void => {
   8 |   if (status === DO_NOT_CHECK_STATUS) return;
   9 |
  10 |   const status_msg = `Received status is [${response.status}] but EXPECTED status is ${status}.\n`;
  11 |   const request_msg = `Request:\n ${response.request.path} Method: ${response.request.method}\n`;
  12 |
  13 |   let resp = JSON.stringify(response.data, null, 2);
  14 |
  15 |   if (resp.length > 1000)
  16 |     resp = `${resp.substring(0, 100)} \n[Long response(${resp.length}). First 100 characters shown]`;
  17 |
  18 |   const response_msg = `Response:\n ${resp}\n`;
  19 |
> 20 |   expect(response.status).toEqual(status);
     |                           ^ Error: expect(received).toEqual(expected) // deep equality
  21 | };
  22 |
```