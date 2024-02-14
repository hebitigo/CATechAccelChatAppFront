import { Button, Badge, Avatar } from "@nextui-org/react";
import { SignOutButton } from "@/components/SignOutButton";
import { auth, currentUser } from "@clerk/nextjs";

export default async function Home({
  searchParams,
}: {
  searchParams: { from?: string };
}) {
  const user = await currentUser();
  const { from } = searchParams;
  if (user) {
    const { id, username, imageUrl } = user;
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/user/upsert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: id,
        name: username,
        active: true,
        icon_image_url: imageUrl,
      }),
    })
      .then(async (response) => {
        const message = await response.json();
        if (response.ok) {
        } else {
          throw new Error(message);
        }
      })
      .catch((error) => {
        console.error("Failed to register user", error);
      });
  }

  return (
    <div>
      <h1 className="">
        ああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ
      </h1>
    </div>
  );
}
