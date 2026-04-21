import "./globals.css";
import Sidebar from "./components/Sidebar";

export const metadata = {
  title: "FactoryFlow",
  description: "Factory Management Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
        <Sidebar />
        <main style={{ flex: 1, minWidth: 0, overflowY: "auto" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
