# playwrightDemoProject

## Running Tests

### UI Mode

```bash
npm run test:all:head
```

### Headless Mode

```bash
# Run all tests
npm run test:all:headless

# Run UI tests only
npm run test:ui

# Run API tests only
npm run test:api

# Run Smoke tests (1 UI and 1 API)
npm run test:smoke

# Run Regression tests (2 UI and 2 API)
npm run test:regression
```

## Test Reports

Test reports can be found in:

- `playwright-report/index.html` - Playwright HTML report
- `allure-report/index.html` - Allure report

### Generating Allure Reports

1. Run tests to generate results:

   ```bash
   npm run test:all:headless
   ```

2. Generate the report:

   ```bash
   npm run allure:generate
   ```

3. View the report:

   ```bash
   npm run allure:open
   ```

   Or generate and view immediately:

   ```bash
   npm run allure:serve
   ```
