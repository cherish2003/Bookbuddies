"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  BookMarked,
  BookOpen,
  BookCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { clearPersistedAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

export function Sidebar({
  userType,
  activeTab,
  setActiveTab,
  sidebarOpen,
  toggleSidebar,
}: {
  userType: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}) {
  const router = useRouter();
  const handleLogout = () => {
    clearPersistedAuth();
    router.push("/auth");
  };
  return (
    <div
      className={`bg-white shadow-md transition-all duration-300 ${
        sidebarOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center justify-between mb-8">
          {sidebarOpen ? (
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BookBuddies
              </h1>
              <Badge
                variant="outline"
                className="border-blue-300 text-blue-600"
              >
                {userType === "owner" ? "Book Owner" : "Book Seeker"}
              </Badge>
            </div>
          ) : (
            <div></div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="rounded-full"
          >
            {sidebarOpen ? (
              <ChevronLeft size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </Button>
        </div>

        <div className="flex-1 space-y-2">
          <Button
            variant={activeTab === "dashboard" ? "secondary" : "ghost"}
            className={`w-full justify-start ${
              !sidebarOpen && "justify-center"
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            <Home className="mr-2 h-4 w-4" />
            {sidebarOpen && "Dashboard"}
          </Button>
          {userType === "owner" && (
            <Button
              variant={activeTab === "my-books" ? "secondary" : "ghost"}
              className={`w-full justify-start ${
                !sidebarOpen && "justify-center"
              }`}
              onClick={() => setActiveTab("my-books")}
            >
              <BookMarked className="mr-2 h-4 w-4" />
              {sidebarOpen && "My Books"}
            </Button>
          )}

          <Button
            variant={activeTab === "browse" ? "secondary" : "ghost"}
            className={`w-full justify-start ${
              !sidebarOpen && "justify-center"
            }`}
            onClick={() => setActiveTab("browse")}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            {sidebarOpen && "Browse Books"}
          </Button>

          {userType === "owner" && (
            <Button
              variant={activeTab === "requests" ? "secondary" : "ghost"}
              className={`w-full justify-start ${
                !sidebarOpen && "justify-center"
              }`}
              onClick={() => setActiveTab("requests")}
            >
              <BookCheck className="mr-2 h-4 w-4" />
              {sidebarOpen && "Requests"}
            </Button>
          )}
        </div>

        <div className="space-y-2">
          <Button
            variant="ghost"
            className={`w-full justify-start text-red-500 hover:text-red-600 ${
              !sidebarOpen && "justify-center"
            }`}
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {sidebarOpen && "Logout"}
          </Button>
        </div>
      </div>
    </div>
  );
}
