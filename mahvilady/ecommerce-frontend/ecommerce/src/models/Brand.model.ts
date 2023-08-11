interface Brand {
  id: number;
  name: string;
  slug: string;
  type: string;
  image: string;
  featured?: boolean;
  active?:boolean;
}

export default Brand;
