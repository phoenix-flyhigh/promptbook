This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

To run tests with coverage, run the following command 
```bash
npm run test:coverage
```

To run mutation tests, run the following command 
```bash
npm run test:mutation
```

## Local environment Setup
To set it up in the local, add a dotenv file with the following keys:
<!-- From the OAuth client created in console.cloud.google.com -->
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
<!-- \From the database created in free cluster in mongo db atlas -->
MONGODB_URI

NEXTAUTH_URL=http://localhost:3000/
NEXTAUTH_URL_INTERNAL=http://localhost:3000

<!-- From a 64 bit secret generated for next auth -->
<!-- command to create it -> openssl rand -base64 32 -->
NEXTAUTH_SECRET

