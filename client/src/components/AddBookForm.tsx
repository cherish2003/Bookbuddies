"use client";

import { useForm } from "react-hook-form";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { RootState } from "@/store/store";
import { createBook } from "@/store/slices/bookSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { toast } from "sonner";
import { UnknownAction } from "@reduxjs/toolkit";

interface BookFormValues {
  title: string;
  author: string;
  location: string;
  contact: string;
  genre?: string;
}

export function AddBookForm() {
  const dispatch = useDispatch();
  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

  const { user } = useTypedSelector((state) => state.auth);
  const { loading, error, success } = useSelector(
    (state: RootState) => state.books
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookFormValues>({
    defaultValues: {
      title: "",
      author: "",
      location: "",
      contact: "",
      genre: "",
    },
  });

  const onSubmit = (values: BookFormValues) => {
    dispatch(
      createBook({
        ...values,
        owner: user ? user._id : "",
      }) as unknown as UnknownAction
    );
  };

  useEffect(() => {
    if (success) {
      toast.success("Book added successfully 📚");
      reset();
    }

    if (error) {
      toast.error("Failed to add book. Try again 😞");
    }
  }, [success, error, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Title</label>
        <Input
          placeholder="Book Title"
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Author</label>
        <Input
          placeholder="Author"
          {...register("author", { required: "Author is required" })}
        />
        {errors.author && (
          <p className="text-sm text-red-500">{errors.author.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Location</label>
        <Input
          placeholder="Location"
          {...register("location", { required: "Location is required" })}
        />
        {errors.location && (
          <p className="text-sm text-red-500">{errors.location.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Contact Info</label>
        <Input
          placeholder="Email or Phone"
          {...register("contact", { required: "Contact info is required" })}
        />
        {errors.contact && (
          <p className="text-sm text-red-500">{errors.contact.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Genre (Optional)</label>
        <Input placeholder="Fiction, Science, etc." {...register("genre")} />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Adding..." : "Add Book"}
      </Button>
    </form>
  );
}
