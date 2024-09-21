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
  image: string;
  title: string;
  about: string;
  links: Link[];
  status: string;
  lastActive: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type ILogin = {
  email: string;
  password: string;
};
