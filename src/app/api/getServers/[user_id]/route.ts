import { NextRequest, NextResponse } from "next/server";

type MockUserServerData = {
  [key: string]: {
    id: string;
    name: string;
  }[];
};

const clerkUserId = process.env.SAMPLE_CLERK_USER_ID;

if (clerkUserId === undefined) {
  throw new Error("process.env.SAMPLE_CLERK_USER_ID is not defined");
}

const mockUserServerData: MockUserServerData = {
  // envのClerkのユーザーIDに対応するサーバー情報を返す
  [clerkUserId]: [
    {
      id: "server_2bgXJjH89drnXFXMq5oPogGAGBC",
      name: "server_2bgXJjH89drnXFXMq5oPogGAGBC",
    },
    {
      id: "serverfapniofha",
      name: "serverfapniofha",
    },
  ],
  userId1: [
    {
      id: "serverId1",
      name: "server1",
    },
    {
      id: "serverId2",
      name: "server2",
    },
    {
      id: "serverId3",
      name: "server3",
    },
  ],
  userId2: [
    {
      id: "serverId4",
      name: "server4",
    },
    {
      id: "serverId5",
      name: "server5",
    },
    {
      id: "serverId6",
      name: "server6",
    },
  ],
};

//https://zenn.dev/kawaxumax/articles/9c4cea2d731dae
export async function GET(
  req: NextRequest,
  { params }: { params: { user_id: string } }
) {
  const id = params.user_id;

  if (!id) {
    return new NextResponse("user_id is required", {
      status: 400,
    });
  }

  const userServerInfo = mockUserServerData[id];
  if (userServerInfo === undefined) {
    console.error("user_id is not found:" + id);
    return new NextResponse("user_id is not found", {
      status: 404,
    });
  }
  return new NextResponse(JSON.stringify(userServerInfo), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
