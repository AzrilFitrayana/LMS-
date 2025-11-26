import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLoaderData, useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { mutateStudentToCourseSchema } from "../../../utils/zodSchema";
import { useMutation } from "@tanstack/react-query";
import { addStudentToCourse } from "../../../services/courseServices";

const StudentCreateForm = () => {
  const { id } = useParams();
  const students = useLoaderData();
  const navigate = useNavigate();

  //filter student not in course
  const studentOption = students?.filter(
    (student) => !student?.course?.includes(id)
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(mutateStudentToCourseSchema),
  });

  const { isLoading, mutateAsync } = useMutation({
    mutationFn: (data) => addStudentToCourse(data, id),
  });

  const handleOnSubmit = async (values) => {
    try {
      await mutateAsync(values);

      navigate(`/manager/courses/students/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <header className="flex items-center justify-between gap-[30px]">
        <div>
          <h1 className="font-extrabold text-[28px] leading-[42px]">
            Add Student
          </h1>
          <p className="text-[#838C9D] mt-[1]">Create new future for company</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="#"
            className="w-fit rounded-full border border-[#060A23] p-[14px_20px] font-semibold text-nowrap"
          >
            Import from BWA
          </Link>
        </div>
      </header>
      <form
        onSubmit={handleSubmit(handleOnSubmit)}
        className="flex flex-col w-[550px] rounded-[30px] p-[30px] gap-[30px] bg-[#F8FAFB]"
      >
        <div className="flex flex-col gap-[10px]">
          <label htmlFor="studentId" className="font-semibold">
            Select Student
          </label>
          <div className="flex items-center w-full rounded-full border border-[#CFDBEF] gap-3 px-5 transition-all duration-300 focus-within:ring-2 focus-within:ring-[#662FFF]">
            <img
              src="/assets/images/icons/bill-black.svg"
              className="w-6 h-6"
              alt="icon"
            />
            <select
              {...register("studentId")}
              id="studentId"
              className="appearance-none outline-none w-full py-3 px-2 -mx-2 font-semibold placeholder:font-normal placeholder:text-[#838C9D] !bg-transparent"
            >
              <option value="" hidden="">
                Choose one student
              </option>

              {studentOption?.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
            <img
              src="/assets/images/icons/arrow-down.svg"
              className="w-6 h-6"
              alt="icon"
            />
          </div>
        </div>
        <span className="error-message text-[#FF435A]">
          {errors?.studentId?.message}
        </span>

        <div className="flex items-center gap-[14px]">
          <button
            type="button"
            className="w-full rounded-full border border-[#060A23] p-[14px_20px] font-semibold text-nowrap"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            disable={isLoading}
            className="w-full rounded-full p-[14px_20px] font-semibold text-[#FFFFFF] bg-[#662FFF] text-nowrap"
          >
            Create Now
          </button>
        </div>
      </form>
    </>
  );
};

export default StudentCreateForm;
