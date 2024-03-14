import { json } from "@remix-run/cloudflare";

export const unauthorized = <T>(data: T) => json<T>(data, { status: 401 });

export const badRequest = <T>(data: T) => json<T>(data, { status: 400 });
