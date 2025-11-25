import { apiInstanceAuth } from "../utils/axios";

export const getStudent = async () =>
  apiInstanceAuth.get("/students").then((res) => res.data);
