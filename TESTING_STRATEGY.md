# Logic League: Testing Strategy

This document outlines the testing strategy for the Logic League application to ensure its quality, reliability, and functionality. The strategy is divided into three main categories: Unit Testing, Integration Testing, and End-to-End (E2E) Testing.

## 1. Guiding Principles
- **User-Centric:** All testing efforts prioritize critical user journeys to ensure the application delivers on its core value proposition.
- **Automated:** Where possible, tests will be automated to ensure consistency and enable rapid regression testing.
- **Comprehensive:** The strategy aims to cover UI components, service interactions, and full application flows.

---

## 2. Testing Levels

### 2.1 Unit Testing
**Objective:** To test individual components and functions in isolation to verify they work as expected.
**Tools:** Jest, React Testing Library (RTL).
**Scope:**
-   **React Components:**
    -   `SearchForm`: Test that input fields update state correctly and the `onSearch` callback is fired with the correct data on submission.
    -   `CareerNavBar`: Verify that clicking a button calls the `onCareerSelect` prop with the correct career field.
    -   `AuthModal`: Test switching between "Login" and "Register" modes and form validation logic.
    -   `CareerAvailabilityChart`: Test that the component renders the skeleton loader correctly in its loading state and displays the bars and tooltips correctly when passed mock data.
-   **Service Functions (`geminiService.ts`):**
    -   Mock the `@google/genai` library to test that functions like `findJobs`, `generateCareerImage`, and `getCareerAvailability` construct the correct prompts and handle successful or failed API responses gracefully without making actual network requests.
-   **Utility Functions:**
    -   Test helper functions like `decodeAudioData` with sample data to ensure they produce the correct output format.

### 2.2 Integration Testing
**Objective:** To verify that different parts of the application work together correctly.
**Tools:** React Testing Library (RTL).
**Scope:**
-   **Search and Display Flow:** Test the integration between `SearchForm`, `App.tsx` (state management), `ResultsList`, and `CareerAvailabilityChart`. This involves simulating a search and asserting that the components display the mocked data returned from the service layer.
-   **Authentication Flow:** Test the integration between `Header`, `AuthModal`, and `App.tsx`. A test would simulate a user clicking "Sign In," completing the form, and verifying that the `Header` updates to show the user's name and the main view changes.
-   **Favorites Management:** Test that clicking the favorite icon in `ResultsList` correctly updates the application state in `App.tsx` and that this state is correctly passed to and displayed in `MyCareerPage`.

### 2.3 End-to-End (E2E) Testing
**Objective:** To test the application from the user's perspective, simulating complete workflows in a browser-like environment. This is the highest level of testing and covers critical user journeys.
**Tools:** Cypress or Playwright.
**Scope:** E2E tests will cover the critical user journeys listed below.

---

## 3. Critical User Journeys for E2E Testing

1.  **New User Registration and First Search:**
    -   User lands on the main page.
    -   User clicks "Sign In," then switches to "Register."
    -   User fills out the registration form and submits.
    -   User is redirected to the "My Career" page.
    -   User navigates back to the main search page.
    -   User performs a job search for "Marketing".
    -   Assert that a career banner, the "Global Career Opportunity Scale" chart, loading indicators, and finally, a list of jobs are displayed.

2.  **Existing User Login and Saved Job Management:**
    -   User lands on the main page and logs in.
    -   User performs a search.
    -   User clicks the star icon to save the first two jobs to their favorites.
    -   User navigates to the "My Career" page.
    -   Assert that the two saved jobs are listed in the "Your Saved Jobs" section.
    -   User removes one job.
    -   Assert that the job is removed from the list.

3.  **Saving and Rerunning a Search:**
    -   A logged-in user performs a search for "Engineering" in "Cape Town".
    -   User clicks the "Save This Search" button.
    -   User navigates to the "My Career" page.
    -   Assert that the "Engineering - Cape Town" search is listed.
    -   User clicks the "Run Search" button for that saved search.
    -   Assert that the user is navigated back to the main page and a search is automatically executed with the correct criteria.

4.  **Audio Summary Generation:**
    -   User performs a successful job search.
    -   User clicks the "Listen to Summary" button.
    -   Assert that the button enters a loading state.
    -   (Requires advanced mocking) Assert that an audio playback is initiated.

5.  **Prompt History Verification:**
    -   A logged-in user performs a job search (which implicitly generates an image and chart data) and requests an audio summary.
    -   User navigates to the "My Career" page.
    -   Assert that four new items appear in the "Prompt History" section: 'Job Search', 'Image Generation', 'Career Availability', and 'Audio Summary'.
    -   User clicks on the 'Job Search' item.
    -   Assert that the accordion expands to show the full text of the prompt that was sent to the AI.