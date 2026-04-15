import React from "react";
import { Headphones, Mail, MessageCircleWarning, Phone } from "lucide-react";

const Support = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-24 px-4 md:pt-24 md:pb-10">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
          <p className="text-sm text-gray-500 mt-1">We are here to help you with booking, payments and account issues.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-3">
              <Mail size={18} />
            </div>
            <p className="font-semibold text-gray-900">Email Support</p>
            <p className="text-sm text-gray-500 mt-1">support@bookshow.com</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-3">
              <Phone size={18} />
            </div>
            <p className="font-semibold text-gray-900">Call Support</p>
            <p className="text-sm text-gray-500 mt-1">+91 98765 43210</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm sm:col-span-2">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-3">
              <MessageCircleWarning size={18} />
            </div>
            <p className="font-semibold text-gray-900">Common issue</p>
            <p className="text-sm text-gray-500 mt-1">
              If payment is debited but ticket is not shown, open My Bookings and refresh once. If still missing, contact support with your payment ID.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Headphones size={18} />
            <p className="font-semibold">Support hours</p>
          </div>
          <p className="text-sm text-red-50">Mon-Sun, 9:00 AM to 11:00 PM</p>
        </div>
      </div>
    </div>
  );
};

export default Support;
