"use client";

import { useForm } from "react-hook-form";

type Inputs = {
  userName: string;
};

export default function UserProfileUpdateForm({
  userName,
}: {
  userName: string;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      userName: userName,
    },
  });
  const onSubmit = (data: Inputs) => {
    console.log(data);
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 p-4 bg-"
    >
      <input {...register("userName", { required: true })} />
      {errors.userName && <span>Username is required</span>}
      <button type="submit">Submit</button>
    </form>
  );
}
