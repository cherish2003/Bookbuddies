"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useEffect } from "react";
import {
  fetchBookRequests,
  respondToRequest,
} from "@/store/slices/requestSlice";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";

interface BookRequest {
  _id: string;
  book?: {
    title: string;
  };
  requester?: {
    name: string;
  };
  createdAt: string;
  status: string;
}

export function RequestsView() {
  const dispatch = useDispatch<AppDispatch>();
  const { requests, loading, error } = useSelector(
    (state: RootState) => state.requests
  );
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchBookRequests());
    }
  }, [dispatch, user?._id]);

  const handleRespond = async (
    requestId: string,
    status: "approved" | "rejected"
  ) => {
    try {
      await dispatch(respondToRequest({ requestId, status })).unwrap();
      toast.success(`Request ${status} successfully`);
      dispatch(fetchBookRequests());
    } catch (error) {
      console.log(error);
      
      toast.error("Failed to process request");
    }
  };

  if (loading)
    return <div className="flex justify-center p-8">Loading requests...</div>;
  if (error) return <div className="text-red-500 p-8">Error: {error}</div>;

  const safeRequests = Array.isArray(requests) ? requests : [];

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Book Requests</h2>

      <Card>
        <CardHeader>
          <CardTitle>Manage Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book</TableHead>
                <TableHead>Requester</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {safeRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No requests found
                  </TableCell>
                </TableRow>
              ) : (
                safeRequests.map((request: BookRequest) => (
                  <TableRow key={request._id}>
                    <TableCell className="font-medium">
                      {request.book?.title || "N/A"}
                    </TableCell>
                    <TableCell>{request.requester?.name || "N/A"}</TableCell>
                    <TableCell>
                      {new Date(request.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          request.status === "approved"
                            ? "default"
                            : request.status === "pending"
                            ? "secondary"
                            : "destructive"
                        }
                        className="capitalize"
                      >
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex justify-center space-x-2">
                      {request.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8"
                            onClick={() =>
                              handleRespond(request._id, "approved")
                            }
                          >
                            <Check className="mr-1 h-4 w-4 text-green-500" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8"
                            onClick={() =>
                              handleRespond(request._id, "rejected")
                            }
                          >
                            <X className="mr-1 h-4 w-4 text-red-500" />
                            Reject
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
