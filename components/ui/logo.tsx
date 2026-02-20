import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 hover:opacity-80 transition-opacity ${className}`}>
      <Image src="/assets/images/logo.png" alt="Start & Scale Logo" className="h-12" width={48} height={48} />
      <span className="font-semibold text-lg text-gray-900">Start & Scale</span>
    </Link>
  );
}