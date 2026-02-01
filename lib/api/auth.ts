import { NextResponse } from "next/server";

/**
 * Verify admin authentication for API routes.
 * Compatible with Cloudflare Workers Edge runtime.
 * Supports Authorization header (Bearer token) or session cookie.
 */
export async function verifyAdmin(
	request: Request,
): Promise<NextResponse | null> {
	const adminEmail = process.env.ADMIN_EMAIL;
	const adminPassword = process.env.ADMIN_PASSWORD;

	// If no credentials configured, deny access
	if (!adminEmail || !adminPassword) {
		return NextResponse.json(
			{ error: "Unauthorized: Admin credentials not configured" },
			{ status: 401 },
		);
	}

	// Check Authorization header
	const authHeader = request.headers.get("Authorization");
	if (authHeader) {
		// Support Bearer token format: "Basic base64(email:password)" or direct password
		if (authHeader.startsWith("Basic ")) {
			try {
				const base64Credentials = authHeader.slice(6);
				const decoded = Buffer.from(base64Credentials, "base64").toString(
					"utf-8",
				);
				const [email, password] = decoded.split(":");

				if (email === adminEmail && password === adminPassword) {
					return null; // Authorized
				}
			} catch {
				// Invalid base64, fall through to cookie check
			}
		} else if (authHeader === adminPassword) {
			// Direct password comparison (Bearer password)
			return null; // Authorized
		}
	}

	// Check session cookie
	const cookieHeader = request.headers.get("Cookie");
	if (cookieHeader) {
		const cookies = Object.fromEntries(
			cookieHeader.split("; ").map((c) => {
				const [key, ...val] = c.split("=");
				return [key, val.join("=")];
			}),
		);

		const sessionToken = cookies.admin_session;
		if (sessionToken === adminPassword) {
			return null; // Authorized
		}
	}

	// Not authorized
	return NextResponse.json(
		{ error: "Unauthorized: Invalid credentials" },
		{ status: 401 },
	);
}

/**
 * Wrap a route handler with admin authentication.
 * GET methods remain public, other methods require auth.
 */
export function withAdminAuth(
	handler: (request: Request) => Promise<NextResponse>,
	requireAuthFor: "all" | "write" = "write",
) {
	return async function authenticatedHandler(
		request: Request,
	): Promise<NextResponse> {
		const method = request.method;

		// Public routes: GET requests are always allowed
		if (requireAuthFor === "write" && method === "GET") {
			return handler(request);
		}

		// Check authentication for protected routes
		const authResult = await verifyAdmin(request);
		if (authResult) {
			return authResult;
		}

		// Authorized, proceed with handler
		return handler(request);
	};
}
