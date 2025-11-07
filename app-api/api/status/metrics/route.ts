import { NextResponse } from "next/server";
import { getMetricsSummary } from "../../../../shared/utils/metrics";

export async function GET() {
  try {
    const summary = getMetricsSummary();
    return NextResponse.json(summary);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching metrics" },
      { status: 500 }
    );
  }
}

