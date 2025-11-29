import { apiInstanceAuth } from "../utils/axios";

export const getOverviewServices = async () =>
  apiInstanceAuth.get("/overview").then((res) => res.data);
