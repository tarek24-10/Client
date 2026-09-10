import { CartItem } from "./cartItem";
import { nanoid } from "nanoid";

export type CartType = {
  id: string;
  items: CartItem[];
  deliveryMethodId?:number;
  paymentIntentId?:string;
  clientSecret?:string;
}

export class ShoppingCart implements CartType {
  id = nanoid();
  items: CartItem[] = [];
  deliveryMethodId?:number;
  paymentIntentId?:string;
  clientSecret?:string;
}