import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Shop, ShopU, newShop } from "../models/shops";

interface ShopsState {
	shops: { [s: string]: Shop };
	orphaned: ShopU[];
}

const initialState: ShopsState = {
	shops: {},
	orphaned: [],
};

const shopsSlice = createSlice({
	name: "shops",
	initialState,
	reducers: {
		init(state, action: PayloadAction<[Shop[], ShopU[]]>) {
			const [shops, orphaned] = action.payload;
			for (let shop of shops) {
				state.shops[shop.mobId] = shop;
			}
			state.orphaned = orphaned;
		},
		addedShop(state, action: PayloadAction<string>) {
			state.shops[action.payload] = newShop(action.payload);
		},
		updatedShop(state, action: PayloadAction<Shop>) {
			const shop = action.payload;
			state.shops[shop.mobId] = shop;
		},
		removedShop(state, action: PayloadAction<string>) {
			delete state.shops[action.payload];
		},
	},
});

export const { init, addedShop, updatedShop, removedShop } = shopsSlice.actions;
export default shopsSlice.reducer;
