import React, { useEffect } from "react";
import Head from "next/head";
import Layout from "@/layout/layout";
import Link from "next/link";
import styles from "../styles/Form.module.css";
import Image from "next/image";
import { HiAtSymbol, HiKey } from "react-icons/hi";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import axios from "axios";
import Swal from "sweetalert2";
import { AiFillCloseCircle } from "react-icons/ai";

interface FormData {
  email: string;
  password: string;
}

interface Data {
  email: string;
}

export default function Login() {
  const [show, setShow] = useState<boolean>();
  const [form, setForm] = useState<FormData>({ email: "", password: "" });
  const [formForgot, setFormForgot] = useState<Data>({ email: "" });
  const router = useRouter();

  async function handleGoogleSignIn() {
    signIn("google", { callbackUrl: `${window.location.origin}` });
  }

  async function loginUser(data: FormData) {
    //console.log("login");
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
      callbackUrl: `${window.location.origin}`,
    });

    res?.error ? //console.log("ERROR ", res?.error) : router.push("/");
  }
  const forgotPassword = async (data: FormData) => {
    // //console.log('form password', form.password)
    try {
      const response = await axios
        .put(`/api/profile/resetpassword`, form)
        .then(() => {
          router.push("/");
        });
      //console.log("dari fetchProduct", response);
    } catch (error) {
      //console.log(error);
    }
  };

  // const getEmail = async() => {
  //   const res = await axios.get(`/api/auth/forgotpassword`)
  //   //console.log('getEmail', res)
  // }

  const handleForgotPassword = (e: any) => {
    e.preventDefault();
    //console.log("Sending");

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, send it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch("/api/resetpassword", {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formForgot),
        }).then((res) => {
          //console.log("Response received");
          if (res.status === 200) {
            //console.log("Response succeeded!");
            // setSubmitted(true);
          }
        });
        Swal.fire(
          "Please Check Your Email!",
          "Your file has been sent.",
          "success"
        );
      }
    });
  };

  return (
    <Layout>
      <Head>
        <title>Login</title>
      </Head>
      {/* Test Modal */}
      <input type="checkbox" id="my-modal-6" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle lg:top-0">
        <div className="modal-box">
          <label htmlFor="my-modal-6" className="fixed right-2 top-2">
            <AiFillCloseCircle 
              className="w-8 h-8"
            />
          </label>
          <div className="py-4">
            <p className="mr-auto font-black text-2xl py-2">
              Atur Ulang Kata Sandi
            </p>
            <p className="text-justify py-2">
              Masukkan e-mail yang terdaftar. Kami akan mengirimkan kode
              verifikasi untuk atur ulang kata sandi.
            </p>
          </div>
          <div className="w-full relative group mx-auto">
            <input
              required
              id="inputforgot"
              type="text"
              name="email"
              value={formForgot?.email}
              className="input input-bordered input-primary w-full rounded-md h-10 px-4 text-sm peer bg-gray-100 outline-none"
              onChange={(e) =>
                setFormForgot({
                  ...formForgot,
                  email: e.target.value,
                })
              }
            />
            <label
              htmlFor="inputforgot"
              className="label transform transition-all absolute top-0 left-0 h-full flex items-center pl-2 text-sm group-focus-within:text-xs peer-valid:text-xs group-focus-within:h-1/2 peer-valid:h-1/2 group-focus-within:-translate-y-full peer-valid:-translate-y-full group-focus-within:pl-0 peer-valid:pl-0"
            >
              Email
            </label>
          </div>
          <div className="modal-action">
            <label
              className="btn btn-primary w-full mx-auto btn-sm rounded-lg"
              htmlFor="my-modal-6"
              onClick={(e) => handleForgotPassword(e)}
            >
              Send Email
            </label>
          </div>
        </div>
      </div>
      {/* End Test Modal */}
      <section className="w-3/4 mx-auto flex flex-col gap-10">
        <div className="title">
          <h1 className="text-gray-800 text-4xl font-bold py-4">Store.ant</h1>
          <p className="w-3/4 mx-auto text-gray-400">
            lorem ipsum dolor sit amet{" "}
          </p>
          <label htmlFor="my-modal-6">forgot password</label>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            loginUser(form);
          }}
          className="flex flex-col gap-5"
        >
          <div className={styles.input_group}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={styles.input_text}
              value={form?.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <span className="icon flex items-center px-4">
              <HiAtSymbol size={25} />
            </span>
          </div>
          <div className={styles.input_group}>
            <input
              type={`${show ? "text" : "password"}`}
              name="password"
              placeholder="Password"
              className={styles.input_text}
              value={form?.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <span
              className="icon flex items-center px-4"
              onClick={() => setShow(!show)}
            >
              <HiKey size={25} />
            </span>
          </div>

          <div className={styles.input_group}>
            <button type="submit" className={styles.button}>
              Login
            </button>
          </div>
          <div className={styles.input_group}>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className={styles.button_custom}
            >
              Sign In with Google{" "}
              <Image
                alt=""
                src={"/assets/google.svg"}
                width="20"
                height={20}
              ></Image>
            </button>
          </div>
        </form>
        <p className="text-center text-gray-400">
          dont have an account yet?{" "}
          <Link className="text-blue-700" href={"/register"}>
            Sign Up
          </Link>
        </p>
      </section>
    </Layout>
  );
}