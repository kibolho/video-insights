import Scripts from "@/components/Scripts";
import Provider from "../components/provider";
import "./globals.css";

export const metadata = {
  title: "Video Insights",
  description: "Use inteligência artificial para extrair insights dos seus vídeos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Scripts/>
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
