// src/redux/api/salesApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utilis/APIDomain";

/* =============================
   TYPES (MATCH BACKEND)
============================= */

export type TSaleItem = {
  productID: number;
  quantity: number;
};

export type TSale = {
  saleID: number;
  customerID?: number;
  saleType: "pos" | "online";
  paymentStatus: "pending" | "paid" | "failed";
  saleStatus: "completed" | "cancelled";
  deliveryRequired: boolean;
  totalAmount: string;
  createdAt?: string;
};

export type TCreateSale = {
  customerID?: number;
  saleType: "pos" | "online";
  paymentStatus: "pending" | "paid" | "failed";
  saleStatus: "completed" | "cancelled";
  deliveryRequired?: boolean;
  totalAmount: number;
  items: TSaleItem[];
};

export type TUpdateSale = Partial<{
  customerID: number;
  saleType: "pos" | "online";
  paymentStatus: "pending" | "paid" | "failed";
  saleStatus: "completed" | "cancelled";
  deliveryRequired: boolean;
  totalAmount: number;
}>;

export type TSaleResponse = {
  message: string;
  data: TSale;
};

/* =============================
   SALES API
============================= */

export const salesAPI = createApi({
  reducerPath: "salesAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: ApiDomain,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),

  tagTypes: ["Sales"],

  endpoints: (builder) => ({
    /* =============================
       CREATE SALE
    ============================= */
    createSale: builder.mutation<TSaleResponse, TCreateSale>({
      query: (body) => ({
        url: "/sales",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Sales"],
    }),

    /* =============================
       GET ALL SALES
    ============================= */
    getAllSales: builder.query<TSale[], void>({
      query: () => "/sales",
      transformResponse: (res: any) => res?.data ?? [],
      providesTags: ["Sales"],
    }),

    /* =============================
       GET SALE BY ID
    ============================= */
    getSaleById: builder.query<TSale | null, number>({
      query: (id) => `/sales/${id}`,
      transformResponse: (res: any) => res?.data ?? null,
      providesTags: ["Sales"],
    }),

    /* =============================
       UPDATE SALE
    ============================= */
    updateSale: builder.mutation<
      { message: string },
      { id: number; body: TUpdateSale }
    >({
      query: ({ id, body }) => ({
        url: `/sales/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Sales"],
    }),

    /* =============================
       DELETE SALE
    ============================= */
    deleteSale: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/sales/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Sales"],
    }),

    /* =============================
       FILTER SALES
    ============================= */
    filterSales: builder.query<
      TSale[],
      {
        customerID?: number;
        saleType?: "pos" | "online";
        paymentStatus?: "pending" | "paid" | "failed";
        saleStatus?: "completed" | "cancelled";
        minTotal?: number;
        maxTotal?: number;
      }
    >({
      query: ({
        customerID,
        saleType,
        paymentStatus,
        saleStatus,
        minTotal,
        maxTotal,
      }) => {
        const params = new URLSearchParams();

        if (customerID !== undefined)
          params.append("customerID", customerID.toString());

        if (saleType) params.append("saleType", saleType);

        if (paymentStatus) params.append("paymentStatus", paymentStatus);

        if (saleStatus) params.append("saleStatus", saleStatus);

        if (minTotal !== undefined)
          params.append("minTotal", minTotal.toString());

        if (maxTotal !== undefined)
          params.append("maxTotal", maxTotal.toString());

        return `/sales/filter?${params.toString()}`;
      },
      transformResponse: (res: any) => res?.data ?? [],
      providesTags: ["Sales"],
    }),
  }),
});

/* =============================
   EXPORT HOOKS
============================= */

export const {
  useCreateSaleMutation,
  useGetAllSalesQuery,
  useGetSaleByIdQuery,
  useUpdateSaleMutation,
  useDeleteSaleMutation,
  useFilterSalesQuery,
} = salesAPI;