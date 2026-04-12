import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";

const STEPS = [
  "Payment Confirmed",
  "Creating Ticket",
  "Preparing Ticket View",
];

export default function PostPaymentProgress({
  eventName,
  onComplete,
  durationMs = 2100,
}) {
  const [activeStep, setActiveStep] = useState(0);

  const stepInterval = useMemo(() => {
    return Math.max(450, Math.floor(durationMs / STEPS.length));
  }, [durationMs]);

  useEffect(() => {
    const timers = [];

    STEPS.forEach((_, index) => {
      timers.push(
        setTimeout(() => {
          setActiveStep(index + 1);
        }, stepInterval * (index + 1))
      );
    });

    timers.push(
      setTimeout(() => {
        onComplete?.();
      }, durationMs)
    );

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [durationMs, onComplete, stepInterval]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-rose-50 pt-20 pb-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/95 backdrop-blur rounded-3xl border border-amber-100 shadow-xl p-6 md:p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Payment Successful <span aria-hidden="true">✅</span></h1>
            <p className="text-gray-600 mt-2">Generating your ticket...</p>
            {eventName && (
              <p className="mt-2 text-sm text-amber-700 font-medium">{eventName}</p>
            )}
          </div>

          <div className="space-y-3">
            {STEPS.map((step, index) => {
              const isDone = activeStep > index;
              const isCurrent = activeStep === index;

              return (
                <div
                  key={step}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-all ${
                    isDone
                      ? "border-emerald-200 bg-emerald-50"
                      : isCurrent
                      ? "border-amber-200 bg-amber-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : isCurrent ? (
                      <Loader2 className="w-5 h-5 text-amber-600 animate-spin" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                    <span className={`text-sm md:text-base ${isDone ? "text-emerald-800 font-medium" : "text-gray-700"}`}>
                      {step}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{isDone ? "Done" : isCurrent ? "In progress" : "Pending"}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-7 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-5">
            <div className="animate-pulse space-y-3">
              <div className="h-4 w-40 bg-gray-200 rounded" />
              <div className="h-6 w-3/4 bg-gray-200 rounded" />
              <div className="h-20 w-full bg-gray-200 rounded-xl" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-10 bg-gray-200 rounded" />
                <div className="h-10 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
