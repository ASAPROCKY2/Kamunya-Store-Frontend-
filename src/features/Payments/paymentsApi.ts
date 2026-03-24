// src/redux/api/paymentsApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utilis/APIDomain";

/* =============================
   TYPES (MATCH BACKEND)
============================= */

export type TPaymentStatus = "pending" | "paid" | "failed";

export type TPayment = {
  paymentID: number;
  saleID: number;
  merchantRequestID?: string;
  checkoutRequestID?: string;
  mpesaReceiptNumber?: string;
  phoneNumber: string;
  status: TPaymentStatus;
  amount: number;
  createdAt?: string;
};

export type TCreatePayment = {
  saleID: number;
  merchantRequestID?: string;
  checkoutRequestID?: string;
  mpesaReceiptNumber?: string;
  phoneNumber: string;
  status: TPaymentStatus;
  amount: number;
};

export type TUpdatePayment = Partial<TCreatePayment>;

export type TPaymentResponse = {
  message: string;
  data: TPayment;
};

/* =============================
   STK PUSH REQUEST TYPE
============================= */

export type TSTKPushRequest = {
  phoneNumber: string;
  amount: number;
  saleID: number;
};

export type TSTKPushResponse = {
  message: string;
  data: any;
};

/* =============================
   PAYMENTS API
============================= */

export const paymentsAPI = createApi({
  reducerPath: "paymentsAPI",

  baseQuery: fetchBaseQuery({
    baseUrl: ApiDomain,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),

  tagTypes: ["Payments"],

  endpoints: (builder) => ({
    /* =============================
       CREATE PAYMENT
    ============================= */
    createPayment: builder.mutation<TPaymentResponse, TCreatePayment>({
      query: (body) => ({
        url: "/payments",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Payments"],
    }),

    /* =============================
       GET ALL PAYMENTS
    ============================= */
    getAllPayments: builder.query<TPayment[], void>({
      query: () => "/payments",
      transformResponse: (res: any) => res?.data ?? [],
      providesTags: ["Payments"],
    }),

    /* =============================
       GET PAYMENT BY ID
    ============================= */
    getPaymentById: builder.query<TPayment | null, number>({
      query: (id) => `/payments/${id}`,
      transformResponse: (res: any) => res?.data ?? null,
      providesTags: ["Payments"],
    }),

    /* =============================
       UPDATE PAYMENT
    ============================= */
    updatePayment: builder.mutation<
      { message: string },
      { id: number; body: TUpdatePayment }
    >({
      query: ({ id, body }) => ({
        url: `/payments/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Payments"],
    }),

    /* =============================
       DELETE PAYMENT
    ============================= */
    deletePayment: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/payments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Payments"],
    }),

    /* =============================
       FILTER PAYMENTS
    ============================= */
    filterPayments: builder.query<
      TPayment[],
      {
        saleID?: number;
        phoneNumber?: string;
        status?: TPaymentStatus;
        minAmount?: number;
        maxAmount?: number;
      }
    >({
      query: ({ saleID, phoneNumber, status, minAmount, maxAmount }) => {
        const params = new URLSearchParams();

        if (saleID !== undefined) params.append("saleID", saleID.toString());
        if (phoneNumber) params.append("phoneNumber", phoneNumber);
        if (status) params.append("status", status);
        if (minAmount !== undefined)
          params.append("minAmount", minAmount.toString());
        if (maxAmount !== undefined)
          params.append("maxAmount", maxAmount.toString());

        return `/payments/filter?${params.toString()}`;
      },

      transformResponse: (res: any) => res?.data ?? [],
      providesTags: ["Payments"],
    }),

    /* =============================
       INITIATE M-PESA STK PUSH
    ============================= */
    initiateSTKPush: builder.mutation<TSTKPushResponse, TSTKPushRequest>({
      query: (body) => ({
        url: "/payments/stkpush",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Payments"],
    }),
  }),
});

/* =============================
   EXPORT HOOKS
============================= */

export const {
  useCreatePaymentMutation,
  useGetAllPaymentsQuery,
  useGetPaymentByIdQuery,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
  useFilterPaymentsQuery,
  useInitiateSTKPushMutation,
} = paymentsAPI;