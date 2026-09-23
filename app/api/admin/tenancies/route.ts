import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const ADMIN_EMAIL =
  "admin@wakefieldpropertylettings.co.uk";

function calculateProrata(
  monthlyRent: number,
  movingDate: string,
  paymentDay: number
) {
  if (
    !Number.isFinite(monthlyRent) ||
    monthlyRent <= 0
  ) {
    throw new Error(
      "Invalid monthly rent."
    );
  }

  if (
    paymentDay !== 1 &&
    paymentDay !== 15
  ) {
    throw new Error(
      "Invalid rent payment day."
    );
  }

  const [
    yearValue,
    monthValue,
    dayValue,
  ] = movingDate
    .split("-")
    .map(Number);

  if (
    !yearValue ||
    !monthValue ||
    !dayValue
  ) {
    throw new Error(
      "Invalid moving date."
    );
  }

  /*
   * Wakefield Property Lettings
   * fixed 30-day rental-month rule.
   *
   * Every rental month is treated
   * as exactly 30 days.
   *
   * Daily rent =
   * monthly rent / 30.
   *
   * We deliberately DO NOT use
   * the real number of calendar
   * days in the month.
   */
  const dailyRent =
    monthlyRent / 30;

  /*
   * If the tenant moves in exactly
   * on their regular payment day,
   * there is no pro-rata period.
   *
   * The normal monthly rent is due.
   */
  if (dayValue === paymentDay) {
    return {
      amount: 0,
      days: 0,
      dailyRent:
        Math.round(
          dailyRent * 100
        ) / 100,
      nextPaymentDate:
        movingDate,
    };
  }

  let days = 0;

  let nextPaymentYear =
    yearValue;

  let nextPaymentMonth =
    monthValue;

  /*
   * REGULAR PAYMENT DAY: 1ST
   */
  if (paymentDay === 1) {
    /*
     * Fixed 30-day rental month.
     *
     * Example:
     * move in 26th
     *
     * Charge:
     * 26, 27, 28, 29, 30
     *
     * = 5 days.
     *
     * The calendar 31st is ignored.
     */
    days =
      Math.max(
        0,
        31 -
          Math.min(
            dayValue,
            30
          )
      );

    nextPaymentMonth += 1;

    if (nextPaymentMonth > 12) {
      nextPaymentMonth = 1;
      nextPaymentYear += 1;
    }
  }

  /*
   * REGULAR PAYMENT DAY: 15TH
   */
  if (paymentDay === 15) {
    if (dayValue < 15) {
      /*
       * Example:
       * move in 10th
       *
       * Charge:
       * 10, 11, 12, 13, 14
       *
       * = 5 days.
       */
      days =
        15 - dayValue;
    } else {
      /*
       * Example:
       * move in 26th
       *
       * Remaining fixed-month days:
       * 26,27,28,29,30 = 5
       *
       * Then:
       * 1st-14th = 14
       *
       * Total = 19 days.
       */
      days =
        (31 -
          Math.min(
            dayValue,
            30
          )) +
        14;

      nextPaymentMonth += 1;

      if (
        nextPaymentMonth > 12
      ) {
        nextPaymentMonth = 1;
        nextPaymentYear += 1;
      }
    }
  }

  /*
   * Pro-rata should always be
   * shorter than a full rental month.
   */
  days =
    Math.max(
      0,
      Math.min(
        days,
        29
      )
    );

  const amount =
    Math.round(
      dailyRent *
        days *
        100
    ) / 100;

  const nextPaymentDate =
    `${nextPaymentYear}-${String(
      nextPaymentMonth
    ).padStart(
      2,
      "0"
    )}-${String(
      paymentDay
    ).padStart(
      2,
      "0"
    )}`;

  return {
    amount,
    days,
    dailyRent:
      Math.round(
        dailyRent * 100
      ) / 100,
    nextPaymentDate,
  };
}