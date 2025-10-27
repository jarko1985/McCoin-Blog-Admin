"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const email = session?.user?.email || "user";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-brand-mercury/15 bg-brand-blue/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-brand-mercury">
          <span className="text-brand-red font-semibold">McCoin</span>
          <span className="opacity-80">Admin</span>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="default"
              className="h-9 gap-2 rounded-full shadow-2xl cursor-pointer bg-brand-mercury  px-2 text-brand-red hover:text-brand-mercury hover:bg-brand-red transition"
            >
              <Avatar className="h-7 w-7">
                <AvatarImage src="/avatar.png" />
                <AvatarFallback className="text-brand-blue">MC</AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline-block text-sm opacity-80">{session ? email : "Guest"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-brand-blue/95 text-brand-mercury border-brand-mercury/20">
            {!session ? (
              <>
                <DropdownMenuLabel>Welcome user</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="hover:bg-white/5" onClick={() => router.push("/sign-in")}>Login</DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuLabel>Welcome {email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="hover:bg-white/5 cursor-pointer" onClick={() => router.push("/dashboard")}>Profile</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/sign-in" })}
                  className="text-brand-red cursor-pointer"
                >
                  Logout
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}


