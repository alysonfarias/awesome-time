import { NextRequest, NextResponse } from 'next/server';
import { formatRelativeTime } from '../../../src/core';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date');
  const locale = searchParams.get('locale') || 'en';
  const timezone = searchParams.get('timezone');
  const disableTooltip = searchParams.get('disableTooltip') === 'true';

  if (!date) {
    return NextResponse.json(
      { error: 'Date parameter is required' },
      { status: 400 }
    );
  }

  try {
    const result = formatRelativeTime({
      date,
      locale,
      timezone: timezone || undefined,
      disableTooltip
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid date format' },
      { status: 400 }
    );
  }
} 