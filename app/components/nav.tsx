/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const Navigation: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const [isIntersecting, setIntersecting] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) =>
      setIntersecting(entry.isIntersecting)
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleAuth = () => {
    if (session) {
      signOut();
    } else {
      signIn("google");
    }
  };

  return (
    <header style={{ fontFamily: "Exo" }} ref={ref}>
      <div
        className={classNames(
          "fixed inset-x-0 top-0 z-50 backdrop-blur duration-200 border-b",
          isIntersecting
            ? "bg-zinc-900/50 border-transparent"
            : "bg-zinc-900/500 border-zinc-800"
        )}>
        <div className="container flex flex-row items-center py-4 mx-auto px-4">
          <Link
            href="/explore"
            className="duration-200 text-violet-500 hover:text-zinc-100 text-4xl md:text-5xl font-bold whitespace-nowra">
            {/* World Home Price Predictor */}
            WHPPor
          </Link>

          {/* Mobile menu button */}
          {/* <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-violet-500 hover:text-zinc-100"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button> */}

          {/* Desktop Navigation */}
          {/* <div className="hidden md:flex flex-row justify-between items-center w-full ml-8">
            <div className="flex justify-around gap-6 items-center">
              <Link
                href="/explore"
                className="duration-200 py-3 rounded-lg text-violet-500 hover:text-zinc-100 text-center text-xl md:text-2xl font-bold"
              >
                Explore
              </Link>
              <Link
                href="/map"
                className="duration-200 py-3 rounded-lg text-violet-500 hover:text-zinc-100 text-center font-bold text-xl md:text-2xl"
              >
                Map
              </Link>
            </div>
          </div> */}
        </div>

        {/* Mobile Navigation */}
        {/* {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                href="/explore"
                className="block px-3 py-2 rounded-md text-base font-medium text-violet-500 hover:text-zinc-100 hover:bg-violet-700"
              >
                Explore
              </Link>
              <Link
                href="/map"
                className="block px-3 py-2 rounded-md text-base font-medium text-violet-500 hover:text-zinc-100 hover:bg-violet-700"
              >
                Map
              </Link>
              <button
                onClick={handleAuth}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-violet-500 hover:text-zinc-100 hover:bg-violet-700"
              >
                {session ? 'Logout' : 'Login'}
              </button>
            </div>
            {session && (
              <div className="pt-4 pb-3 border-t border-zinc-700">
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <img className="h-10 w-10 rounded-full" src={session.user?.image || ''} alt="User avatar" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium leading-none text-zinc-100">{session.user?.name}</div>
                    <div className="text-sm font-medium leading-none text-zinc-400">{session.user?.email}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )} */}
      </div>
    </header>
  );
};
