import User from "./user.model";

interface Address {
  zipCode: any;
  name: any;
  id: string;
  user: User;
  city: string;
  title: string;
  phone: string;
  street: string;
  country: string;
  address:string;
}

export default Address;
