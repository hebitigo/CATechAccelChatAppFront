import { Button, Badge, Avatar } from "@nextui-org/react";
import { SignOutButton } from "@/component/signOutButton";

export default function Home() {
  return (
    <div>
      <h1 className="">
        ああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ
      </h1>
      <Button color="primary">Button</Button>
      <SignOutButton />
      <Badge className="m-4">
        <Avatar src="https://avatars" alt="User" size="lg" />
      </Badge>
    </div>
  );
}
