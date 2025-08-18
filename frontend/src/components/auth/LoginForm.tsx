import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import GoogleIcon from "@/components/icons/GoogleIcon";
import AppleIcon from "@/components/icons/AppleIcon";

export default function LoginForm() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="flex max-w-4xl rounded-2xl shadow-lg overflow-hidden">
        {/* Left side - form */}
        <Card className="w-[400px] border-0 rounded-l-2xl">
          <CardContent className="p-10 flex flex-col justify-center">
            <h2 className="text-2xl font-semibold mb-1 text-foreground">
              Welcome back!
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Enter your Credentials to access your account
            </p>

            <form className="flex flex-col space-y-4">
              <Input
                type="email"
                placeholder="Email address"
                className="focus:ring-2 focus:ring-primary"
              />
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Password"
                  className="focus:ring-2 focus:ring-primary"
                />
                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-xs text-primary hover:underline"
                  >
                    forgot password
                  </Link>
                </div>
              </div>

              <label className="flex items-center text-xs text-muted-foreground">
                <input type="checkbox" className="mr-2" />
                Remember for 30 days
              </label>

              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Login
              </Button>
            </form>

            <div className="my-4 text-center text-muted-foreground text-xs">
              or
            </div>

            <div className="flex flex-col space-y-2">
              <Button
                variant="outline"
                className="flex items-center justify-center space-x-2 hover:bg-accent"
              >
                <GoogleIcon className="h-4 w-4" />
                <span>Sign in with Google</span>
              </Button>

              <Button
                variant="outline"
                className="flex items-center justify-center space-x-2 hover:bg-accent"
              >
                <AppleIcon className="h-4 w-4" />
                <span>Sign in with Apple</span>
              </Button>
            </div>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="text-primary font-semibold hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Right side - image */}
        <div className="w-[400px]">
          <img
            src="/placeholder.svg"
            alt="Login illustration"
            className="h-full w-full object-cover rounded-r-2xl"
          />
        </div>
      </div>
    </div>
  );
}
