"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { InputField } from "../InputField";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

const searchSchema = z.object({
  query: z.string().min(1, { message: "Vui lòng nhập từ khóa tìm kiếm." }),
});

type SearchFormValues = z.infer<typeof searchSchema>;

const SearchBar = () => {
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: "",
    },
  });

  function onSubmit(data: SearchFormValues) {
    console.log("Dữ liệu tìm kiếm:", data.query);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex space-x-2">
        <InputField
          control={form.control}
          name="query"
          placeholder="Tìm kiếm..."
        />
        <Button type="submit">Tìm</Button>
      </form>
    </Form>
  );
};

export default SearchBar;
