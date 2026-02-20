import Icon from '../../components/Icon';
import Link from 'next/link';

export function Profil() {
  return (
    <Link href="/profile">
        <div className="size-10 rounded-full bg-black flex items-center justify-center">
            <Icon name='user' className="size-6 text-white"/>
        </div>
    </Link>
  );
}
