# OneBlock - Visual API Builder & Simulation Platform

## Project Overview

OneBlock is a comprehensive full-stack API builder and simulation platform that allows users to visually design, simulate, and manage API-based projects through an interactive web interface. The platform supports REST APIs, GraphQL APIs, and WebSocket services.

## What does this project do?

- **Visual API Builder:** Users can drag and drop components to design API flows, endpoints, and logic visually in the frontend
- **Simulation Engine:** The platform provides a simulation panel to step through and visualize how API requests would flow through the designed system
- **Project Management:** Save, load, and share projects with the community
- **Real-time Collaboration:** Multiple users can work on shared projects simultaneously
- **AI-Powered Assistance:** Integrated chatbot for debugging help and best practices
- **Authentication:** Uses Asgardeo authentication with Google sign-in for secure user access

## How does it work?

### Frontend (React + Vite)

- Provides a modern, interactive UI for building and simulating APIs
- Communicates with the backend via HTTP API calls
- Features a drag-and-drop flow builder with real-time collaboration
- Includes project simulation and visualization tools

### Backend (Ballerina)

- Exposes RESTful endpoints for project CRUD operations and simulation data
- Handles business logic and persists project data in PostgreSQL
- Manages user/project access, sharing, and commenting system
- Integrates with OpenAI GPT for AI-powered assistance

### Database (PostgreSQL)

- Stores all project data, user info, and API block layouts
- Uses JSONB for efficient storage of complex flow configurations
- Supports real-time data synchronization

## Key Features

- **Multi-API Support:** REST, GraphQL, and WebSocket services
- **Visual Flow Design:** Intuitive drag-and-drop interface
- **Real-time Simulation:** Test and visualize API flows before implementation
- **Community Sharing:** Public projects accessible to all users
- **Comment System:** Threaded discussions and collaboration
- **AI Integration:** Smart debugging assistance and optimization tips
- **Responsive Design:** Works seamlessly across desktop and mobile devices

## Project Structure

```
├── backend/          # Ballerina backend service (API, database, business logic)
├── frontend/         # React-based frontend (user interface)
└── README.md         # This file - project overview
```

## Technology Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **Backend:** Ballerina 2201.12.7, PostgreSQL
- **AI:** OpenAI GPT integration
- **Authentication:** Asgardeo with Google OAuth
- **Real-time:** WebSocket support for live collaboration

## Getting Started

Each part of the project has its own setup guide:

- **Backend Setup:** See [`backend/Readme.md`](./backend/Readme.md) for backend installation and configuration
- **Frontend Setup:** See [`frontend/README.md`](./frontend/README.md) for frontend installation and running

## Issues & Contact

If you encounter any issues or need support, please contact:

**virangaweerabandara@gmail.com**
