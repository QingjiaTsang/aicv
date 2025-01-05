import { signOut, useSession } from "@hono/auth-js/react";
import { Link } from "@tanstack/react-router";

export default function AppNavbar() {
  const session = useSession();

  return (
    <nav className="container">
      <ul>
        <li><strong>Tasks App</strong></li>
      </ul>
      <ul>
        <li>
          <Link to="/" activeProps={{ style: { fontWeight: "bold" } }}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/dashboard" activeProps={{ style: { fontWeight: "bold" } }}>Dashboard</Link>
        </li>
        {session.data?.user
          && (
            <>
              <li className="flex items-center gap-2">
                <img
                  src={session.data.user.image!}
                  className="w-[50px] h-[50px] rounded-full"
                />
                <p className="inline-block mb-0">{session.data.user.name}</p>
              </li>
              <li>
                <button
                  type="button"
                  className="outline contrast"
                  onClick={() => signOut()}
                >
                  Sign Out
                </button>
              </li>
            </>
          )}
      </ul>
    </nav>
  );
}
