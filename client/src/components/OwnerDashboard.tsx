import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpen, Bookmark, Clock, Check } from "lucide-react";

export function OwnerDashboard({ books }: { books: any[] }) {
  const totalBooks = books.length;
  const availableBooks = books.filter((book) => book.available).length;
  const requestedBooks = books.filter(
    (book) => !book.available && book.status === "requested"
  ).length;
  const exchangedBooks = books.filter(
    (book) => book.status === "exchanged"
  ).length;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Owner Dashboard</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <BookOpen className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBooks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Bookmark className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableBooks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Requested</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requestedBooks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Exchanged</CardTitle>
            <Check className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exchangedBooks}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {books
                .filter((book) => book.requests && book.requests.length > 0)
                .slice(0, 3)
                .map((book) => (
                  <div
                    key={book._id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{book.title}</p>
                      <p className="text-sm text-gray-500">
                        {book.requests.length} request(s)
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {book.requests[0].status}
                    </span>
                  </div>
                ))}
              {books.filter((book) => book.requests && book.requests.length > 0)
                .length === 0 && (
                <p className="text-gray-500">No recent requests</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recently Added Books</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {books.slice(0, 3).map((book) => (
                <div key={book._id} className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="font-medium">{book.title}</p>
                    <p className="text-sm text-gray-500">{book.author}</p>
                  </div>
                  <span
                    className={`text-sm ${
                      book.available ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {book.available ? "Available" : "Unavailable"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
