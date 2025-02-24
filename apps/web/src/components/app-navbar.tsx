import { ThemeModeToggle } from "@/web/components/shadcn-ui/theme-mode-toggle";
import type { User } from "@auth/core/types";
import { signOut, useSession } from "@hono/auth-js/react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, LogOut } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { motion } from "framer-motion";
import { Button } from "@/web/components/shadcn-ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/web/components/shadcn-ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/web/components/shadcn-ui/dropdown-menu";
import { LanguageSwitcher } from "@/web/components/language-switcher";
import { cn } from "@/web/lib/utils";

const getInitials = (name: string | null | undefined) => {
  if (!name) {
    return '?';
  }
  return name.charAt(0).toUpperCase();
};

function UserProfile({ user }: { user: User }) {
  const { t } = useTranslation();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-1 cursor-pointer"
        >
          <Avatar className="size-9 cursor-pointer ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
            <AvatarImage src={user.image ?? ''} alt={user.name ?? 'User avatar'} />
            <AvatarFallback className="bg-gradient-to-r from-primary to-fuchsia-500 text-white">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <ChevronDown className="size-4" />
        </motion.div>
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
        <DropdownMenuItem
          className="text-red-600 dark:text-red-400 focus:text-red-700 dark:focus:text-red-300 cursor-pointer"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2" />
          <span>{t('auth.signOut')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AuthButtons() {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center gap-2">
      <Link to="/sign-in">
        <Button 
          variant="ghost"
          className="text-muted-foreground hover:text-foreground text-sm md:text-base px-2 md:px-4 h-8 md:h-10"
        >
          {t('auth.signIn.title')}
        </Button>
      </Link>
      <Link to="/sign-up">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button className={cn(
            "bg-gradient-to-r from-violet-500 via-fuchsia-500 to-purple-500",
            "hover:from-violet-600 hover:via-fuchsia-600 hover:to-purple-600",
            "dark:from-violet-400 dark:via-fuchsia-400 dark:to-purple-400",
            "dark:hover:from-violet-500 dark:hover:via-fuchsia-500 dark:hover:to-purple-600",
            "text-white shadow-lg hover:shadow-primary/25 transition-all duration-300",
            "text-sm md:text-base px-3 md:px-4 h-8 md:h-10"
          )}>
            {t('auth.signUp.title')}
          </Button>
        </motion.div>
      </Link>
    </div>
  );
}

export default function AppNavbar() {
  const session = useSession();

  return (
    <nav className="sticky top-0 z-50 w-full shadow-sm border-b border-violet-100/20 dark:border-violet-800/10 bg-white/60 dark:bg-gray-950/60 backdrop-blur-xl">
      <div className="container max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0">
            <Link to="/">
              <strong 
                className="text-2xl md:text-3xl font-normal font-['Righteous'] bg-gradient-to-r from-primary via-fuchsia-500 to-purple-500 dark:from-violet-400 dark:via-fuchsia-400 dark:to-purple-400 bg-clip-text text-transparent cursor-pointer"
              >
                AICV
              </strong>
            </Link>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <ThemeModeToggle />
            <LanguageSwitcher />
            {session.data?.user ? (
              <UserProfile user={session.data.user} />
            ) : (
              <AuthButtons />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}