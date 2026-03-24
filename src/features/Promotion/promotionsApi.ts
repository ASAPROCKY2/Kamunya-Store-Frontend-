// src/redux/api/promotionApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utilis/APIDomain";

/* =============================
   TYPES (MATCH BACKEND)
============================= */

// Promotion object
export type TPromotion = {
  promoID: number;
  title: string;
  imageURL?: string;
  link?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

// Payload for creating promotion
export type TCreatePromotion = {
  title: string;
  imageURL?: string;
  link?: string;
  isActive?: boolean;
};

// Payload for updating promotion
export type TUpdatePromotion = Partial<TCreatePromotion>;

// Response when creating promotion
export type TPromotionResponse = {
  message: string;
  data: TPromotion;
};

/* =============================
   PROMOTIONS API
============================= */

export const promotionAPI = createApi({
  reducerPath: "promotionAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: ApiDomain,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),

  tagTypes: ["Promotions"],

  endpoints: (builder) => ({
    /* =============================
       CREATE PROMOTION
    ============================= */
    createPromotion: builder.mutation<TPromotionResponse, TCreatePromotion>({
      query: (body) => ({
        url: "/promotions",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Promotions"],
    }),

    /* =============================
       GET ALL PROMOTIONS
    ============================= */
    getAllPromotions: builder.query<TPromotion[], void>({
      query: () => "/promotions",
      transformResponse: (res: any) => res?.data ?? [],
      providesTags: ["Promotions"],
    }),

    /* =============================
       GET ACTIVE PROMOTIONS
       (For Hero / Banner Carousel)
    ============================= */
    getActivePromotions: builder.query<TPromotion[], void>({
      query: () => "/promotions/active",
      transformResponse: (res: any) => res?.data ?? [],
      providesTags: ["Promotions"],
    }),

    /* =============================
       GET PROMOTION BY ID
    ============================= */
    getPromotionById: builder.query<TPromotion | null, number>({
      query: (id) => `/promotions/${id}`,
      transformResponse: (res: any) => res?.data ?? null,
      providesTags: ["Promotions"],
    }),

    /* =============================
       UPDATE PROMOTION
    ============================= */
    updatePromotion: builder.mutation<
      { message: string },
      { id: number; body: TUpdatePromotion }
    >({
      query: ({ id, body }) => ({
        url: `/promotions/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Promotions"],
    }),

    /* =============================
       DELETE PROMOTION
    ============================= */
    deletePromotion: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/promotions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Promotions"],
    }),

    /* =============================
       FILTER PROMOTIONS
    ============================= */
    filterPromotions: builder.query<
      TPromotion[],
      { title?: string; isActive?: boolean }
    >({
      query: ({ title, isActive }) => {
        const params = new URLSearchParams();
        if (title) params.append("title", title);
        if (isActive !== undefined) params.append("isActive", isActive.toString());
        return `/promotions/filter?${params.toString()}`;
      },
      transformResponse: (res: any) => res?.data ?? [],
      providesTags: ["Promotions"],
    }),
  }),
});

/* =============================
   EXPORT HOOKS
============================= */
export const {
  useCreatePromotionMutation,
  useGetAllPromotionsQuery,
  useGetActivePromotionsQuery,
  useGetPromotionByIdQuery,
  useUpdatePromotionMutation,
  useDeletePromotionMutation,
  useFilterPromotionsQuery,
} = promotionAPI;