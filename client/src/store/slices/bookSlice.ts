"use client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AuthState } from "./authSlice";
interface BookState {
  books: any[];
  ownerBooks: any[];
  borrowedBooks: any[];
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: BookState = {
  books: [],
  ownerBooks: [],
  borrowedBooks: [],
  loading: false,
  success: false,
  error: null,
};

export const fetchBooks = createAsyncThunk(
  "books/fetchBooks",
  async ({ search }: { search?: string }) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/books?${params}`
    );
    return await response.json();
  }
);

export const fetchOwnerBooks = createAsyncThunk(
  "books/fetchOwnerBooks",
  async (ownerId: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/books?owner=${ownerId}`
    );
    return await response.json();
  }
);

export const fetchBorrowedBooks = createAsyncThunk(
  "books/fetchBorrowedBooks",
  async (userId: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/books/borrowed/${userId}`
    );
    return await response.json();
  }
);

export const createBook = createAsyncThunk(
  "books/createBook",
  async (bookData: any, { getState }) => {
    const { auth } = getState() as { auth: AuthState };
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/books`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...bookData, ownerId: auth.user?._id }),
      }
    );
    return await response.json();
  }
);

export const updateBook = createAsyncThunk(
  "books/updateBook",
  async (
    { id, ...bookData }: { id: string; [key: string]: any },
    { getState }
  ) => {
    const { auth } = getState() as { auth: AuthState };
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/books/${id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...bookData, ownerId: auth.user?._id }),
      }
    );
    return await response.json();
  }
);

export const deleteBook = createAsyncThunk(
  "books/deleteBook",
  async (id: string, { getState }) => {
    const { auth } = getState() as { auth: AuthState };
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/books/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ownerId: auth.user?._id }),
    });
    return id;
  }
);

const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch books";
      })
      .addCase(fetchOwnerBooks.fulfilled, (state, action) => {
        state.ownerBooks = action.payload;
      })
      .addCase(fetchBorrowedBooks.fulfilled, (state, action) => {
        state.borrowedBooks = action.payload;
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.ownerBooks.push(action.payload);
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        const index = state.ownerBooks.findIndex(
          (book: any) => book._id === action.payload._id
        );
        if (index !== -1) {
          state.ownerBooks[index] = action.payload;
        }
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.ownerBooks = state.ownerBooks.filter(
          (book: any) => book._id !== action.payload
        );
      });
  },
});

export default bookSlice.reducer;
