import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { useForm, SubmitHandler } from "react-hook-form";
import { Dispatch, SetStateAction, useState } from "react";
import { ChannelInfo } from "@/app/(authenticated)/chat/[server_name]/[server_id]/[channel_id]/page";

type Props = {
  serverId: string;
  setChannelInfo: Dispatch<SetStateAction<ChannelInfo[] | null>>;
};

type FormValues = {
  channelName: string;
};

export default function ChannelCreateButton({
  serverId,
  setChannelInfo,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
    fetch("http://localhost:8080/channel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        server_id: serverId,
        name: data.channelName,
      }),
    })
      .then(async (response) => {
        if (response.ok) {
          console.log("channel registered successfully");
          const channelInfo: ChannelInfo = await response.json();
          setChannelInfo((prev) =>
            prev ? [...prev, channelInfo] : [channelInfo]
          );
        } else {
          const message = await response.text();
          throw new Error(message);
        }
      })
      .catch((error) => {
        console.error("Failed to register channel", error);
      });
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
              作成
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
