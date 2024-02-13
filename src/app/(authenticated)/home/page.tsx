import { Button, Badge, Avatar } from "@nextui-org/react";
import { SignOutButton } from "@/components/SignOutButton";
import { auth, currentUser } from "@clerk/nextjs";

export default async function Home({
  searchParams,
}: {
  searchParams: { from?: string };
}) {
  const user = await currentUser();
  // console.log("user: ", user);
  const { from } = searchParams;
  console.log("from: ", from);
  if (user) {
    const { id, username, imageUrl } = user;
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}:8080/user/upsert`, {
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
          console.log("User registered successfully: ", message);
        } else {
          throw new Error(message);
        }
      })
      .catch((error) => {
        console.error("Failed to register user", error);
      });
  }

  //ユーザーの登録
  //clerkからuseridをもらう
  ///registerUserにvalidatationの形式でJSONをPOSTで渡す

  //チャンネルでユーザー同士の会話中、相手のアイコンを表示するためにclerkに保存してAPIで呼び出すのではなく
  //S3にユーザー作成時の遷移画面でアイコンをアップロードしてもらいユーザー作成時にS3から返されたurlを登録する
  //or
  // /homeでのユーザーアイコン
  //保存でS3からリンクを返してもらいそれをもとにUserを更新する

  return (
    <div>
      <h1 className="">
        ああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ
      </h1>
    </div>
  );
}
