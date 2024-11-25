# Privacy Policy Analyzer & GDPR Compliance Checker

A modern web application built with Next.js that helps analyze privacy policies and verify GDPR compliance. This project serves as the frontend interface for the [Privacy Policy Analyzer Backend](https://github.com/JeffinWithYa/policy-analyzer).

## Features

- **Privacy Policy Annotation**: Automatically analyzes and annotates privacy policy text to identify key sections and their purposes
- **GDPR Compliance Check**: Verifies compliance against 11 mandatory GDPR requirements
- **Visual Analysis**: Color-coded categorization of policy segments for easy understanding
- **Compliance Progress Tracking**: Visual progress indicator for GDPR requirement completion
- **Interactive UI**: Modern, responsive interface built with Tailwind CSS and shadcn/ui

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Running instance of the [backend service](https://github.com/JeffinWithYa/policy-analyzer)

### Installation

1. Clone the repository:

```bash
cd gdpr-compliance-checker
npm install 
npm run dev
# or
cd gdpr-compliance-checker
yarn install
yarn dev
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
