# Documentation: Candidate Alignment Analysis Tool

**Version: 1.0**
**Date: June 20, 2025**

---

## 1. Introduction

The Candidate Alignment Analysis tool is a sophisticated web application designed to evaluate a job candidate's ethical and professional alignment with an institution's core values and policies. It leverages a powerful multi-agent AI system (built with CrewAI) to perform a deep analysis of a candidate's submitted documents against a predefined knowledge base.

The application provides a comprehensive, human-readable report that includes a final alignment score, a detailed breakdown of identified conflicts, and an analysis of the candidate's performance in hypothetical case scenarios. All generated reports are archived in a database for future reference and can be downloaded as formatted PDFs.

---

## 2. Architecture Overview

The application is built with a modern, decoupled architecture, which separates the user interface from the core logic.

* **Frontend (Client-Side):** A dynamic user interface built with **React**, **TypeScript**, and styled using **Tailwind CSS**. It is responsible for all user interactions, data input, and rendering of the final report. It communicates with the backend via API calls.
* **Backend (Server-Side):** A robust API server built with **Python** and the **FastAPI** framework. This is the application's engine, handling all business logic, document processing, AI agent execution, and database interactions.
* **Database:** A NoSQL **MongoDB** database hosted on the Atlas cloud platform. It serves as the persistent storage layer, archiving all generated candidate reports.

![Architecture Diagram](https://sdmntpraustraliaeast.oaiusercontent.com/files/00000000-54e8-61fa-b08a-41236b5e2e29/raw?se=2025-06-20T11%3A32%3A32Z&sp=r&sv=2024-08-04&sr=b&scid=2ca2ed3a-175e-58d4-ae95-162a6731cd0b&skoid=f71d6506-3cac-498e-b62a-67f9228033a9&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-20T10%3A24%3A37Z&ske=2025-06-21T10%3A24%3A37Z&sks=b&skv=2024-08-04&sig=ylPuLF9QYNqufcaC2V/SoOw2ffClWxeH5c2X2s8gv1E%3D) 

---

## 3. Backend Documentation (`main.py`)

The backend exposes a RESTful API that the frontend consumes.

### Key Libraries
* **FastAPI:** For building the high-performance API.
* **CrewAI & LangChain:** For creating and managing the multi-agent AI system.
* **Motor:** The asynchronous Python driver for communicating with MongoDB.
* **Pydantic:** For data validation and defining the shape of API requests and responses.
* **PyPDF2 & python-docx:** For parsing text from uploaded PDF and Word documents.

### API Endpoints

| Method | Endpoint                    | Description                                                                  |
| :----- | :-------------------------- | :--------------------------------------------------------------------------- |
| `POST` | `/configure`                | Securely receives and sets the user's Google AI Studio API key.              |
| `POST` | `/upload`                   | Receives documents, extracts text, and builds the knowledge base vector store. |
| `POST` | `/analyze`                  | The main endpoint. Kicks off the full multi-agent analysis workflow.         |
| `GET`  | `/history`                  | Retrieves a summary list of all previously generated reports from the database. |
| `GET`  | `/report/{report_id}`       | Fetches the full data for a single, specific report by its unique ID.        |

### The AI Agentic Workflow (`/analyze` endpoint)

This is the core of the application's intelligence. When the `/analyze` endpoint is called, it initializes and runs a "crew" of AI agents that work together in a sequence.

1.  **Profiler Agent:**
    * **Goal:** To create structured JSON profiles.
    * **Action:** It first queries the knowledge base to understand the institution's values. Then, it analyzes the candidate's submitted documents. It outputs two distinct JSON profiles: one for the institution and one for the candidate.

2.  **Conflict Detector Agent:**
    * **Goal:** To find misalignments.
    * **Action:** It takes the two JSON profiles from the Profiler Agent and meticulously compares them, identifying any areas of conflict or value clashes. It outputs a list of these conflicts, categorized by severity ("Critical" or "Minor").

3.  **Scenario Evaluator Agent:**
    * **Goal:** To test the candidate's ethical reasoning.
    * **Action:** It looks at the most critical conflict identified by the detector and generates three unique, hypothetical case scenarios designed to test the candidate on that specific point of friction.

4.  **Report Generator Agent:**
    * **Goal:** To synthesize all findings into a final report.
    * **Action:** This agent gathers all the previous outputs. It uses the `llm-math` tool to calculate a final score based on the number and severity of conflicts. Finally, it assembles all this information into a comprehensive, well-formatted markdown report and returns the entire result as a single JSON object containing both the score and the markdown text.

---

## 4. Frontend Documentation

The frontend is built as a Single Page Application (SPA) using React and Vite, with routing handled by `react-router-dom`.

### Key Libraries
* **React:** For building the user interface components.
* **Axios:** For making reliable HTTP requests to the backend API.
* **React Router:** For handling navigation between different pages (`/config`, `/candidate`, `/result`).
* **React-Markdown:** For converting the markdown report from the API into beautifully formatted HTML.
* **jsPDF & html2canvas:** For generating client-side PDFs from the displayed report.
* **Lucide-React:** For icons.

### Component Breakdown

* **`AppContext.tsx`:** The heart of the frontend. It's a global state manager that holds all application state (e.g., `isLoading`, `finalReport`, `error`) and all functions that interact with the backend API (`handleConfigureKey`, `handleRunAnalysis`, etc.). This avoids passing props down through many layers of components.

* **`ConfigForm.tsx`:** The initial setup page where the user provides their API key and uploads the knowledge base documents. Its buttons call the corresponding handler functions in `AppContext`.

* **`CandidatePage.tsx`:** The main page for submitting a new candidate for analysis. It also displays the "Analysis History" panel by fetching data from the `/history` backend endpoint.

* **`ResultPage.tsx`:** This page is responsible for displaying the final, formatted report received from the backend.
    * It uses the `ReportDisplay.tsx` sub-component to handle the actual markdown-to-HTML rendering.
    * The "Download PDF" button on this page uses `html2canvas` to take a "screenshot" of the rendered report `div`, and then uses `jsPDF` to place that image into a PDF file, which is then served to the user for download.

---

## 5. Setup and Installation Guide

Follow these steps to set up and run the project on your local machine.

### Prerequisites
* Python 3.10+
* Node.js 18.x+ and npm
* A MongoDB Atlas account and a connection string.
* A Google AI Studio API key.

### Backend Setup

1.  **Clone the repository** and navigate into the backend directory.
2.  **Create a virtual environment:**
    ```bash
    python -m venv .venv
    ```
3.  **Activate the virtual environment:**
    * Windows: `.venv\Scripts\activate`
    * macOS/Linux: `source .venv/bin/activate`
4.  **Install Python dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
5.  **Create a `.env` file** in the backend directory. Copy the contents of `.env.example` and fill in your actual MongoDB connection string and Google API key.
6.  **Run the backend server:**
    ```bash
    uvicorn main:app --reload
    ```
    The server will be running at `http://127.0.0.1:8000`.

### Frontend Setup

1.  **Navigate into the frontend directory** in a new terminal.
2.  **Install Node.js dependencies:**
    ```bash
    npm install
    ```
3.  **Run the frontend development server:**
    ```bash
    npm run dev
    ```
    The application will be accessible at `http://localhost:5173` (or another port if 5173 is in use).

4.  **Open the application** in your browser and follow the on-screen steps to configure your API key and upload your knowledge base.
