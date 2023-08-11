export type deviceOptions = "xs" | "sm" | "md" | "lg";
export type shadowOptions = "small" | "regular" | "large" | "badge" | "border" | "none";
export type colorOptions = "primary" | "secondary" | "warn" | "error" | "inherit" | "dark";

type NavItem = { icon: string; title: string; href: string };

export type NavWithChild = {
  href: string;
  title: string;
  child?: Omit<NavItem, "icon">[];
};

export type Meta = {
  page: number;
  total: number;
  pageSize: number;
  totalPage: number;
};

export type PageMeta = {
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  pageNumber: number;
  first: boolean;
  numberOfElements: number;
  empty: boolean;

}


export type ApiResponse<T> = {
  data: T[];
  meta: PageMeta;
}

export interface Option {
  label: string;
  value: number|string;
}