import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { fetchBorrowedBooks } from "@/store/slices/bookSlice";
import { AppDispatch, RootState } from "@/store/store";
import { BookOpen, Bookmark, Clock, Check } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Badge } from "./ui/badge";

export function SeekerDashboard({ books }: { books: any[] }) {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const { borrowedBooks } = useSelector((state: RootState) => state.books);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchBorrowedBooks(user._id));
    }
  }, [dispatch, user?._id]);

  const totalBooks = books.length;
  const availableBooks = books.filter((book) => book.available).length;

  const userRequests =
    books.filter((req: any) => req.requestedBy === user?._id) || [];

  const requestedBooks = userRequests.length;
  const borrowedBooksCount = borrowedBooks.length;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Seeker Dashboard</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Books Available
            </CardTitle>
            <BookOpen className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBooks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Currently Available
            </CardTitle>
            <Bookmark className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableBooks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Your Requests</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requestedBooks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Borrowed Books
            </CardTitle>
            <Check className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{borrowedBooksCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Recent Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userRequests.length > 0 ? (
                userRequests.map((book, index) => (
                  <div key={index} className="border p-2 rounded-md shadow-sm">
                    <h3 className="font-medium">
                      Book title: {book.title || "Unknown Book"}
                    </h3>
                    <p className="font-medium">
                      Author : {book.author || "Unknown Author"}
                    </p>
                    <Badge
                      variant={
                        book.status === "available"
                          ? "default"
                          : book.status === "requested"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {book.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No recent requests</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recently Available Books</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {books
                .filter((book) => book.available)
                .slice(0, 3)
                .map((book) => (
                  <div key={book._id} className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="font-medium">{book.title}</p>
                      <p className="text-sm text-gray-500">{book.author}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {book.location}
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Borrowed Books</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {borrowedBooks.length > 0 ? (
                borrowedBooks.slice(0, 3).map((book) => (
                  <div
                    key={book._id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{book.title}</p>
                      <p className="text-sm text-gray-500">{book.author}</p>
                    </div>
                    <Badge variant="default">Borrowed</Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No books borrowed yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
