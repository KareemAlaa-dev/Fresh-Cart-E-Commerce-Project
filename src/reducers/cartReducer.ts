import { GetCartResponse } from "@/types"
// managing cart count ,


// initial state value
type State = {
	cart: GetCartResponse
	isLoading: boolean
}

// cart type actions
type CartActions =
	| { type: "SET_CART", payload: GetCartResponse }
	| { type: "START_LOADING" }
	| { type: "STOP_LOADING" }

// reducer function
export function cartReducer(state: State, action: CartActions): State {
	switch (action.type) {
		case "SET_CART":
			return {
				...state,
				cart: action.payload
			}

		case "START_LOADING":
			return {
				...state,
				isLoading: true
			}

		case "STOP_LOADING":
			return {
				...state,
				isLoading: false
			}
		default:
			return { ...state }
	}
}

