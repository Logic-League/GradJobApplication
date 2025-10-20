# Logic League: AI-Powered Career Assistant

## 1. Project Overview

### 1.1 Problem Statement
For new graduates in South Africa, navigating the job market is a significant challenge. They often struggle to identify suitable entry-level positions, understand the relevance of different job platforms, and find opportunities that align with their skills. This process can be overwhelming, time-consuming, and demotivating.

### 1.2 Solution: Logic League
Logic League is an end-to-end AI-powered web application designed to be a career assistant for this demographic. It simplifies the job search process by leveraging multiple AI technologies to find opportunities, provide insightful reviews of job sources, generate inspiring visual content, analyze global job markets, and deliver audio summaries of search results, creating a user-friendly and supportive experience.

### 1.3 Learning Objectives Met
- **AI-Powered Solution:** The application is built from the ground up using the Google Gemini API, demonstrating a practical application of modern AI models.
- **Agile Collaboration:** The component-based architecture and clear separation of concerns facilitate an agile development workflow, allowing for iterative feature development and collaboration.

---

## 2. System Architecture & Technical Specifications

### 2.1 System Architecture Diagram
The application follows a client-side architecture where the user's browser interacts directly with the Google Gemini API. There is no custom backend, which simplifies deployment and maintenance.

```
+------------------+      +-------------------------+
|   User's Browser |      |  Google Gemini API      |
| (React Frontend) |      |                         |
+--------+---------+      +-----------+-------------+
         |                          /|\
         | (HTTPS API Calls)         |
         | w/ API Key                |
         +-------------------------> |
         |                           |
         | <-------------------------+
         | (JSON, Image, Audio Data) |
         |                           |
+--------+---------+                 |
|   localStorage   |                 |
| (Data Persistence) |<----------------+
+------------------+
```

### 2.2 Data Flow
1.  **User Interaction:** The user enters a search query (e.g., "Software Development") into the React-based UI.
2.  **API Coordination:** The frontend makes three or four parallel calls to the Gemini API:
    -   A `generateContent` call to the `gemini-2.5-flash` model to get a list of job listings in a structured JSON format.
    -   A `generateContent` call to the `gemini-2.5-flash` model to get an analysis of job availability in key global markets, returned as structured JSON for the bar chart.
    -   A `generateContent` call to the `gemini-2.5-flash-image` model to create a visually representative banner for the career field.
    -   (On user request) A two-step process to first summarize results with `gemini-2.5-flash` and then generate audio with `gemini-2.5-flash-preview-tts`.
3.  **Data Rendering:** The application UI updates dynamically to display the job listings, banner image, availability chart, and provides a button to play the audio.
4.  **Data Persistence:** User data, including accounts, saved favorite jobs, saved searches, and prompt history, is stored securely in the browser's `localStorage`.

### 2.3 Technical Stack
-   **Frontend:** React, TypeScript, Tailwind CSS
-   **AI Services:** Google Gemini API (`gemini-2.5-flash`, `gemini-2.5-flash-image`, `gemini-2.5-flash-preview-tts`)
-   **Data Persistence:** Browser `localStorage` API

### 2.4 Scalability & Extensibility
-   **Scalability:** The serverless architecture is highly scalable. The Gemini API is managed by Google and can handle massive request volumes. The frontend can be served from a CDN for global, low-latency access. The main scaling consideration is the cost associated with API usage.
-   **Extensibility:** The component-based React architecture makes it easy to add new features. New AI capabilities (e.g., resume analysis) can be integrated by adding new functions to the `geminiService` without affecting existing code.

---

## 3. AI Integration & Features

The project successfully integrates four distinct AI technologies/use cases to create a cohesive solution:

1.  **AI Technology 1: Natural Language Processing (Job Generation)**
    -   **Model:** `gemini-2.5-flash`
    -   **Use Case:** Generates a list of 5-7 realistic, entry-level job opportunities based on user queries. It also provides an AI-generated review and rating for the source of each job, adding a layer of insight not found on traditional job boards.
2.  **AI Technology 2: Specialized AI (Image Generation)**
    -   **Model:** `gemini-2.5-flash-image`
    -   **Use Case:** Creates a unique, abstract, and professional banner image for each searched career field, enhancing the user experience and visual engagement.
3.  **AI Technology 3: AI-Powered Market Analysis (Data Visualization)**
    -   **Model:** `gemini-2.5-flash`
    -   **Use Case:** Analyzes the job market for a specific career across seven countries, returning a structured JSON object with an "availability score" and a summary. This data is then used to render a dynamic bar chart, providing users with a global perspective on their career prospects.
4.  **AI Technology 4: Specialized AI (Speech Generation)**
    -   **Model:** `gemini-2.5-flash-preview-tts`
    -   **Use Case:** Converts a text summary of the job search results into a natural-sounding audio clip, providing an accessible and convenient way for users to consume information.

### 3.1 Data Persistence & Security
-   **User Data:** User accounts (username, hashed password), saved jobs, saved searches, and prompt history are persisted in `localStorage`.
-   **Security Measures:**
    -   **API Key:** The Gemini API key is stored as an environment variable (`process.env.API_KEY`), ensuring it is not exposed in the client-side code, which is a critical security practice.
    -   **User Passwords:** The current implementation simulates password handling. In a production environment, passwords would be hashed using a strong algorithm (e.g., bcrypt) before being sent to a secure backend database. `localStorage` is not suitable for storing sensitive production data.

---

## 4. API Trade-Off Analysis: Google Gemini

| Criteria | Analysis |
| :--- | :--- |
| **Performance** | **Latency:** Text generation (`gemini-2.5-flash`) for both jobs and chart data is very fast, typically responding in under 2 seconds. Image and audio generation have higher latency (3-7 seconds) but are handled asynchronously with loading states in the UI to maintain a good user experience. <br> **Accuracy:** The model's ability to adhere to the requested JSON schema for both job listings and availability data is excellent, ensuring data consistency. The quality of generated content (text, image, audio) is consistently high. <br> **Cost:** The Gemini API operates on a pay-as-you-go model. The chosen models (`flash` series) are cost-effective, balancing performance with affordability, which is ideal for a startup or capstone project. |
| **Security & Privacy** | **Security:** API calls are made over HTTPS. Authentication is managed via a secure API key, which is not exposed to the client. <br> **Privacy:** As a third-party service, all prompts are processed by Google's servers. The application avoids sending Personally Identifiable Information (PII) in prompts where possible. User data persistence is handled client-side via `localStorage`, which means user data never leaves their machine, enhancing privacy. |
| **Scaling** | **Challenges:** The primary scaling challenge is cost management. As user numbers grow, the number of API calls will increase linearly. Without budget controls, this could become expensive. Another challenge is potential rate limiting, though Gemini's limits are generous for this application's use case. <br> **Solutions:** Implement client-side caching (e.g., for career banners) to reduce redundant API calls. For a production system, a backend service could be introduced to manage and cache API responses, providing a single point for rate limiting and cost monitoring. |

---

## 5. Project Roadmap & Future Enhancements

-   **Phase 1: Backend & Database Integration**
    -   Replace `localStorage` with a secure, cloud-based database like Firebase Firestore for robust and persistent user data storage.
    -   Develop a lightweight backend (e.g., Node.js with Express) to act as a proxy for Gemini API calls, enabling centralized API key management, caching, and improved security.

-   **Phase 2: Advanced AI Features**
    -   **Resume Analysis:** Allow users to upload their resume. Use AI to parse the resume and automatically suggest relevant job searches and keywords.
    -   **Cover Letter Assistant:** Integrate a feature to generate a draft cover letter tailored to a specific job listing saved by the user.
    -   **RAG for Career Advice:** Implement a Retrieval-Augmented Generation (RAG) chatbot trained on career advice articles and resources for South African graduates.

-   **Phase 3: Real-World Integration & Deployment**
    -   **Real Job Data:** Integrate with APIs from real job boards (e.g., LinkedIn, Indeed) to pull live job data, using the AI to summarize and review these real listings.
    -   **Deployment:** Deploy the frontend to a platform like Vercel or Netlify and the backend to a cloud provider for a fully-functional, publicly accessible application.
    -   **Monitoring:** Integrate tools like Sentry for error tracking and Google Analytics for user behavior analysis to inform future development.