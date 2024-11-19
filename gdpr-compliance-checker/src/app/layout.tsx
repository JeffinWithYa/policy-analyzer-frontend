import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'GDPR Compliance Checker',
    description: 'Check if your privacy policy is GDPR compliant',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
} 