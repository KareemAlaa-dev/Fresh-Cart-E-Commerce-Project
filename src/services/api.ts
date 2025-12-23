"use server"

import { getToken } from '@/helpers/getUserToken';
// import { authHeaders } from '@/helpers/authHeaders';
import { AuthResponse, CodeRes, ForgetPasswordResponse, NewPassword } from '@/types';
import { AddToCartResponse, ClearCartResponse, GetCartResponse, UpdateCartItemResponse } from '@/types';
import { CheckoutOrderRes, UserOrderResponse } from '@/types';
import { WishListResponse } from '@/types';
import { CheckoutFormValues } from '@/schemas/checkout';
import { CodeFormValues, EmailFormValues, PasswordFormValues } from '@/schemas/forgetPassword';
import { RegisterFormValues } from '@/schemas/register';
import { AddToWishListResponse, BrandResponse, CategoryResponse, ProductResponse, RemoveFromWishListResponse, SingleBrandResponse, SingleCategoryResponse, SingleProductResponse, SingleSubcategoryResponse, SubcategoryResponse } from "@/types";


// -------------------BASE URL------------------------------
const BASE_URL = process.env.NEXT_BASE_URL

// Validate BASE_URL at startup
if (!BASE_URL) {
	console.warn("⚠️ NEXT_BASE_URL is not defined. Please create a .env.local file with NEXT_BASE_URL=https://ecommerce.routemisr.com/api/");
}

/** 🛠️ Helper to safely parse JSON or return the raw text on failure */
async function safeJson<T>(res: Response): Promise<T> {
	const text = await res.text();
	try {
		return JSON.parse(text) as T;
	} catch (_error) {
		// If it's not JSON, it's likely an HTML error page from the server
		const isHtml = text.trim().startsWith("<!DOCTYPE") || text.trim().startsWith("<html");
		const cleanText = isHtml ? `HTML Error page (Status: ${res.status})` : text.slice(0, 100);
		throw new Error(cleanText || `Failed to parse response from server (Status: ${res.status})`);
	}
}

// -----------------------------headers and token-----------------------------------------------------

/** ✅ Returns headers with current user token */
export async function getHeaders(): Promise<HeadersInit> {
	const token = await getToken();
	return {
		"Content-Type": "application/json",
		token: token ?? "",
	};
}

// -----------------------------------------Products-----------------------------------------------------
// get All Products
export async function getAllProducts(page: number = 1): Promise<ProductResponse> {
	if (!BASE_URL) {
		throw new Error("NEXT_BASE_URL environment variable is not configured. Please check your .env.local file.");
	}
	
	try {
		const res = await fetch(`${BASE_URL}v1/products?page=${page}`, {
			cache: "no-store"
		});
		
		if (!res.ok) {
			throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
		}
		
		return await safeJson<ProductResponse>(res);
	} catch (error) {
		throw new Error(`Failed to fetch products: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
}


// get single product Details
export async function getSingleProduct(id: string | string[]): Promise<SingleProductResponse> {
	if (!BASE_URL) {
		throw new Error("NEXT_BASE_URL environment variable is not configured.");
	}
	
	try {
		const res = await fetch(`${BASE_URL}v1/products/${id}`);
		if (!res.ok) {
			throw new Error(`Failed to fetch product: ${res.status}`);
		}
		return await safeJson<SingleProductResponse>(res);
	} catch (error) {
		throw new Error(`Failed to fetch product: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
}



// ---------------------------------------Brands------------------------------------------------------------

// get all brands
export async function getAllBrands(): Promise<BrandResponse> {
	if (!BASE_URL) {
		throw new Error("NEXT_BASE_URL environment variable is not configured.");
	}
	
	try {
		const res = await fetch(`${BASE_URL}v1/brands`, {
			cache: "force-cache",
		});
		if (!res.ok) {
			throw new Error(`Failed to fetch brands: ${res.status}`);
		}
		return await safeJson<BrandResponse>(res);
	} catch (error) {
		throw new Error(`Failed to fetch brands: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
}

// get all products of the single Brand
export async function getSingleBrandAllProducts(id: string | string[]): Promise<ProductResponse> {
	const res = await fetch(`${BASE_URL}v1/products?brand=${id}`, {
		cache: "force-cache",
	});
	return await safeJson<ProductResponse>(res);
}

// get Single barnd
export async function getSingleBrand(id: string | string[]): Promise<SingleBrandResponse> {
	const res = await fetch(`${BASE_URL}v1/brands/${id}`, {
		cache: "force-cache",
	});
	return await safeJson<SingleBrandResponse>(res);
}

// --------------------------------Categories--------------------------------------------------------------
// get all categories
export async function getAllCategories(): Promise<CategoryResponse> {
	if (!BASE_URL) {
		throw new Error("NEXT_BASE_URL environment variable is not configured.");
	}
	
	try {
		const res = await fetch(`${BASE_URL}v1/categories`, {
			cache: "force-cache",
		});
		if (!res.ok) {
			throw new Error(`Failed to fetch categories: ${res.status}`);
		}
		return await safeJson<CategoryResponse>(res);
	} catch (error) {
		throw new Error(`Failed to fetch categories: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
}

// get single category 
export async function getSingleCategory(id: string): Promise<SingleCategoryResponse> {
	const res = await fetch(`${BASE_URL}v1/categories/${id}`, {
		cache: "force-cache",
	});
	return await safeJson<SingleCategoryResponse>(res);
}
// get all products with specific category
export async function getSingleCategoryAllProducts(id: string): Promise<ProductResponse> {
	const headers = await getHeaders();
	const res = await fetch(`${BASE_URL}v1/products?category[in]=${id}`, {
		headers, cache: "force-cache"
	});
	return await safeJson<ProductResponse>(res);
}

// ------------------------------------Subcategories---------------------------------------------------
// get all subcategories
export async function getAllSubcategories(): Promise<SubcategoryResponse> {
	const res = await fetch(`${BASE_URL}v1/subcategories`, {
		cache: "force-cache",
	});
	return await safeJson<SubcategoryResponse>(res);
}

// get spesific subcategory
export async function getSingleSubcategory(id: string): Promise<SingleSubcategoryResponse> {
	const res = await fetch(`${BASE_URL}v1/subcategories/${id}`, {
		cache: "force-cache"
	});
	return await safeJson<SingleSubcategoryResponse>(res);
}

// get all products with specific subcategory
export async function getSingleSubCategoryAllProducts(id: string): Promise<ProductResponse> {
	const headers = await getHeaders();
	const res = await fetch(`${BASE_URL}v1/products?category[in]=${encodeURIComponent(id)}`, {
		cache: "force-cache",
		headers
	})
	const data = await safeJson<ProductResponse>(res)
	return data
}




// ---------------------------------------Cart-------------------------------------------
// add products to cart
export async function addToCart(productId: string | string[]): Promise<AddToCartResponse> {
	if (!BASE_URL) {
		throw new Error("NEXT_BASE_URL environment variable is not configured.");
	}
	
	const headers = await getHeaders();
	try {
		const res = await fetch(`${BASE_URL}v1/cart`, {
			method: 'POST',
			body: JSON.stringify({ productId }),
			headers,

		});

		if (!res.ok) {
			throw new Error(`Request failed with status ${res.status}`);
		}

		return await safeJson<AddToCartResponse>(res);
	} catch (_error) {
		return { status: "error", message: "Something went wrong. Please try again." } as AddToCartResponse;
	}
}


// get user cart
export async function getUserCart(): Promise<GetCartResponse> {
	const headers = await getHeaders();


	try {
		const res = await fetch(`${BASE_URL}v1/cart`, {
			headers,
		})
		if (!res.ok) {
			throw new Error(`Request failed with status ${res.status}`);
		}
		return await safeJson<GetCartResponse>(res);
	} catch (_error) {
		return { status: "error", message: "Something went wrong. Please try again." } as GetCartResponse
	}
}

// delete specific cart item
export async function deleteCartItem(productId: string): Promise<UpdateCartItemResponse> {
	const headers = await getHeaders();
	const res = await fetch(`${BASE_URL}v1/cart/${productId}`, {
		method: 'delete',
		headers
	});
	return await safeJson<UpdateCartItemResponse>(res);
}

// update cart product quantity

export async function updateCartProductQuantity(productId: string, count: number): Promise<UpdateCartItemResponse> {
	const headers = await getHeaders();
	const res = await fetch(`${BASE_URL}v1/cart/${productId}`, {

		method: `put`,
		body: JSON.stringify({ count }),
		headers
	});
	return await safeJson<UpdateCartItemResponse>(res);
}
// clear cart
export async function clearCart(): Promise<ClearCartResponse> {
	const headers = await getHeaders();
	const res = await fetch(`${BASE_URL}v1/cart`, {
		method: `delete`,
		headers
	});
	return await safeJson<ClearCartResponse>(res);
}

// -------------------------------------------Wishlist--------------------------------------------------------------

// add to wishlist
export async function addToWishlist(productId: string): Promise<AddToWishListResponse> {
	try {
		// Get headers (includes authentication info)
		const headers = await getHeaders();

		// Send POST request to add product to wishlist
		const res = await fetch(`${BASE_URL}v1/wishlist`, {
			method: "POST",
			headers,
			body: JSON.stringify({ productId }),
		});

		// Check if response is not successful (e.g. 400, 401, 500)
		if (!res.ok) {
			const errorMessage = `Failed to add product. Status: ${res.status}`;
			throw new Error(errorMessage);
		}

		// Parse JSON response
		const data = await safeJson<AddToWishListResponse>(res);
		return data;

	} catch (_error) {
		// Handle network or fetch-related errors
		return { status: "error", message: "Something went wrong. Please try again." } as AddToWishListResponse
	}
}



// remove from wishlist
export async function removeFromWishlist(productId: string): Promise<RemoveFromWishListResponse> {
	try {
		const headers = await getHeaders();
		const res = await fetch(`${BASE_URL}v1/wishlist/${productId}`, {
			method: "DELETE",
			headers,
		});

		if (!res.ok) {
			const data = await safeJson<any>(res);
			throw new Error(data?.message || "Failed to remove product from wishlist");
		}
		
		const data = await safeJson<RemoveFromWishListResponse>(res);
		return data;
	} catch (error) {
		console.error("removeFromWishlist API error:", error);
		return { status: "error", message: error instanceof Error ? error.message : "Something went wrong" } as RemoveFromWishListResponse;
	}
}

// get wishlist

export async function getWishlist(): Promise<WishListResponse> {
	const headers = await getHeaders();
	const res = await fetch(`${BASE_URL}v1/wishlist`, {
		headers
	})
	const data = await safeJson<WishListResponse>(res);
	return data;
}

// -------------------------------------Sign Up-----------------------------------------------
export async function SignUp(values: RegisterFormValues): Promise<AuthResponse> {
	if (!BASE_URL) {
		throw new Error("NEXT_BASE_URL environment variable is not configured.");
	}
	
	try {
		const res = await fetch(`${BASE_URL}v1/auth/signup`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(values),
		});

		const data = await safeJson<AuthResponse>(res);
		return data;
	} catch (error) {
		throw new Error(`Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
}
// -------------------------------------Login-----------------------------------------------
export async function LoginNextAuth(email: string, password: string): Promise<AuthResponse> {
	if (!BASE_URL) {
		throw new Error("NEXT_BASE_URL environment variable is not configured.");
	}
	
	try {
		const res = await fetch(`${BASE_URL}v1/auth/signin`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				email,
				password
			}),
		});

		const data = await safeJson<AuthResponse>(res);
		return data;
	} catch (error) {
		throw new Error(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
}


// --------------------------------------ForgotPassword--------------------------------------------------------------
export async function forgetPassword(values: EmailFormValues): Promise<ForgetPasswordResponse> {
	if (!BASE_URL) {
		throw new Error("NEXT_BASE_URL environment variable is not configured.");
	}
	
	try {
		const res = await fetch(`${BASE_URL}v1/auth/forgotPasswords`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(values),
		});

		const data = await safeJson<ForgetPasswordResponse>(res);
		if (!res.ok) {
			throw new Error(data?.message || data?.statusMsg || `Failed to send reset code: ${res.status}`);
		}
		return data;
	} catch (error) {
		throw new Error(`Failed to send reset code: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
}

export async function verifyCode(values: CodeFormValues): Promise<CodeRes> {
	if (!BASE_URL) {
		throw new Error("NEXT_BASE_URL environment variable is not configured.");
	}
	
	try {
		const res = await fetch(`${BASE_URL}v1/auth/verifyResetCode`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(values),
		});

		const data = await safeJson<CodeRes>(res);
		if (!res.ok) {
			throw new Error(data?.message || data?.status || `Failed to verify code: ${res.status}`);
		}
		return data;
	} catch (error) {
		throw new Error(`Failed to verify code: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
}

export async function resetPassword(values: PasswordFormValues): Promise<NewPassword> {
	if (!BASE_URL) {
		throw new Error("NEXT_BASE_URL environment variable is not configured.");
	}
	
	try {
		const res = await fetch(`${BASE_URL}v1/auth/resetPassword`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(values),
		});

		const data = await safeJson<NewPassword>(res);
		if (!res.ok) {
			throw new Error(`Failed to reset password: ${res.status}`);
		}
		return data;
	} catch (error) {
		throw new Error(`Failed to reset password: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
}

// ----------------------------------------Get user orders -------------------------------------
export async function getUserOrders(userID: string | null): Promise<UserOrderResponse[]> {
	const res = await fetch(`${BASE_URL}v1/orders/user/${userID}`);
	const ordersRes = await safeJson<UserOrderResponse[]>(res);
	return ordersRes;
}


// ----------------------------------------Order Checkout---------------------------------------------
export async function checkoutOrder(cartID: string, values: CheckoutFormValues): Promise<CheckoutOrderRes> {
	const headers = await getHeaders();
	const res = await fetch(`${BASE_URL}v1/orders/checkout-session/${cartID}?url=${process.env.NEXTAUTH_URL}`, {
		method: "POST",
		body: JSON.stringify(values),
		headers
	})
	const checkoutRes = await safeJson<CheckoutOrderRes>(res);
	return checkoutRes;
}

// ----------------------------------------Ping (Warmup)---------------------------------------------
export async function ping() {
	return "pong";
}