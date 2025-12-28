🧠 AI Chatbox (Next.js)

A modern AI chat application built with Next.js App Router that demonstrates real-world frontend and backend integration, state persistence, and practical debugging skills.

This project was built and stabilized through hands-on debugging, making it a strong example of production-style problem solving, not just a demo.

🚀 Project Overview

This AI Chatbox allows users to send messages, receive responses from an API endpoint, toggle between light and dark mode, and retain chat history across page refreshes.

It showcases modern React patterns, Next.js App Router architecture, and clean Git/GitHub workflows.

✨ Features

 Interactive chat interface

 Light / Dark mode toggle (persists after refresh)

 Chat history persistence using localStorage

 Auto-scroll to newest messages

 Next.js API route (/api/chat)

️ Safe JSON parsing with error protection

 Clean repository structure with .gitignore

 Tech Stack

Next.js 16 (App Router)

React

TypeScript

Tailwind CSS

Node.js

Git & GitHub

 Project Structure
ai-chatbox/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts
│   ├── page.tsx
│   └── layout.tsx
├── public/
├── .gitignore
├── package.json
└── README.md

 Key Engineering Highlights
Persistent State

Chat messages and theme preferences are stored in localStorage

Ensures session continuity without requiring a database

Defensive API Handling

The frontend validates response headers before parsing JSON

Prevents crashes caused by HTML error pages (e.g. 404s or server errors)

Modern Next.js Patterns

Uses App Router API routes instead of legacy /pages/api

Clean separation between UI and backend logic
 Example API Response
{
  "reply": " API is working. You said: Hello!"
}

 What This Project Demonstrates

Debugging and recovering broken React/Next.js code

Understanding of Next.js App Router architecture

Proper state management with React hooks

Frontend–backend integration

Clean Git workflows and repository hygiene

Attention to user experience and persistence

This project reflects real development scenarios, including error diagnosis, refactoring, and recovery.
️ Getting Started
git clone https://github.com/OmoBarbie/ai-chatbox.git
cd ai-chatbox
npm install
npm run dev


Open your browser at
 http://localhost:3000

 Planned Enhancements

OpenAI API integration

Streaming responses / typing indicator

Long-term memory or chat summarization

Deployment to Vercel

Automated testing

 Developer

Built by OmoBarbie, pursuing roles in:

AI / Software Engineering (Entry-Level)

Technical Customer Success

Implementation & AI Solutions Engineering

Focused on practical problem-solving, modern JavaScript frameworks, and AI-enabled applications.

 Contact

GitHub: https://github.com/OmoBarbieThis is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
