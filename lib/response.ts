// lib/response.ts
import { NextResponse } from 'next/server';

export function successResponse(data: any, message = 'Success', status = 200) {
  return NextResponse.json({ data, message }, { status });
}

export function errorResponse(
  message = 'Error',
  status = 500,
  data: any = null
) {
  return NextResponse.json({ data, message }, { status });
}
