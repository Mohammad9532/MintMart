'use client';
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export default function SignOutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors font-bold w-full"
        >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            Sign Out
        </button>
    );
}
