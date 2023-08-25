import axios from "axios";
import { useRouter } from "next/router";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getSession, useSession } from "next-auth/react";
import Image from "next/image";

export default function Validation() {
  const router = useRouter();
  const { token: accessToken } = router.query;
  const { data: session } = useSession();
  const token = session?.user.accessToken;
  
  const verifyAccount = async () => {
    try {
      await axios.get(
        "/api/profile/verified"
      ).then(() => router.push("/profile"));
    } catch (error) {
      //console.log(error);
    }
  };

  return (
    <>
      {accessToken === token /*session?.user.accessToken!*/ ? (
        <>
          <div className="card lg:w-96 bg-base-100 shadow-xl mx-auto lg:my-36">
            <figure className="px-10 pt-10">
              <Image
                src="https://s3-us-west-2.amazonaws.com/shipsy-public-assets/shipsy/SHIPSY_LOGO_BIRD_BLUE.png"
                alt="Shoes"
                width={1500}
                height={1500}
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
