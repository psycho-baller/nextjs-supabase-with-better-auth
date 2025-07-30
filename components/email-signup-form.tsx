"use client"
import { Input } from "@/components/ui/input";
import { SetStateAction, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

const EmailSignupForm = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError('Please enter an email address');
      return;
    }

    try {
      setIsLoading(true);

      const { data, error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/protected`,
          shouldCreateUser: true,
        },
      });

      if (signInError) throw signInError;

      setIsSubmitted(true);
      toast.success("Check your email!");
      toast.info("We've sent a magic link to your email. Click it to sign in.");
    } catch (error: any) {
      console.error('Error signing in:', error);
      setError(error.message || 'Failed to send magic link. Please try again.');
      toast.error(error.message || 'Failed to send magic link');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Check your email!</h3>
        <p className="text-muted-foreground">
          We've sent a magic link to {email}. Click it to sign in.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e: { target: { value: SetStateAction<string>; }; }) => {
              setEmail(e.target.value);
              if (error) setError(null);
            }}
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="whitespace-nowrap"
          >
            {isLoading ? 'Sending...' : 'Get Started'}
          </Button>
        </div>
        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}
      </form>
    </div>
  );
};

export default EmailSignupForm;
