import { CartItem } from "./cartItem";
import { nanoid } from "nanoid";

export type CartType = {
  id: string;
  items: CartItem[];
}

export class ShoppingCart implements CartType {
  id = nanoid();
  items: CartItem[] = [];
}