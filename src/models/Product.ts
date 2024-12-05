export interface Product {
    id: string
    name: string
    price?: number
    priority?: number
    quantity?: number
    // totalAmount?: number
    // color?: string
    // textColor?: string
    colors_id?: number,
    colors?: {
        primary: string;
        secondary: string;
        tertiary: string;
    }
}