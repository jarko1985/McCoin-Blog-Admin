"use client";
import { useState, useTransition } from "react";
import { signIn as clientSignIn, signOut as clientSignOut, type SignInResponse } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, LogIn, LogOut } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AnimatedLogo from "@/components/custom/AnimatedLogo";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'success' | 'error'>('success');
  const [dialogMessage, setDialogMessage] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        const res = (await clientSignIn("credentials", {
          redirect: false,
          callbackUrl: "/dashboard",
          email,
          password,
        } as any)) as SignInResponse | undefined;
        if (res?.error) {
          setError(res.error as string);
          setDialogMode('error');
          setDialogMessage(res.error as string);
          setDialogOpen(true);
          return;
        }
        setDialogMode('success');
        setDialogMessage('Welcome back! You have signed in successfully.');
        setDialogOpen(true);
        setTimeout(() => { router.replace(res?.url || "/dashboard"); }, 600);
      } catch (err: any) {
        setError(err?.message || "Login failed");
        setDialogMode('error');
        setDialogMessage(err?.message || 'Login failed');
        setDialogOpen(true);
      }
    });
  };

  return (
    <>
    <main className="min-h-screen bg-brand-blue/95 py-16 px-4">
    <div className="flex flex-col md:flex-row justify-center items-center mb-8">
    <AnimatedLogo /> 
    <h1 className="text-brand-mercury text-2xl font-semibold ml-3 mt-2">Blog Publisher</h1>
    </div>
      <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.3}}
        className="max-w-md mx-auto">
        <Card className="bg-brand-blue/95 border border-brand-mercury/15 shadow-elev backdrop-blur">
          <CardContent className="p-6 space-y-4">
            <h1 className="text-2xl font-semibold text-brand-mercury">Sign in</h1>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <Label className="text-brand-mercury mb-2 block">Email</Label>
                <Input value={email} onChange={(e)=>setEmail(e.target.value)} type="email"
                  className="bg-transparent border-brand-mercury/30 text-brand-mercury" placeholder="admin@mccoin.com"/>
              </div>
              <div>
                <Label className="text-brand-mercury mb-2 block">Password</Label>
                <Input value={password} onChange={(e)=>setPassword(e.target.value)} type="password"
                  className="bg-transparent border-brand-mercury/30 text-brand-mercury" placeholder="••••••••"/>
              </div>
              {error && <p className="text-brand-red text-sm">{error}</p>}
              <Button type="submit" disabled={isPending}
                className="w-full bg-brand-mercury hover:bg-brand-mercury text-brand-red cursor-pointer transition-all duration-300 hover:scale-105">
                {isPending ? (<><Loader2 className="h-4 w-4 animate-spin"/> Signing in…</>) : (<><LogIn className="h-4 w-4"/> Sign In</>)}
              </Button>
            </form>
            <Button
              type="button"
              onClick={() => clientSignOut({ callbackUrl: "/sign-in" })}
              variant="outline"
              className="mt-2 transition-all duration-300 hover:scale-105 w-full border-brand-mercury/30 hover:bg-brand-red hover:text-brand-mercury text-brand-mercury bg-brand-red cursor-pointer"
            >
              <LogOut className="h-4 w-4"/> Sign Out
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </main>
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className={dialogMode === 'success' ? 'text-emerald-400 text-center' : 'text-brand-red text-center'}>
            {dialogMode === 'success' ? 'Sign-in Successful' : 'Sign-in Failed'}
          </DialogTitle>
          <DialogDescription className="text-center">{dialogMessage}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => setDialogOpen(false)} className="bg-brand-red hover:bg-brand-red/90 text-white">
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}