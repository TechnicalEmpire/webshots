
import { useState, useEffect } from "react";
import WebshotViewer from "@/components/WebshotViewer";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const { toast } = useToast();
  
  // Show welcome toast on initial load
  useEffect(() => {
    toast({
      title: "Welcome to B&H Competitor Web Experience Holiday 2024 Review",
      description: "Browse screenshots from your favorite retailers",
      duration: 5000,
    });
  }, [toast]);

  // Update document title
  useEffect(() => {
    document.title = "B&H Competitor Web Experience Holiday 2024 Review";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-secondary/30">
      <header className="border-b border-border bg-white/80 backdrop-blur-sm py-4 shadow-sm">
        <div className="container mx-auto px-4 flex items-center">
          <div className="w-40 mr-4">
            <img 
              src="/lovable-uploads/f53bb5d4-fc94-44ed-a4ae-5d2b3f3cccb8.png" 
              alt="B&H Photo Video Pro Audio" 
              className="w-full h-auto"
            />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gradient">
              Competitor Web Experience Holiday 2024 Review
            </h1>
            <p className="text-bh-slate mt-1">
              Browse screenshots of ecommerce retailers from Dec 18, 2024 - Jan 06, 2025
            </p>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        <Card className="border-border shadow-md overflow-hidden">
          <CardContent className="p-0">
            <WebshotViewer />
          </CardContent>
        </Card>
      </main>
      
      <footer className="border-t border-border py-4 mt-8 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center text-sm text-bh-slate">
          &copy; {new Date().getFullYear()} B&H Competitor Web Experience Holiday 2024 Review
        </div>
      </footer>
    </div>
  );
};

export default Index;
