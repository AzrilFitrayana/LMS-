import { apiInstanceAuth } from "../utils/axios";

export const getCourse = async () =>
  apiInstanceAuth.get("/courses").then((res) => res.data);
