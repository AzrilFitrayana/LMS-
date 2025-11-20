import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { mutateContentSchema } from "../../../utils/zodSchema";
import { useNavigate, useParams } from "react-router-dom";
import { createContent, updateContent } from "../../../services/courseServices";
import { useLoaderData } from "react-router-dom";

const ManageContentCreatePage = () => {
  const { id, contentId } = useParams();
  const navigate = useNavigate();
  const load = useLoaderData();
  // console.log(id);
  // console.log(contentId);

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(mutateContentSchema),
    defaultValues: {
      title: load?.title,
      type: load?.type,
      text: load?.text,
      youtubeId: load?.youtubeId,
    },
  });
  const type = watch("type");

  const mutateAsyncCreate = useMutation({
    mutationFn: (data) => createContent(data),
  });

  const mutateAsyncUpdate = useMutation({
    mutationFn: (data) => updateContent(data, contentId),
  });

  const onSubmit = async (values) => {
    // console.log(values);

    try {
      if (load === undefined) {
        await mutateAsyncCreate.mutateAsync({
          ...values,
          courseId: id,
        });
      } else {
        await mutateAsyncUpdate.mutateAsync({
          ...values,
          courseId: id,
        });
      }

      navigate(`/manager/courses/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div
        id="Breadcrumb"
        className="flex items-center gap-5 *:after:content-['/'] *:after:ml-5"
      >
        <span className="last-of-type:after:content-[''] last-of-type:font-semibold">
          Manage Course
        </span>
        <span className="last-of-type:after:content-[''] last-of-type:font-semibold">
          Course
        </span>
        <span className="last-of-type:after:content-[''] last-of-type:font-semibold">
          {load === null ? "Add" : "Update"} Content
        </span>
      </div>
      <header className="flex items-center justify-between gap-[30px]">
        <div className="flex items-center gap-[30px]">
          <div className="flex shrink-0 w-[150px] h-[100px] rounded-[20px] overflow-hidden bg-[#D9D9D9]">
            <img
              src="/assets/images/thumbnails/th-1.png"
              className="w-full h-full object-cover"
              alt="thumbnail"
            />
          </div>
          <div>
            <h1 className="font-extrabold text-[28px] leading-[42px]">
              {load === null ? "Add" : "Update"} Content
            </h1>
            <p className="text-[#838C9D] mt-[1]">
              Give a best content for the course
            </p>
          </div>
        </div>
      </header>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-[930px] rounded-[30px] p-[30px] gap-[30px] bg-[#F8FAFB]"
      >
        <div className="flex flex-col gap-[10px]">
          <label htmlFor="title" className="font-semibold">
            Content Title
          </label>
          <div className="flex items-center w-full rounded-full border border-[#CFDBEF] gap-3 px-5 transition-all duration-300 focus-within:ring-2 focus-within:ring-[#662FFF]">
            <img
              src="/assets/images/icons/note-favorite-black.svg"
              className="w-6 h-6"
              alt="icon"
            />
            <input
              {...register("title")}
              type="text"
              name="title"
              id="title"
              className="appearance-none outline-none w-full py-3 font-semibold placeholder:font-normal placeholder:text-[#838C9D] !bg-transparent"
              placeholder="Write better name for your course"
            />
          </div>
          <span className="error-message text-[#FF435A]">
            <span className="error-message text-[#FF435A]">
              {errors?.title?.message}
            </span>
          </span>
        </div>
        <div className="flex flex-col gap-[10px]">
          <label htmlFor="type" className="font-semibold">
            Select Type
          </label>
          <div className="flex items-center w-full rounded-full border border-[#CFDBEF] gap-3 px-5 transition-all duration-300 focus-within:ring-2 focus-within:ring-[#662FFF]">
            <img
              src="/assets/images/icons/crown-black.svg"
              className="w-6 h-6"
              alt="icon"
            />
            <select
              {...register("type")}
              name="type"
              id="type"
              className="appearance-none outline-none w-full py-3 px-2 -mx-2 font-semibold placeholder:font-normal placeholder:text-[#838C9D] !bg-transparent"
            >
              <option value="" hidden="">
                Choose content type
              </option>
              <option value="video">Video</option>
              <option value="text">Text</option>
            </select>
            <img
              src="/assets/images/icons/arrow-down.svg"
              className="w-6 h-6"
              alt="icon"
            />
          </div>
        </div>
        <span className="error-message text-[#FF435A]">
          <span className="error-message text-[#FF435A]">
            {errors?.type?.message}
          </span>
        </span>

        {type === "video" && (
          <>
            <div className="flex flex-col gap-[10px]">
              <label htmlFor="video" className="font-semibold">
                Youtube Video ID
              </label>
              <div className="flex items-center w-full rounded-full border border-[#CFDBEF] gap-3 px-5 transition-all duration-300 focus-within:ring-2 focus-within:ring-[#662FFF]">
                <img
                  src="/assets/images/icons/bill-black.svg"
                  className="w-6 h-6"
                  alt="icon"
                />
                <input
                  {...register("youtubeId")}
                  type="text"
                  id="video"
                  className="appearance-none outline-none w-full py-3 font-semibold placeholder:font-normal placeholder:text-[#838C9D] !bg-transparent"
                  placeholder="Write tagline for better copy"
                />
              </div>
            </div>
            <span className="error-message text-[#FF435A]">
              <span className="error-message text-[#FF435A]">
                {errors?.youtubeId?.message}
              </span>
            </span>
          </>
        )}

        {type === "text" && (
          <>
            <div className="flex flex-col gap-[10px]">
              <label className="font-semibold">Content Text</label>
              <textarea
                {...register("text")}
                onChange={(_, editor) => {
                  const data = editor.getData();
                  setValue("text", data);
                }}
                className=" border border-[#CFDBEF] w-full rounded-lg appearance-none outline-none py-3 font-semibold placeholder:font-normal placeholder:text-[#838C9D] !bg-transparent p-6"
                placeholder="Write your content text here"
              ></textarea>
            </div>
            <span className="error-message text-[#FF435A]">
              <span className="error-message text-[#FF435A]">
                {errors?.text?.message}
              </span>
            </span>
          </>
        )}

        <div className="flex items-center gap-[14px]">
          <button
            type="button"
            className="w-full rounded-full border border-[#060A23] p-[14px_20px] font-semibold text-nowrap"
          >
            Save as Draft
          </button>
          <button
            disabled={
              load === undefined
                ? mutateAsyncCreate.isLoading
                : mutateAsyncUpdate.isLoading
            }
            type="submit"
            className="w-full rounded-full p-[14px_20px] font-semibold text-[#FFFFFF] bg-[#662FFF] text-nowrap"
          >
            {load === undefined ? "Add Content Now" : "Update Content Now"}
          </button>
        </div>
      </form>
    </>
  );
};

export default ManageContentCreatePage;
