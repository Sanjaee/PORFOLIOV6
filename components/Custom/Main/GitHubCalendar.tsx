'use client';
import React, { useState, useEffect } from 'react';
import GitHubCalendar from 'react-github-calendar';

const GitHubContributionGraph: React.FC = () => {
  const [fontSize, setFontSize] = useState<number | null>(12);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // Jika di desktop (width >= 768px), hapus fontSize
        setFontSize(null);
      } else {
        // Jika di mobile (width < 768px), set fontSize ke 12
        setFontSize(12);
      }
    };

    // Panggil handleResize sekali saat komponen mount
    handleResize();

    // Tambahkan event listener untuk menangani perubahan ukuran layar
    window.addEventListener('resize', handleResize);

    // Bersihkan event listener ketika komponen unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="flex justify-center items-center flex-col mx-5">
      <h1 className="text-3xl font-bold mb-5 mt-20">Github Contributions</h1>
      <GitHubCalendar username="Sanjaee" colorScheme="dark" fontSize={fontSize || undefined} />
    </div>
  );
};

export default GitHubContributionGraph;
