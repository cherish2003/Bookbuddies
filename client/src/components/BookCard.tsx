"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { requestBook } from "@/store/slices/requestSlice";
import { toast } from "sonner";

interface BookCardProps {
  book: {
    _id: string;
    title: string;
    author: string;
    owner: {
      _id: string;
      name: string;
      email?: string;
    };
    location: string;
    status?: string;
    genre?: string;
    contact?: string;
  };
}

export function BookCard({ book }: BookCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { loading } = useSelector((state: RootState) => state.books);
  console.log(loading);
  const handleRequest = () => {
    if (!user) {
      toast.error("Please log in to request a book.");
      return;
    }

    if (user._id === book.owner._id) {
      toast.error("You cannot request your own book.");
      return;
    }

    dispatch(requestBook({ bookId: book._id }))
      .unwrap()
      .then(() => {
        toast.success("Book request sent successfully!");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to request the book.");
      });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">{book.title}</CardTitle>
        <p className="text-sm text-gray-600">{book.author}</p>
        {book.genre && (
          <Badge variant="outline" className="w-fit mt-2">
            {book.genre}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-2">
          <p className="text-sm">
            <span className="font-medium">Owner:</span> {book.owner.name}
          </p>
          <p className="text-sm">
            <span className="font-medium">Location:</span> {book.location}
          </p>
          {book.status && (
            <p className="text-sm">
              <span className="font-medium">Status:</span>{" "}
              <Badge
                variant={book.status === "available" ? "default" : "secondary"}
                className={
                  book.status === "available"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }
              >
                {book.status}
              </Badge>
            </p>
          )}
          {book.contact && (
            <p className="text-sm">
              <span className="font-medium">Contact:</span> {book.contact}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {book.status === "available" && (
          <Button className="w-full" onClick={handleRequest} disabled={loading}>
            <BookOpen className="mr-2 h-4 w-4" />
            {loading ? "Requesting..." : "Request Book"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
