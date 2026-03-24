// src/redux/api/productsApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utilis/APIDomain";

/* =============================
   TYPES (MATCH BACKEND)
============================= */

export type TProduct = {
  productID: number;
  name: string;
  category?: string;
  sku: string;
  buyingPrice: number;
  sellingPrice: number;
  stockQuantity: number;
  reorderLevel: number;
  imageURL?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type TCreateProduct = {
  name: string;
  category?: string;
  sku: string;
  buyingPrice: number;
  sellingPrice: number;
  stockQuantity?: number;
  reorderLevel?: number;
  imageURL?: string;
  isActive?: boolean;
};

export type TUpdateProduct = Partial<TCreateProduct>;

export type TProductResponse = {
  message: string;
  data: TProduct;
};

/* =============================
   PRODUCTS API
============================= */

export const productsAPI = createApi({
  reducerPath: "productsAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: ApiDomain,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),

  tagTypes: ["Products"],

  endpoints: (builder) => ({
    /* =============================
       CREATE PRODUCT
    ============================= */
    createProduct: builder.mutation<TProductResponse, TCreateProduct>({
      query: (body) => ({
        url: "/products",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Products"],
    }),

    /* =============================
       GET ALL PRODUCTS
    ============================= */
    getAllProducts: builder.query<TProduct[], void>({
      query: () => "/products",
      transformResponse: (res: any) => res?.data ?? [],
      providesTags: ["Products"],
    }),

    /* =============================
       GET PRODUCT BY ID
    ============================= */
    getProductById: builder.query<TProduct | null, number>({
      query: (id) => `/products/${id}`,
      transformResponse: (res: any) => res?.data ?? null,
      providesTags: ["Products"],
    }),

    /* =============================
       GET PRODUCT BY SKU
    ============================= */
    getProductBySku: builder.query<TProduct | null, string>({
      query: (sku) => `/products/sku/${sku}`,
      transformResponse: (res: any) => res?.data ?? null,
      providesTags: ["Products"],
    }),

    /* =============================
       UPDATE PRODUCT
    ============================= */
    updateProduct: builder.mutation<
      { message: string },
      { id: number; body: TUpdateProduct }
    >({
      query: ({ id, body }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Products"],
    }),

    /* =============================
       DELETE PRODUCT
    ============================= */
    deleteProduct: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),

    /* =============================
       FILTER PRODUCTS
       (by price, category, name, active)
    ============================= */
    filterProducts: builder.query<
      TProduct[],
      { minPrice?: number; maxPrice?: number; category?: string; name?: string; isActive?: boolean }
    >({
      query: ({ minPrice, maxPrice, category, name, isActive }) => {
        const params = new URLSearchParams();
        if (minPrice !== undefined) params.append("minPrice", minPrice.toString());
        if (maxPrice !== undefined) params.append("maxPrice", maxPrice.toString());
        if (category) params.append("category", category);
        if (name) params.append("name", name);
        if (isActive !== undefined) params.append("isActive", isActive.toString());
        return `/products/filter?${params.toString()}`;
      },
      transformResponse: (res: any) => res?.data ?? [],
      providesTags: ["Products"],
    }),
  }),
});

/* =============================
   EXPORT HOOKS
============================= */

export const {
  useCreateProductMutation,
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useGetProductBySkuQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useFilterProductsQuery,
} = productsAPI;