## ChatAI

ChatAI is a simple clone of the ChatGPT webapp using the new NextJS app directory. It can allow guests to use it, as well as people to login and save their conversations.

# Tech stack

- Nextjs with app dir + TS for the frontend and API routes
- Prisma for the database management
- TailwindCSS for the styling
- Due to compatibility with streams and React Query, state management is done with a mix of Zustand and React Query
- Auth is done with NextAuth.js
- OpenAI API for the AI

# How to run

1. Clone the repo
2. Run `npm install` to install the dependencies
3. Setup the project environment variables following the `.env.example` file
4. Run the Prisma migrations and setup the database. See their docs for more info.
5. Run the project with `npm run dev`
