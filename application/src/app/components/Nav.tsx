import Link from "next/link";
import React from "react";

const Nav = () => {
  return (
    <nav className="flex justify-end gap-2">
      <Link className="btn btn-sm btn-link" href={"/conversations"}>
        Messages
      </Link>
      <Link className="btn btn-sm btn-link" href={"/profile"}>
        Profile
      </Link>
      <a className="btn btn-sm btn-ghost text-orange-600" href="/api/logout">
        Logout
      </a>
    </nav>
  );
};

export default Nav;
