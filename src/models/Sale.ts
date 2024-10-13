import { Product } from "./Product"

export interface Sale {
    created_at: string;
    products: Product[]
}