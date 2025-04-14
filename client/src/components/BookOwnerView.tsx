import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "./ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOwnerBooks,
  deleteBook,
  updateBook,
} from "@/store/slices/bookSlice";
import { RootState, AppDispatch } from "@/store/store";
import { AddBookModal } from "./AddBookModal";
import { EditBookModal } from "./EditBookModal";

export function BookOwnerView() {
  const dispatch = useDispatch<AppDispatch>();
  const { ownerBooks, loading, error } = useSelector(
    (state: RootState) => state.books
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const [editingBook, setEditingBook] = useState<any>(null);
  console.log("ownerBooks", ownerBooks);
  const statusVariants: Record<
    string,
    "default" | "secondary" | "outline" | "destructive"
  > = {
    available: "default",
    exchanged: "secondary",
    pending: "outline",
    unavailable: "destructive",
  };

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchOwnerBooks(user._id));
    }
  }, [dispatch, user]);

  const handleDelete = (bookId: string) => {
    if (confirm("Are you sure you want to delete this book?")) {
      dispatch(deleteBook(bookId));
    }
  };

  const handleEditClick = (book: any) => {
    setEditingBook(book);
  };

  const handleSaveEdit = async (updatedBookData: any) => {
    try {
      await dispatch(
        updateBook({
          id: editingBook._id,
          ...updatedBookData,
        })
      ).unwrap();

      setEditingBook(null);
      dispatch(fetchOwnerBooks(user!._id));
    } catch (error) {
      console.error("Failed to update book:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Book Listings</h2>
        <AddBookModal />
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Requests</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ownerBooks.map(
              (book: {
                _id: string;
                title: string;
                author: string;
                status: string;
                location: string;
                requests: any[];
              }) => (
                <TableRow key={book._id}>
                  <TableCell className="font-medium">{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariants[book.status] ?? "secondary"}>
                      {book.status}
                    </Badge>
                  </TableCell>

                  <TableCell>{book.location}</TableCell>
                  <TableCell>
                    {book.requests.length > 0 ? (
                      <Badge
                        variant="outline"
                        className="border-blue-300 text-blue-600"
                      >
                        {book.requests.length}
                      </Badge>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(book)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600"
                      onClick={() => handleDelete(book._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </Card>
      {editingBook && (
        <EditBookModal
          book={editingBook}
          open={!!editingBook}
          onOpenChange={(open) => !open && setEditingBook(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}
