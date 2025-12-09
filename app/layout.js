// app/layout.jsx
import "./globals.css";

export const metadata = {
  title: "AW Admin",
  description: "Admin panel with Flask backend",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-100 text-slate-900">
        {children}
      </body>
    </html>
  );
}
