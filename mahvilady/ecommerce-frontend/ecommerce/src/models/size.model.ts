import Product from "./product.model";

export interface Size{
    id: number,
    name: string,
    product?: Product[]
}