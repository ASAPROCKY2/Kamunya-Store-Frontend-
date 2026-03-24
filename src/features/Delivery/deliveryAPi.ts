// src/redux/api/deliveryApi.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utilis/APIDomain";

/* =====================================================
   TYPES (MATCH BACKEND)
===================================================== */

export type TDeliveryStatus =
  | "pending"
  | "in_transit"
  | "delivered"
  | "cancelled";

export type TDelivery = {
  deliveryID: number;

  /* RELATIONS */
  saleID: number;
  deliveryAgentID?: number;

  /* CUSTOMER CONTACT */
  fullName?: string;
  phone?: string;

  /* ADDRESS */
  county?: string;
  city?: string;
  area?: string;
  street?: string;
  building?: string;
  houseNumber?: string;
  landmark?: string;

  /* NOTES */
  deliveryInstructions?: string;

  /* GPS */
  latitude?: number;
  longitude?: number;

  /* DELIVERY INFO */
  deliveryFee?: number;
  status: TDeliveryStatus;

  createdAt?: string;
  updatedAt?: string;
};

export type TCreateDelivery = {
  saleID: number;
  deliveryAgentID?: number;

  fullName?: string;
  phone?: string;

  county?: string;
  city?: string;
  area?: string;
  street?: string;
  building?: string;
  houseNumber?: string;
  landmark?: string;

  deliveryInstructions?: string;

  latitude?: number;
  longitude?: number;

  deliveryFee?: number;
  status?: TDeliveryStatus;
};

export type TUpdateDelivery = Partial<TCreateDelivery>;

export type TDeliveryResponse = {
  success: boolean;
  message: string;
  data: TDelivery;
};

/* =====================================================
   DELIVERY API
===================================================== */

export const deliveryAPI = createApi({
  reducerPath: "deliveryAPI",

  baseQuery: fetchBaseQuery({
    baseUrl: ApiDomain,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),

  tagTypes: ["Deliveries"],

  endpoints: (builder) => ({
    /* =====================================================
       CREATE DELIVERY
    ===================================================== */

    createDelivery: builder.mutation<TDeliveryResponse, TCreateDelivery>({
      query: (body) => ({
        url: "/deliveries",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Deliveries"],
    }),

    /* =====================================================
       GET ALL DELIVERIES
    ===================================================== */

    getAllDeliveries: builder.query<TDelivery[], void>({
      query: () => "/deliveries",

      transformResponse: (res: any) => res?.data ?? [],

      providesTags: ["Deliveries"],
    }),

    /* =====================================================
       GET DELIVERY BY ID
    ===================================================== */

    getDeliveryById: builder.query<TDelivery | null, number>({
      query: (id) => `/deliveries/${id}`,

      transformResponse: (res: any) => res?.data ?? null,

      providesTags: ["Deliveries"],
    }),

    /* =====================================================
       UPDATE DELIVERY
    ===================================================== */

    updateDelivery: builder.mutation<
      { success: boolean; message: string },
      { id: number; body: TUpdateDelivery }
    >({
      query: ({ id, body }) => ({
        url: `/deliveries/${id}`,
        method: "PUT",
        body,
      }),

      invalidatesTags: ["Deliveries"],
    }),

    /* =====================================================
       DELETE DELIVERY
    ===================================================== */

    deleteDelivery: builder.mutation<
      { success: boolean; message: string },
      number
    >({
      query: (id) => ({
        url: `/deliveries/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["Deliveries"],
    }),

    /* =====================================================
       FILTER DELIVERIES
    ===================================================== */

    filterDeliveries: builder.query<
      TDelivery[],
      {
        saleID?: number;
        deliveryAgentID?: number;
        status?: TDeliveryStatus;
        phone?: string;
        county?: string;
        city?: string;
      }
    >({
      query: ({
        saleID,
        deliveryAgentID,
        status,
        phone,
        county,
        city,
      }) => {
        const params = new URLSearchParams();

        if (saleID !== undefined)
          params.append("saleID", saleID.toString());

        if (deliveryAgentID !== undefined)
          params.append("deliveryAgentID", deliveryAgentID.toString());

        if (status) params.append("status", status);

        if (phone) params.append("phone", phone);

        if (county) params.append("county", county);

        if (city) params.append("city", city);

        return `/deliveries/filter?${params.toString()}`;
      },

      transformResponse: (res: any) => res?.data ?? [],

      providesTags: ["Deliveries"],
    }),
  }),
});

/* =====================================================
   EXPORT HOOKS
===================================================== */

export const {
  useCreateDeliveryMutation,
  useGetAllDeliveriesQuery,
  useGetDeliveryByIdQuery,
  useUpdateDeliveryMutation,
  useDeleteDeliveryMutation,
  useFilterDeliveriesQuery,
} = deliveryAPI;