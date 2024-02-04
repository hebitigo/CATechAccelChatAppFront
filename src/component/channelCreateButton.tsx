"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";

type FormValues = {
  channelName: string;
};

export default function ChannelCreateButton() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
    setOpen(false);
  };
  //https://github.com/shadcn-ui/ui/issues/88#issuecomment-1577482090
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className=" w-full bg-gray-800 border-white text-white flex gap-1 justify-center"
          size="sm"
          variant="outline"
        >
          <FontAwesomeIcon icon={faPlus} className="p-2 h-4" />
          Add Channel
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-none">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="text-slate-300">
              チャンネルを作成
            </DialogTitle>
          </DialogHeader>

          <div className="flex items-center gap-4 py-4">
            <Label htmlFor="name" className="text-slate-300">
              Name
            </Label>
            <Input
              id="name"
              className="col-span-3 bg-slate-800 border-none text-slate-300"
              placeholder="作成するチャンネル名を入力してください"
              {...register("channelName", { required: true })}
            />
          </div>

          {errors.channelName && <span>channel name is requred</span>}

          <DialogFooter>
            <Button type="submit" className="text-slate-300 border">
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
