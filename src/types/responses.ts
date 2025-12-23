import { UpdateWishListResponse } from './wishlist';
import { Subcategory } from './category';

import { ApiResponse, Brand, Category, Product } from './index';
import { UserOrderResponse } from './order';


export type ProductResponse = ApiResponse<Product>
export type CategoryResponse = ApiResponse<Category>
export type BrandResponse = ApiResponse<Brand>
export type SubcategoryResponse = ApiResponse<Subcategory>
export type AddToWishListResponse = UpdateWishListResponse;
export type RemoveFromWishListResponse = UpdateWishListResponse;

export type UserOrdersResponse = UserOrderResponse[]


// get specific [product , category , brand]
export type SingleProductResponse = {
	data: Product;
}
export type SingleCategoryResponse = {
	data: Category;
}
export type SingleBrandResponse = {
	data: Brand;
}
export type SingleSubcategoryResponse = {
	data: Subcategory;
}