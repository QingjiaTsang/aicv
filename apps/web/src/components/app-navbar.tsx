import { ModeToggle } from "@/web/components/shadcn-ui/mode-toggle";
import type { User } from "@auth/core/types";
import { signOut, useSession } from "@hono/auth-js/react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, LogOut, Settings, User as UserIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/web/components/shadcn-ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/web/components/shadcn-ui/dropdown-menu";

const getInitials = (name: string | null | undefined) => {
  if (!name) {
    return '?';
  }
  return name.charAt(0).toUpperCase();
};

function UserProfile({ user }: { user: User }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-1 cursor-pointer">
          <Avatar className="size-9 cursor-pointer ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
            <AvatarImage src={user.image ?? ''} alt={user.name ?? 'User avatar'} />
            <AvatarFallback className="bg-gradient-to-r from-primary to-fuchsia-500 text-white">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <ChevronDown className="size-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer">
            <UserIcon className="mr-2" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 dark:text-red-400 focus:text-red-700 dark:focus:text-red-300 cursor-pointer"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function AppNavbar() {
  const session = useSession();

  return (
    <nav className="sticky top-0 z-50 w-full shadow-sm border-b border-violet-100/20 dark:border-violet-800/10 bg-white/60 dark:bg-gray-950/60 backdrop-blur-xl">
      <div className="container max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0">
            <Link to="/dashboard">
              <strong className="text-2xl md:text-3xl font-normal font-['Righteous'] bg-gradient-to-r from-primary via-fuchsia-500 to-purple-500 dark:from-violet-400 dark:via-fuchsia-400 dark:to-purple-400 bg-clip-text text-transparent hover:scale-110 transition-transform duration-200 cursor-pointer">
                AICV
              </strong>
            </Link>
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            <ModeToggle />
            {session.data?.user && <UserProfile user={session.data.user} />}
          </div>
        </div>
      </div>
    </nav>
  );
} 