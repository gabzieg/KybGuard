# Installation Guide

Welcome to the Regulatório UI! Follow these steps to get your enterprise application running locally in under 2 minutes.

## Prerequisites
- **Node.js**: Version 18.17.0 or higher.
- **npm** or **yarn** or **pnpm**.

## Step 1: Unpack and Install
1. Unzip the `regulatorio-ui.zip` file into your desired directory.
2. Open your terminal and navigate to the folder:
   ```bash
   cd regulatorio-ui
   ```
3. Install the required dependencies:
   ```bash
   npm install
   ```

## Step 2: Run the Development Server
Start the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. You should see the Compliance Dashboard.

## Step 3: Production Build
When you are ready to deploy, run:
```bash
npm run build
npm run start
```

*Note: For deployment, we highly recommend using [Vercel](https://vercel.com) for zero-configuration deployments.*
