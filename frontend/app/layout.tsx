import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OpenRouter Frontend',
  description: 'AI API Router Frontend Application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-gray-50">
        <header className="bg-white shadow">
          <nav className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-gray-900">OpenRouter</h1>
          </nav>
        </header>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="container mx-auto px-4 py-6 text-center text-gray-600">
            <p>&copy; 2026 OpenRouter. جميع الحقوق محفوظة.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
