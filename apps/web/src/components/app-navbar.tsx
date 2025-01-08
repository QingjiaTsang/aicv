import { ModeToggle } from "@/web/components/shadcn-ui/mode-toggle";
import type { User } from "@auth/core/types";
import { signOut, useSession } from "@hono/auth-js/react";
import { Link } from "@tanstack/react-router";

const getInitials = (name: string | null) => {
  if (!name) return '?';
  return name.charAt(0).toUpperCase();
};

export default function AppNavbar() {
  const session = useSession();

  return (
    <nav className="w-full border-b border-violet-100/20 dark:border-violet-800/10 bg-white/60 dark:bg-gray-950/60 backdrop-blur-xl shadow-sm">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0">
            <Link to="/">
              <strong className="text-3xl font-normal font-['Righteous'] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-purple-500 dark:from-violet-400 dark:via-fuchsia-400 dark:to-purple-400 bg-clip-text text-transparent hover:scale-110 transition-transform duration-200 cursor-pointer">
                AICV
              </strong>
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <NavLinks />
            {session.data?.user && <UserProfile user={session.data.user} />}
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}


function NavLinks() {
  return (
    <>
      <Link
        to="/"
        className="font-medium text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition-all hover:scale-105"
        activeProps={{
          className: "font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500 dark:from-violet-400 dark:to-fuchsia-400"
        }}
      >
        Home
      </Link>
      <Link
        to="/dashboard"
        className="font-semibold text-gray-700 dark:text-gray-200 hover:text-violet-600 dark:hover:text-violet-400 transition-all hover:scale-105"
        activeProps={{
          className: "font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-500"
        }}
      >
        Dashboard
      </Link>
    </>
  );
}

function UserProfile({ user }: { user: User }) {
  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-3">
        {user.image ? (
          <img
            src={user.image}
            alt={`${user.name}'s avatar`}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-500/20"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center ring-2 ring-violet-500/20">
            <span className="text-white font-semibold text-lg">
              {getInitials(user.name!)}
            </span>
          </div>
        )}
        <span className="font-medium text-gray-700 dark:text-gray-200">
          {user.name || 'Anonymous User'}
        </span>
      </div>
      <button
        type="button"
        onClick={() => signOut()}
        className="px-4 py-2 rounded-md bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-colors font-medium"
      >
        Sign Out
      </button>
    </div>
  );
} 