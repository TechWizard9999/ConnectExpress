import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Providers from './providers';

export const metadata = {
  title: 'TrainBook - Your Reliable Train Booking Partner',
  description: 'Book direct or connecting trains with ease and reliability.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Providers>
          <Header />
          <main className="flex-grow mt-16">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
