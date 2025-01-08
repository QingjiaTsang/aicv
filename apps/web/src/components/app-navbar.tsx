import { signOut, useSession } from "@hono/auth-js/react";
import { Link } from "@tanstack/react-router";

export default function AppNavbar() {
  const session = useSession();

  return (
    <nav className="w-full border-b shadow-sm border-gray-200 bg-white">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <strong className="text-xl font-bold text-gray-800">Tasks App</strong>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 transition-colors"
              activeProps={{ className: "font-bold text-gray-900" }}
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              className="text-gray-600 hover:text-gray-900 transition-colors"
              activeProps={{ className: "font-bold text-gray-900" }}
            >
              Dashboard
            </Link>

            {/* User Profile Section */}
            {session.data?.user && (
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <img
                    src={session.data.user.image!}
                    alt="User avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="text-gray-700">{session.data.user.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
