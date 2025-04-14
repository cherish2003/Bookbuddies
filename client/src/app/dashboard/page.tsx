"use client";
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { OwnerDashboard } from "@/components/OwnerDashboard"; // New component
import { SeekerDashboard } from "@/components/SeekerDashboard"; // New component
import { BookOwnerView } from "@/components/BookOwnerView";
import { BookSeekerView } from "@/components/BookSeekerView";
import { RequestsView } from "@/components/RequestsView";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { fetchOwnerBooks, fetchBooks } from "@/store/slices/bookSlice";
import { loadUserFromStorage } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userType, setUserType] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    const storedAuth = localStorage.getItem("bookBuddiesAuth");
    const parsed = storedAuth ? JSON.parse(storedAuth) : null;

    if (parsed?.role) {
      setUserType(parsed.role);
    }
  }, []);

  useEffect(() => {
    if (userType === "owner") setActiveTab("dashboard");
    else if (userType === "seeker") setActiveTab("dashboard");
  }, [userType]);

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  const { user } = useSelector((state: RootState) => state.auth);
  const { ownerBooks, books } = useSelector((state: RootState) => state.books);

  useEffect(() => {
    if (user?._id) {
      if (userType === "owner") {
        dispatch(fetchOwnerBooks(user._id));
      } else {
        dispatch(fetchBooks({}));
      }
    }
  }, [dispatch, user?._id, userType]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  if (!user || !userType) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Session Expired</h2>
          <p className="mb-4">Please login again to continue</p>
          <Button asChild>
            <Link href="/login">Go to Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        userType={userType}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === "dashboard" && userType === "owner" && (
            <OwnerDashboard books={ownerBooks} />
          )}
          {activeTab === "dashboard" && userType === "seeker" && (
            <SeekerDashboard books={books} />
          )}
          {activeTab === "my-books" && userType === "owner" && (
            <BookOwnerView />
          )}
          {activeTab === "browse" && <BookSeekerView />}
          {activeTab === "requests" && <RequestsView />}
        </main>
      </div>
    </div>
  );
}
