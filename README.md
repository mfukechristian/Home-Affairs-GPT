# Home Affairs GPT

## Overview

Home Affairs GPT is a web application designed to simplify access to information regarding South African civic and immigration services. Users can ask specific questions related to these services through a user-friendly form, and the application leverages AI to provide clear and understandable answers based on web research.

## Key Features

- **Service Selection:** Users can choose between "Civis" and "Immigration" services via a dropdown menu.
- **Sub-service Selection:** Based on the selected main service, a second dropdown presents relevant sub-services.
- **Detailed Query:** A text area allows users to provide specific details about their inquiry.
- **AI-Powered Information Retrieval:** The application uses the Tavily search tool to gather relevant information from the web based on the user's query and the selected service/sub-service.
- **Natural Language Processing:** The Mistral AI language model processes the search results and rephrases the information into an easy-to-understand format, presented in Markdown.
- **Loading Indication:** A visual loading animation and message inform the user that their request is being processed.
- **Clear Result Display:** The processed information is displayed in a separate section using Markdown formatting for readability.
- **Back to Form Navigation:** A "Back to Form" button allows users to return to the form to ask another question, resetting the form state.

## Technologies Used

- **Next.js:** A React framework for building server-rendered and static web applications.
- **React:** A JavaScript library for building user interfaces.
- **TypeScript:** A superset of JavaScript that adds static typing.
- **CSS Modules:** For component-level styling.
- **`next/navigation`:** For client-side routing.
- **`next/image`:** For optimized image handling.
- **`react-markdown`:** A React component for rendering Markdown.
- **`@langchain/community`:** Specifically, the `TavilySearchResults` tool for web searching.
- **`@langchain/mistralai`:** Integration with the Mistral AI language model.
- **`dotenv`:** For managing environment variables (API keys).
- **`zod`:** For request body schema validation in the API route.

## Getting Started

1.  **Clone the repository** (if you have one):

    ```bash
    git clone <repository-url>
    cd home-affairs-gpt
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**

    - Create a `.env.local` file in the root of your project.
    - Add your API keys for Tavily and Mistral AI:
      ```
      TAVILY_API_KEY_1=YOUR_TAVILY_API_KEY
      MISTRAL_API_KEY_1=YOUR_MISTRAL_API_KEY
      ```
      **Important:** Ensure this file is not committed to your version control system.

4.  **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

    Open your browser and navigate to `http://localhost:3000` to view the application.

## API Endpoint (`/api/model/route.ts`)

The API endpoint at `/api/model` handles the backend logic for processing user queries:

1.  **Request Validation:** Uses `zod` to validate the incoming request body (`service`, `subService`, `query`).
2.  **Web Search:** Employs the `TavilySearchAPIRetriever` tool with a prompt tailored to the user's inquiry and the expertise of a South African civic and immigration expert.
3.  **AI Processing:** Utilizes the `ChatMistralAI` model to rephrase the content from the web search into a user-friendly Markdown format.
4.  **Response:** Returns the processed Markdown content as a JSON response.

## Environment Variables

Ensure you have correctly set up your `.env.local` file with the necessary API keys. These keys are used to authenticate with the Tavily and Mistral AI services.
