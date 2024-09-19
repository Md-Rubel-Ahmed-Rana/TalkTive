type Link = {
  name: string;
  url: string;
};

export type IUser = {
  name: string;
  email: string;
  password: string;
  image: string;
  title: string;
  about: string;
  links: Link[];
  status: string;
  lastActive: Date;
};

export type IGetUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  image: string;
  title: string;
  about: string;
  links: Link[];
  status: string;
  lastActive: Date;
  createdAt: Date;
  updatedAt: Date;
};

export const GetUserProperties = {
  id: 1,
  name: 1,
  email: 1,
  image: 1,
  title: 1,
  about: 1,
  links: 1,
  status: 1,
  lastActive: 1,
  createdAt: 1,
  updatedAt: 1,
};

export type ILogin = {
  email: string;
  password: string;
};
