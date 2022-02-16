/* eslint-disable @typescript-eslint/no-extra-semi */
/* eslint-disable semi */
export default interface User {
  id: number;
  email: string;
  login: string;
  username: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  fa: string;
  status: string;
};
