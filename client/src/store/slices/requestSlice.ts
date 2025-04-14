"use client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AuthState } from "./authSlice";

interface RequestState {
  requests: any[];
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: RequestState = {
  requests: [],
  loading: false,
  success: false,
  error: null,
};

export const requestBook = createAsyncThunk(
  "requests/requestBook",
  async ({ bookId }: { bookId: string }, { getState }) => {
    const { auth } = getState() as { auth: AuthState };
    const userId = auth.user?._id;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/requests`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, userId }),
      }
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Request failed");
    return data;
  }
);

export const fetchBookRequests = createAsyncThunk(
  "requests/fetchBookRequests",
  async (_, { getState }) => {
    const { auth } = getState() as { auth: AuthState };
    const ownerId = auth.user?._id;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/requests/owner/${ownerId}`
    );
    return await response.json();
  }
);

export const respondToRequest = createAsyncThunk(
  "requests/respondToRequest",
  async (
    { requestId, status }: { requestId: string; status: string },
    { getState }
  ) => {
    const { auth } = getState() as { auth: AuthState };
    console.log("Auth state in respondToRequest:", auth);

    const ownerId = auth.user?._id;
    console.log(ownerId);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/requests/${requestId}/respond`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, ownerId }),
      }
    );
    return await response.json();
  }
);
const requestSlice = createSlice({
  name: "requests",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(requestBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestBook.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.requests = action.payload;
      })
      .addCase(requestBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to request the book";
      })
      .addCase(fetchBookRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.requests = action.payload;
      })
      .addCase(fetchBookRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch requests";
      })
      .addCase(respondToRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(respondToRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const updatedRequest = action.payload;
        state.requests = state.requests.map((request) =>
          request._id === updatedRequest._id ? updatedRequest : request
        );
      })
      .addCase(respondToRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to respond to request";
      });
  },
});

export default requestSlice.reducer;
