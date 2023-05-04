import axios from "axios";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";

export default function Validation({ token }: any) {
  const router = useRouter();
  const { token: accessToken } = router.query;
  const { data: session } = useSession(); 

  const verifyAccount = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/profile/verified");
      console.log("dari fetchProduct", response.data);
    } catch (error) {
      //console.log(error);
    }
  };

  return (
    <>
    {accessToken == session?.user.accessToken! ? (
      <>
        <button
          className="btn btn-outline btn-primary w-full btn-md rounded-lg"
          onClick={verifyAccount}
        >
          Verify Account
        </button>
      </> 
    )
    :
    (
      <>
      <p>404</p>
      </>
    )
  }
  </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const id = context.query.id;

  console.log("dataValidation", session);
  //   const user = await prisma.user.findUnique({
  //     where: {
  //       id: session?.user?.id,
  //     },
  //   });

  const token = session?.user.accessToken!;

  return { props: { token } };
};
