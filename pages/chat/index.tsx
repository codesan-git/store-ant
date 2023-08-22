import { GetServerSideProps } from "next";
import Navbar from "../navbar";
import Chat from "@/components/transactions/chat";
import { getSession } from "next-auth/react";
import { prisma } from "../../lib/prisma";

interface Props {
  newChatUserId?: string,
}

const chat = ({ newChatUserId }: Props) => {
  return (
    <>
      <Navbar/>
      <div className="py-4 space-y-2 lg:space-y-0 lg:space-x-2">
        <Chat newChatUserId={newChatUserId} />
      </div> 
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  const newChatUserId = context.query.newChatUserId ?? null;

  const trans = await prisma.transaction.findMany({
    where: {
      userId: session?.user.id
    }
  })

  return {
    props: {
      newChatUserId: newChatUserId,
    },
  };
}

export default chat;