# LumoAI

A ChatGPT-style AI chat assistant powered by **Google Gemini 2.5 Flash**. Ask anything, hold multi-turn conversations, and revisit past chats saved as persistent threads.

## Live Demo

[https://lumo-ai-xi.vercel.app](https://lumo-ai-xi.vercel.app)

![LumoAI chat interface](docs/lumoai-home.png)

## Tech Stack

**Frontend:**
- React.js (Vite)
- Modern, responsive chat UI

**Backend:**
- Node.js / Express (REST API)
- Google Gemini (`@google/genai`, model `gemini-2.5-flash`)
- MongoDB + Mongoose for persistent chat threads

## Features

- **Conversational AI** powered by Google Gemini 2.5 Flash
- **Persistent chat threads** — each conversation is stored with its message history and title
- **Multi-turn chat** with user/assistant message roles
- **Clean, ChatGPT-like interface** that is fully responsive
- REST API separating the chat/thread logic from the UI

## Project Structure

```
LumoAI/
├── backend/          # Backend API server
├── frontend/         # React frontend application
└── SECURITY.md       # Security policy
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/pandey-prince/LumoAI.git
cd LumoAI
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Set up environment variables:
   - In `backend/.env` add:
     - `GEMINI_API_KEY` — your Google Gemini API key (from Google AI Studio)
     - `MONGODB_URI` — your MongoDB connection string
     - `PORT` — backend port (optional)
   - In `frontend/.env` add the backend API URL if required by the client

5. Run the development servers:

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:5000`.

## Deployment

The application is deployed on Vercel. For your own deployment:

1. Fork this repository
2. Connect your repository to Vercel
3. Configure environment variables
4. Deploy

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.
