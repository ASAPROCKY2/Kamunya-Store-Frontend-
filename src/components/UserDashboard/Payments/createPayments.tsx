// src/components/Payments/createPayments.tsx

import React, { useState } from "react";
import { useInitiateSTKPushMutation } from "../../../features/Payments/paymentsApi";

type Props = {
  saleID: number;
  amount: number;
};

const CreatePayments: React.FC<Props> = ({ saleID, amount }) => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const [initiateSTKPush, { isLoading, isSuccess, isError, error }] =
    useInitiateSTKPushMutation();

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneNumber) {
      alert("Please enter your phone number");
      return;
    }

    try {
      await initiateSTKPush({
        phoneNumber,
        amount,
        saleID,
      }).unwrap();

      alert("STK Push sent. Check your phone to complete payment.");
    } catch (err) {
      console.error("Payment failed:", err);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">M-Pesa Payment</h2>

      <p className="text-gray-600 mb-4">
        Amount to pay: <span className="font-bold">KES {amount}</span>
      </p>

      <form onSubmit={handlePayment} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            M-Pesa Phone Number
          </label>

          <input
            type="tel"
            placeholder="e.g. 254712345678"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
        >
          {isLoading ? "Processing..." : "Pay with M-Pesa"}
        </button>

        {isSuccess && (
          <p className="text-green-600 text-sm">
            Payment request sent. Please check your phone.
          </p>
        )}

        {isError && (
          <p className="text-red-600 text-sm">
            Payment failed. Please try again.
          </p>
        )}
      </form>
    </div>
  );
};

export default CreatePayments;