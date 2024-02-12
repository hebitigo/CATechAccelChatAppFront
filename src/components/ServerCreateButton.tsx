"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons/faCirclePlus";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useForm, SubmitHandler } from "react-hook-form";
import { UserServerInfo } from "./Sidenav";
import { Dispatch, SetStateAction } from "react";
import { useState } from "react";

type Props = {
  userId: string;
  setUserServerInfo: Dispatch<SetStateAction<UserServerInfo[] | null>>;
};

type CreateServerFormValues = {
  serverName: string;
};

type InvitedServerFormValues = {
  token: string;
};

export default function ServerAddButton({ userId, setUserServerInfo }: Props) {
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCreateServerOpen, setIsCreateServerOpen] = useState(false);
  const [isJoinServerOpen, setIsJoinServerOpen] = useState(false);
  const {
    register: registerCreateServer,
    handleSubmit: handleSubmitCreateServer,
    formState: { errors: errorsCreateServer },
  } = useForm<CreateServerFormValues>();
  const {
    register: registerInvitedServer,
    handleSubmit: handleSubmitInvitedServer,
    formState: { errors: errorsInvitedServer },
  } = useForm<InvitedServerFormValues>();

  const createServerHandle: SubmitHandler<CreateServerFormValues> = (data) => {
    console.log(data);
    fetch("http://localhost:8080/server", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        name: data.serverName,
      }),
    })
      .then(async (response) => {
        if (response.ok) {
          console.log("Server registered successfully:");
          const userServerInfo: UserServerInfo = await response.json();
          setUserServerInfo((prev) =>
            prev ? [...prev, userServerInfo] : [userServerInfo]
          );
        } else {
          const message = await response.text();
          throw new Error(message);
        }
      })
      .catch((error) => {
        console.error("Failed to register server", error);
      });
    setIsCreateServerOpen(false);
    setIsDropdownOpen(false);
  };
  const joinServerViaInvitationHandle: SubmitHandler<
    InvitedServerFormValues
  > = (data) => {
    fetch("http://localhost:8080/server/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        token: data.token,
      }),
    })
      .then(async (response) => {
        if (response.ok) {
          console.log("join server successfully");
          const userServerInfo: UserServerInfo = await response.json();
          setUserServerInfo((prev) =>
            prev ? [...prev, userServerInfo] : [userServerInfo]
          );
        } else {
          const message = await response.text();
          throw new Error(message);
        }
      })
      .catch((error) => {
        console.error("Failed to join server", error);
      });
    setIsCreateServerOpen(false);
    setIsDropdownOpen(false);
  };

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <button>
            <FontAwesomeIcon
              icon={faCirclePlus}
              className="h-[48px]"
              color="gray"
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-black border-none flex flex-col gap-3">
          <DropdownMenuItem asChild>
            <>
              <Dialog
                open={isCreateServerOpen}
                onOpenChange={setIsCreateServerOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    className=" w-full bg-gray-800 border-white text-white "
                    size="sm"
                  >
                    Create Server
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-none">
                  <form onSubmit={handleSubmitCreateServer(createServerHandle)}>
                    <DialogHeader>
                      <DialogTitle className="text-slate-300">
                        サーバーを作成
                      </DialogTitle>
                    </DialogHeader>

                    <div className="flex items-center gap-4 py-4">
                      <Label htmlFor="name" className="text-slate-300">
                        Name
                      </Label>
                      <Input
                        id="name"
                        className="col-span-3 bg-slate-800 border-none text-slate-300"
                        placeholder="作成するサーバー名を入力してください"
                        {...registerCreateServer("serverName", {
                          required: true,
                        })}
                      />
                    </div>

                    {errorsCreateServer.serverName && (
                      <span>server name is requred</span>
                    )}

                    <DialogFooter>
                      <Button type="submit" className="text-slate-300 border">
                        作成
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <>
              <Dialog
                open={isJoinServerOpen}
                onOpenChange={setIsJoinServerOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    className=" w-full bg-gray-800 border-white text-white "
                    size="sm"
                  >
                    Join Server via Invite
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-none">
                  <form
                    onSubmit={handleSubmitInvitedServer(
                      joinServerViaInvitationHandle
                    )}
                  >
                    <DialogHeader>
                      <DialogTitle className="text-slate-300">
                        招待トークンを入力
                      </DialogTitle>
                    </DialogHeader>

                    <div className="flex items-center gap-4 py-4">
                      <Label htmlFor="name" className="text-slate-300">
                        Token
                      </Label>
                      <Input
                        id="name"
                        className="col-span-3 bg-slate-800 border-none text-slate-300"
                        placeholder="サーバーの招待トークンを入力してください"
                        {...registerInvitedServer("token", {
                          required: true,
                        })}
                      />
                    </div>

                    {errorsInvitedServer.token && (
                      <span>invite token is required</span>
                    )}

                    <DialogFooter>
                      <Button type="submit" className="text-slate-300 border">
                        参加
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
