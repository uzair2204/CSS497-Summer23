interface Service {
  id: string;
  icon: string;
  title: string;
  description?: string;
  active:boolean;
  displayOrder?:number;
}

export default Service;
