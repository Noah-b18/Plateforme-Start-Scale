'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface User {
  name: string;
  level: number;
}

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const currentUserRaw = sessionStorage.getItem('currentUser');
      if (currentUserRaw) {
        try {
          const currentUser = JSON.parse(currentUserRaw);
          setUser({
            name: currentUser.name,
            level: currentUser.level,
          });
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('userRole');
    setUser(null);
    router.push('/');
  }, [router]);

  if (user) {
    return (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-48 flex items-center gap-3 px-2 py-1 h-auto hover:bg-muted rounded-b-none focus-visible:ring-white">
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-foreground">{user.name}</span>
              <span className="text-xs text-muted-foreground">Niveau {user.level}</span>
            </div>
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm hover:bg-primary/90">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={0} align="end" className="w-48 rounded-t-none bg-black text-white border-none shadow-[inset_0_3px_3px_0_rgba(255,255,255,1)]">
          <DropdownMenuItem onClick={() => router.push('/dashboard')} className="hover:bg-gray-500/50">
            Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/profile')} className="hover:bg-gray-500/50">
            Profil
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/settings')} className="hover:bg-gray-500/50">
            Paramètres
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/modules')} className="hover:bg-gray-500/50">
            Modules
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/calls')} className="hover:bg-gray-500/50">
            Calls
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/packs')} className="hover:bg-gray-500/50">
            Packs
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/')} className="hover:bg-gray-500/50">
            Accueil
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout} className="text-destructive hover:bg-red-500/50">
            Déconnexion
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button asChild className="font-semibold">
      <a href="/login">Se connecter</a>
    </Button>
  );
}