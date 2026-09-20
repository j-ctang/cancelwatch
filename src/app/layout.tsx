export const metadata = {
  title: "CancelWatch",
  description: "Never miss a membership cancellation deadline.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
