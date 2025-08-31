import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AuthSkeletonPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-10 w-24" />
            </div>
          </div>

          {/* Tab Navigation Skeleton */}
          <div className="flex justify-center mt-4">
            <div className="flex items-center space-x-6">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="container mx-auto px-6 py-8">
        {/* Page Header Skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-5 w-80" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Search Bar Skeleton */}
        <div className="relative mb-8">
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Loading Message */}
        <div className="text-center py-12">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
              <div className="absolute inset-0 rounded-full border-2 border-primary/20"></div>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">
                Setting up your workspace...
              </h2>
              <p className="text-muted-foreground">
                Loading your projects and preferences
              </p>
            </div>
          </div>
        </div>

        {/* Projects Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mt-12 max-w-md mx-auto">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Loading projects...</span>
              <span>75%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full animate-pulse"
                style={{ width: "75%" }}
              ></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
