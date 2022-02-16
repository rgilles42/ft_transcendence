/* eslint-disable @typescript-eslint/no-extra-semi */
/* eslint-disable semi */
export default interface Channel {
  id: number;
  ownerId: number,
  type: boolean,
  password: string | null,
  createdAt: Date;
  updatedAt: Date;
};
