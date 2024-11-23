import { Product } from "./Product"

export interface Sale {
    id: string;
    created_at: string;
    products: Product[]
}