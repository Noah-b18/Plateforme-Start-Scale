import { Logo } from './ui/logo';
import { Nav } from './header/nav';
import { NavMentor } from './header/nav-mentor';
import { Profil } from './header/profil';
import { Menu } from './header/menu';
import { Button } from './ui/button';
import Link from "next/link";

type HeaderProps = {
  user?: 'membre' | 'mentor';
}

export default function Header({ user }: HeaderProps) {

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Logo />

        {user === 'membre' && (
          <Nav/>
        )}

        {user === 'mentor' && (
          <NavMentor/>
        )}

        {(user == 'membre' || user=="mentor") && (
          <div className="flex gap-4">
            <Button asChild={true}><Link href="/assistant">Assistant</Link></Button>
            <Profil/>
            <Menu/>

          </div>

        )}
      </div>
    </header>
  );
}