import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "FactoryFlow",
  description: "Factory Management Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-60 bg-white shadow-md border-r p-5">
          <h1 className="text-xl font-bold mb-6 text-blue-600">FactoryFlow</h1>
          <nav className="space-y-3">
            <Link href="/" className="block text-gray-700 hover:text-blue-600">
              🏠 Dashboard
            </Link>
            <Link href="/bills" className="block text-gray-700 hover:text-blue-600">
              💰 Bills
            </Link>
            <Link href="/inventory" className="block text-gray-700 hover:text-blue-600">
              📦 Inventory
            </Link>
            <Link href="/tickets" className="block text-gray-700 hover:text-blue-600">
              🎫 Tickets
            </Link>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">{children}</main>
      </body>
    </html>
  );
}
