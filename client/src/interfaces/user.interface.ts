export type IUser = {
  id: string;
  name: string;
  image: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
};

export const userInitData: IUser = {
  id: "",
  name: "",
  email: "",
  image: "",
  createdAt: "",
  updatedAt: "",
};
