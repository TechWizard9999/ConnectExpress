// app/layout.js
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';

export const metadata = {
  title: 'TrainBook - Your Reliable Train Booking Partner',
  description: 'Book direct or connecting trains with ease and reliability.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow mt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
