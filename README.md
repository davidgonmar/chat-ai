# ChatAI

ChatAI is a simple app that aims to replicate the functionality of the ChatGPT web app. It utilizes the experimental Next.js app directory and the OpenAI API to provide AI capabilities for generating responses.

## Features

- **Response streaming** - Responses are shown as they are generated
- **Chat storage** - The user is able to log in to save their chats
- **Guest mode** - The user is able to chat without logging in, but their chats will not be saved

## Tech stack

- **Next.js** with app directory and TypeScript
- **Prisma ORM** for efficient and seamless database management
- **TailwindCSS** for styling
- **React Query** and **Zustand** for state management
- **NextAuth** for authentication
- **OpenAI API** for AI capabilities

## Getting started

1. Clone the repository
2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the root directory and add the following variables:

```bash
# Open AI API key. More info on https://platform.openai.com/docs/introduction
OPENAI_API_KEY=

# Obtain information in Google Cloud Platform. More info on https://console.cloud.google.com/
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# DB connection string. More info on https://www.prisma.io/docs. The project currently uses MySQL/MariaDB. It is easily configurable to use other databases.
DATABASE_URL=

# NextAuth configuration. More info on https://next-auth.js.org/configuration/options
NEXTAUTH_URL=
NEXTAUTH_SECRET=
```

4. Generate the Prisma client

```bash
npx prisma generate
```

5. Push the database schema to the database

```bash
npx prisma db push
```

5. Run the project

```bash
npm run dev
```
