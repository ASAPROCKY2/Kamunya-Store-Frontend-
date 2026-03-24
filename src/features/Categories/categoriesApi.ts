// src/redux/api/categoriesAPI.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utilis/APIDomain";

/* =============================
   TYPES (MATCH BACKEND)
============================= */

// Category object
export type TCategory = {
  categoryID: number;
  name: string;
  imageURL?: string;
  isActive: boolean;
  createdAt?: string;
};

// Payload for creating category
export type TCreateCategory = {
  name: string;
  imageURL?: string;
  isActive?: boolean;
};

// Payload for updating category
export type TUpdateCategory = Partial<TCreateCategory>;

// Response when creating category
export type TCategoryResponse = {
  message: string;
  data: TCategory;
};

/* =============================
   CATEGORIES API
============================= */

export const categoriesAPI = createApi({
  reducerPath: "categoriesAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: ApiDomain,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),

  tagTypes: ["Categories"],

  endpoints: (builder) => ({
    /* =============================
       CREATE CATEGORY
    ============================= */
    createCategory: builder.mutation<TCategoryResponse, TCreateCategory>({
      query: (body) => ({
        url: "/categories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Categories"],
    }),

    /* =============================
       GET ALL CATEGORIES
    ============================= */
    getAllCategories: builder.query<TCategory[], void>({
      query: () => "/categories",
      transformResponse: (res: any) => res?.data ?? [],
      providesTags: ["Categories"],
    }),

    /* =============================
       GET ACTIVE CATEGORIES
       (Used for landing page menu)
    ============================= */
    getActiveCategories: builder.query<TCategory[], void>({
      query: () => "/categories/active",
      transformResponse: (res: any) => res?.data ?? [],
      providesTags: ["Categories"],
    }),

    /* =============================
       GET CATEGORY BY ID
    ============================= */
    getCategoryById: builder.query<TCategory | null, number>({
      query: (id) => `/categories/${id}`,
      transformResponse: (res: any) => res?.data ?? null,
      providesTags: ["Categories"],
    }),

    /* =============================
       UPDATE CATEGORY
    ============================= */
    updateCategory: builder.mutation<
      { message: string },
      { id: number; body: TUpdateCategory }
    >({
      query: ({ id, body }) => ({
        url: `/categories/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Categories"],
    }),

    /* =============================
       DELETE CATEGORY
    ============================= */
    deleteCategory: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),

    /* =============================
       FILTER CATEGORIES
    ============================= */
    filterCategories: builder.query<
      TCategory[],
      { name?: string; isActive?: boolean }
    >({
      query: ({ name, isActive }) => {
        const params = new URLSearchParams();

        if (name) params.append("name", name);
        if (isActive !== undefined)
          params.append("isActive", isActive.toString());

        return `/categories/filter?${params.toString()}`;
      },
      transformResponse: (res: any) => res?.data ?? [],
      providesTags: ["Categories"],
    }),
  }),
});

/* =============================
   EXPORT HOOKS
============================= */

export const {
  useCreateCategoryMutation,
  useGetAllCategoriesQuery,
  useGetActiveCategoriesQuery,
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFilterCategoriesQuery,
} = categoriesAPI;