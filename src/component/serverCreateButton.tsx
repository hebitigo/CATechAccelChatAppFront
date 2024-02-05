"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons/faCirclePlus";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Input,
  Link,
  user,
} from "@nextui-org/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { UserServerInfo } from "./sidenav";
import { Dispatch, SetStateAction } from "react";

type Props = {
  userId: string;
  setUserServerInfo: Dispatch<SetStateAction<UserServerInfo[] | null>>;
};

type FormValues = {
  serverName: string;
};

export default function ServerAddButton({ userId, setUserServerInfo }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data) => {
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
      .then((response) => {
        if (response.ok) {
          console.log("Server registered successfully:");
          response.json().then((userServerInfo: UserServerInfo) => {
            setUserServerInfo((prev) =>
              prev ? [...prev, userServerInfo] : [userServerInfo]
            );
          });
        } else {
          response.json().then((message) => {
            throw new Error(message);
          });
        }
      })
      .catch((error) => {
        console.error("Failed to register server", error);
      });
    onClose();
  };

  return (
    <>
      <button onClick={onOpen}>
        <FontAwesomeIcon
          icon={faCirclePlus}
          className="h-[48px]"
          color="gray"
        />
      </button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        classNames={{
          base: "bg-[#19172c] text-[#a8b0d3]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                サーバーを作成
              </ModalHeader>
              <form onSubmit={handleSubmit(onSubmit)}>
                <ModalBody>
                  <Input
                    {...register("serverName", { required: true })}
                    autoFocus={true}
                    label="サーバー名"
                    placeholder="作成するサーバー名を入力してください"
                    type="text"
                    variant="bordered"
                  />
                  {errors.serverName && <span>This field is required</span>}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    閉じる
                  </Button>
                  <Button type="submit" color="primary" variant="flat">
                    作成
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
