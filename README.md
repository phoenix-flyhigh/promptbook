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

From the OAuth client created in console.cloud.google.com
1. GOOGLE_CLIENT_ID
2. GOOGLE_CLIENT_SECRET

From the database created in free cluster in mongo db atlas
3. MONGODB_URI

The url where the local app is running
4. NEXTAUTH_URL=http://localhost:3000/

The redirection url after successful authentication
5. NEXTAUTH_URL_INTERNAL=http://localhost:3000

A 64 bit secret generated for next auth. Command to create it -> openssl rand -base64 32 
6. NEXTAUTH_SECRET

