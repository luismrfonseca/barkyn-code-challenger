export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  sortOrder: number;
  icon: string;
  price: string;
  availableSlots: number;
}

export type CourseStatus = "" | "inscrito" | "completo" | "bloqueado";

export interface CourseWithStatus extends Course {
  status: CourseStatus;
}
