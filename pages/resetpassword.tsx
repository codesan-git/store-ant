import axios from "axios";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { useState } from "react";

interface FormData {
  password?: string;
}

export default function Validation({ token }: any) {
  const [form, setForm] = useState<FormData>({
    password: "",
  });
  const router = useRouter();
  const { token: accessToken } = router.query;
  const { data: session } = useSession();

  const resetPassword = async () => {
    // console.log('form password', form.password)
    try {
      const response = await axios
        .put(`http://localhost:3000/api/profile/resetpassword`, form)
        .then(() => {
          router.push("/");
        });
      console.log("dari fetchProduct", response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {accessToken == session?.user.accessToken! ? (
        <>
          <label htmlFor="">
            <span className="label-text">Password</span>
          </label>
          <input
            type="text"
            name="password"
            placeholder="Password"
            value={form?.password}
            className="input input-bordered input-primary w-auto rounded-md"
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
          />
          <button
            className="btn btn-outline btn-primary w-full btn-md rounded-lg"
            onClick={resetPassword}
          >
            Reset Password
          </button>
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
