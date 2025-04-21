'use client';

import { useTheme } from 'next-themes';

import { useEffect, useState } from 'react';

export default function ThemeCom({ children }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className={theme}>
      <div className='bg-white text-gray-700 dark:text-gray-200 dark:bg-gray-900 min-h-screen'>
        {children}
      </div>
    </div>
  );
}