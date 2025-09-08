import '../styles/globals.css';
import Provider from './provider';
import MainLayout from './main-layout';

export const metadata = {
  title: 'FinalMVP',
  description: 'YouTube Digest Application',
};

export default function RootLayout({
  children,
}: { 
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Provider>
          <MainLayout>{children}</MainLayout>
        </Provider>
      </body>
    </html>
  );
}
