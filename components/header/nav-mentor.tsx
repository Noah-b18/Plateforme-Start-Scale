import React from 'react';
import Link from 'next/link';

export function NavMentor() {
  return (
    <nav className="flex space-x-4">
      <Link href="/mentor/dashboard" className="text-gray-700 hover:text-gray-900">
        Dashboard
      </Link>
    </nav>
  );
}