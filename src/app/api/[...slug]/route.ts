// import { NextRequest, NextResponse } from "next/server";

// // Store created items for retrieval
// let createdItems: any[] = [];

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { slug: string[] } },
// ) {
//   return handleRequest(request, params, "GET");
// }

// export async function POST(
//   request: NextRequest,
//   { params }: { params: { slug: string[] } },
// ) {
//   return handleRequest(request, params, "POST");
// }

// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: { slug: string[] } },
// ) {
//   return handleRequest(request, params, "PATCH");
// }

// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { slug: string[] } },
// ) {
//   return handleRequest(request, params, "DELETE");
// }

// async function handleRequest(
//   request: NextRequest,
//   params: { slug: string[] },
//   method: string,
// ) {
//   console.log(`[MOCK API] ${method} /api/${params.slug.join('/')}`);

//   const path = params.slug.join("/");
//   const body = method !== "GET" ? await request.json() : null;

//   console.log(`[MOCK API] Body:`, body);
//   console.log(`[MOCK API] Processing path: "${path}"`);

//   // DEBUG: Log all POST requests
//   if (method === "POST") {
//     console.log(`[MOCK API] 🔍 POST DEBUG - Path: "${path}"`);
//     console.log(`[MOCK API] 🔍 Contains 'item': ${path.includes('item')}`);
//     console.log(`[MOCK API] 🔍 Ends with '/item': ${path.endsWith('/item')}`);
//     console.log(`[MOCK API] 🔍 Regex match: ${path.match(/items\/.*\/item$/)}`);
//   }

//   if (method === "POST" && path === "auth/register") {
//     console.log("[MOCK API] Handling auth/register");
//     return NextResponse.json(
//       { id: `user_${Date.now()}`, ...body },
//       { status: 201 },
//     );
//   }

//   // IMPORTANT: Move item creation handler BEFORE other item-related handlers

//   if (method === "POST" && path === "auth/login") {
//     console.log("[MOCK API] Handling auth/login - Setting cookie");

//     // 🍪 CRÉER LA RÉPONSE AVEC COOKIE
//     const response = NextResponse.json(
//       { token: "fake-token" },
//       { status: 200 }
//     );

//     // 🔑 DÉFINIR LE COOKIE QUE LE MIDDLEWARE ATTEND
//     response.cookies.set("token", "fake-token", {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       path: "/",
//       maxAge: 60 * 60 * 24 * 7, // 7 jours
//     });

//     return response;
//   }

//   if (method === "POST" && path === "homes") {
//     // 🛡️ VÉRIFIER L'AUTHENTIFICATION POUR LES ROUTES PROTÉGÉES
//     const token = request.cookies.get("token");
//     if (!token) {
//       console.log("[MOCK API] No token found for protected route");
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     console.log("[MOCK API] Token found, allowing home creation");
//     return NextResponse.json(
//       { id: `home_${Date.now()}`, ...body },
//       { status: 201 },
//     );
//   }

//   if (
//     method === "POST" &&
//     path.includes("invites") &&
//     !path.includes("accept")
//   ) {
//     // 🛡️ VÉRIFIER L'AUTHENTIFICATION
//     const token = request.cookies.get("token");
//     if (!token) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     return NextResponse.json({ invite: { code: "FAKE123" } }, { status: 201 });
//   }

//   if (method === "POST" && path === "homes/invites/accept") {
//     return NextResponse.json({ home: { id: "home_123" } }, { status: 200 });
//   }

//   if (method === "GET" && path.includes("items/home/")) {
//     console.log("[MOCK API] Returning home items:", createdItems.map(item => item.name));
//     return NextResponse.json(createdItems, { status: 200 });
//   }

//   if (method === "GET" && path.includes("homes/") && path.includes("permissions")) {
//     return NextResponse.json({ admin: true, member: true }, { status: 200 });
//   }

//   if (method === "GET" && path === "users/me") {
//     const token = request.cookies.get("token");
//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }
//     const userData = {
//       id: "user_123",
//       userId: "user_123",
//       name: "Test User",
//       email: "test@example.com"
//     };
//     console.log("[MOCK API] Returning user data:", JSON.stringify(userData, null, 2));
//     return NextResponse.json(userData, { status: 200 });
//   }

//   if (method === "GET" && path.includes("homes/") && path.includes("rooms")) {
//     const token = request.cookies.get("token");
//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }
//     return NextResponse.json([
//       {
//         id: "room_1",
//         name: "Living Room",
//         homeId: "home_123",
//         createdAt: "2024-01-01T00:00:00Z",
//         updatedAt: "2024-01-01T00:00:00Z",
//         users: [
//           {
//             userId: "user_123",
//             admin: true
//           }
//         ],
//         items: []
//       },
//       {
//         id: "room_2",
//         name: "Kitchen",
//         homeId: "home_123",
//         createdAt: "2024-01-01T00:00:00Z",
//         updatedAt: "2024-01-01T00:00:00Z",
//         users: [
//           {
//             userId: "user_123",
//             admin: true
//           }
//         ],
//         items: []
//       }
//     ], { status: 200 });
//   }

//   if (method === "GET" && path.match(/^rooms\/[^\/]+$/)) {
//     const token = request.cookies.get("token");
//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }
//     return NextResponse.json({
//       id: "room_1",
//       name: "Living Room",
//       homeId: "home_123",
//       createdAt: "2024-01-01T00:00:00Z",
//       updatedAt: "2024-01-01T00:00:00Z",
//       users: [
//         {
//           userId: "user_123",
//           admin: true
//         }
//       ],
//       items: []
//     }, { status: 200 });
//   }

//   if (method === "GET" && path.includes("rooms/") && path.includes("permissions")) {
//     const token = request.cookies.get("token");
//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }
//     return NextResponse.json({ admin: true, member: true }, { status: 200 });
//   }

//   if (method === "GET" && path.includes("rooms/") && path.includes("users")) {
//     const token = request.cookies.get("token");
//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }
//     return NextResponse.json([
//       {
//         userId: "user_123",
//         admin: true,
//         name: "Test User",
//         email: "test@example.com",
//         user: {
//           id: "user_123",
//           name: "Test User",
//           email: "test@example.com"
//         }
//       }
//     ], { status: 200 });
//   }

//   if (method === "GET" && path.includes("homes/") && path.includes("users")) {
//     const token = request.cookies.get("token");
//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }
//     return NextResponse.json([
//       { id: "user_123", name: "Test User", email: "test@example.com", role: "admin" }
//     ], { status: 200 });
//   }

//   if (method === "GET" && path.includes("homes/") && !path.includes("permissions") && !path.includes("invites") && !path.includes("rooms") && !path.includes("users")) {
//     const token = request.cookies.get("token");
//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }
//     const homeData = {
//       id: "home_123",
//       name: "Test Home",
//       address: "Test Address",
//       createdAt: "2024-01-01T00:00:00Z",
//       updatedAt: "2024-01-01T00:00:00Z",
//               rooms: [
//         {
//           id: "room_1",
//           name: "Living Room",
//           homeId: "home_123",
//           createdAt: "2024-01-01T00:00:00Z",
//           updatedAt: "2024-01-01T00:00:00Z",
//           users: [{ userId: "user_123", admin: true, name: "Test User", email: "test@example.com" }],
//           items: []
//         },
//         {
//           id: "room_2",
//           name: "Kitchen",
//           homeId: "home_123",
//           createdAt: "2024-01-01T00:00:00Z",
//           updatedAt: "2024-01-01T00:00:00Z",
//           users: [{ userId: "user_123", admin: true, name: "Test User", email: "test@example.com" }],
//           items: []
//         }
//       ]
//     };
//     console.log("[MOCK API] Returning home data with rooms:", JSON.stringify(homeData, null, 2));
//     return NextResponse.json(homeData, { status: 200 });
//   }

//   if (method === "GET" && path.includes("items/room/")) {
//     console.log("[MOCK API] Returning stored items:", createdItems.map(item => item.name));
//     return NextResponse.json(createdItems, { status: 200 });
//   }

//   if (method === "POST" && path.includes("homes/") && path.includes("rooms")) {
//     const token = request.cookies.get("token");
//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }
//     return NextResponse.json(
//       { id: `room_${Date.now()}`, ...body },
//       { status: 201 },
//     );
//   }

//   if (method === "POST" && path.includes("rooms/") && path.includes("room")) {
//     const token = request.cookies.get("token");
//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }
//     return NextResponse.json(
//       { id: `room_${Date.now()}`, ...body },
//       { status: 201 },
//     );
//   }

//   if (method === "DELETE" && path.includes("homes/") && path.includes("invites/")) {
//     const token = request.cookies.get("token");
//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }
//     return NextResponse.json({ message: "Invite deleted" }, { status: 200 });
//   }

//   if (method === "DELETE" && path.includes("homes/") && path.includes("users/")) {
//     const token = request.cookies.get("token");
//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }
//     return NextResponse.json({ message: "User removed" }, { status: 200 });
//   }

//   if (method === "PATCH" && path === "users/me/name") {
//     const token = request.cookies.get("token");
//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }
//     return NextResponse.json({ message: "Name updated" }, { status: 200 });
//   }

//   if (method === "PATCH" && path === "users/me/email") {
//     const token = request.cookies.get("token");
//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }
//     return NextResponse.json({ message: "Email updated" }, { status: 200 });
//   }

//   if (method === "PATCH" && path === "users/me/password") {
//     const token = request.cookies.get("token");
//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }
//     return NextResponse.json({ message: "Password updated" }, { status: 200 });
//   }

//   if (method === "POST" && path.includes("item")) {
//     const token = request.cookies.get("token");
//     if (!token) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const newItem = {
//       id: `item_${Date.now()}`,
//       ...body,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString()
//     };

//     // Store the created item
//     createdItems.push(newItem);
//     console.log("[MOCK API] ✅ ITEM STORED:", newItem.name);
//     console.log("[MOCK API] ✅ TOTAL ITEMS:", createdItems.length);
//     console.log("[MOCK API] ✅ ALL ITEMS:", createdItems.map(i => i.name));

//     return NextResponse.json(newItem, { status: 201 });
//   }

//   if (method === "POST" && path === "auth/logout") {
//     console.log("[MOCK API] Handling logout - Clearing cookie");

//     // 🍪 CRÉER LA RÉPONSE ET SUPPRIMER LE COOKIE
//     const response = NextResponse.json(
//       { message: "Logged out" },
//       { status: 200 }
//     );

//     // 🔥 SUPPRIMER LE COOKIE
//     response.cookies.set("token", "", {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       path: "/",
//       maxAge: 0, // Expire immédiatement
//     });

//     return response;
//   }

//   if ((method === "PATCH" || method === "DELETE") && path.includes("items/")) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
//   }

//   // Fallback
//   console.log(`[MOCK API] UNHANDLED: ${method} ${path}`);
//   return NextResponse.json({ message: "Mock response" }, { status: 200 });
// }
