'use client';

import Head from 'next/head';
import { useState } from 'react';
import SearchForm from './components/SearchForm';
import InfoSection from './components/InfoSection';
import TrainList from './components/TrainList';

export default function Home() {
  const [searchParams, setSearchParams] = useState(null);

  const handleSearch = (params) => {
    setSearchParams(params);
  };

  return (
    <div>
      <Head>
        <title>TrainBook - Your Reliable Train Booking Partner</title>
        <meta
          name="description"
          content="Book direct or connecting trains with ease and reliability. Find the best routes, assess risks, and travel confidently."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to TrainBook</h1>
          <p className="text-lg mb-8">
            Book direct or connecting trains with ease and reliability. Find the best routes, assess risks, and travel confidently.
          </p>
          <SearchForm onSearch={handleSearch} />
        </div>
      </section>

      {searchParams && <TrainList searchParams={searchParams} />}

      <InfoSection />
      
    </div>
  );
}
