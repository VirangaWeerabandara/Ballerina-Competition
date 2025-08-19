# Project Overview

This project is a full-stack API builder and simulation platform. It allows users to visually design, simulate, and manage API-based projects (such as REST, GraphQL, and WebSocket services) through an interactive web interface.

## What does this project do?

- **Visual API Builder:** Users can drag and drop components to design API flows, endpoints, and logic visually in the frontend.
- **Simulation:** The platform provides a simulation panel to step through and visualize how API requests would flow through the designed system.

- **Authentication:** Uses Asgardeo authentication with Google sign-in for secure user access and project sharing.

## How does it work?

1. **Frontend (React + Vite):**

   - Provides a modern, interactive UI for building and simulating APIs.
   - Communicates with the backend via HTTP API calls.
   - Allows users to save, load, and share projects with community.

2. **Backend (Ballerina):**

   - Exposes RESTful endpoints for project CRUD operations and simulation data.
   - Handles business logic and persists project data in PostgreSQL.
   - Manages user/project access and sharing.

3. **Database (PostgreSQL):**
   - Stores all project data, user info, and API block layouts.

## Structure

- `backend/` — Ballerina backend service (API, database, business logic)
- `frontend/` — React-based frontend (user interface)

## Setup Instructions

Each part of the project has its own setup guide:

- **Backend:** See [`backend/Readme.md`](./backend/Readme.md)
- **Frontend:** See [`frontend/README.md`](./frontend/README.md)

Please follow the instructions in each folder to get the backend and frontend running.

## Issues & Contact

If you encounter any issues or need support, please contact:

**virangaweerabandara@gmail.com**
