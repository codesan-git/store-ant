import axios from "axios";
import { useRouter } from "next/router";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getSession, useSession } from "next-auth/react";

interface Token {
  token: string
}

export default function Validation({token} : Token) {
  const router = useRouter();
  const { token: accessToken } = router.query;
  const { data: session } = useSession();

  const verifyAccount = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/profile/verified"
      );
      console.log("dari fetchProduct", response.data);
    } catch (error) {
      console.log(error);
    }
  };

  console.log('session user', session?.user.accessToken)
  console.log('accesstoken', accessToken)
  console.log('token doang', token)
  console.log('user', session?.user)


  return (
    <>
      {accessToken === token /*session?.user.accessToken!*/ ? (
        <>
          <div className="card lg:w-96 bg-base-100 shadow-xl mx-auto lg:my-36">
            <figure className="px-10 pt-10">
              <img
                src="https://s3-us-west-2.amazonaws.com/shipsy-public-assets/shipsy/SHIPSY_LOGO_BIRD_BLUE.png"
                alt="Shoes"
                className="rounded-xl"
              />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">Verify Your Account Here!</h2>
              <p>Lets dance together, dance on the dancefloor</p>
              <div className="card-actions">
                <button
                  className="btn btn-primary w-full rounded-md"
                  onClick={verifyAccount}
                >
                  Verify Account
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <p>404</p>
        </>
      )}
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
