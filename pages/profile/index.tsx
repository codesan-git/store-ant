import React from "react";
import styles from "../../styles/Form.module.css";
import Image from "next/image";
import { useState } from "react";
import { HiAtSymbol, HiKey, HiUser } from "react-icons/hi";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { prisma } from "../../lib/prisma";
import Navbar from "../navbar";
import Footer from "../footer";
import axios from "axios"
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import {
  Square3Stack3DIcon,
  UserCircleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";

interface FormData {
  username?: string;
  phonenumber?: string;
  password?: string;
}

interface Props {
  profile: {
    id: Number;
    username: string;
    phoneNumber: string;
  };

  address: {
    id: Number;
    address: string;
    region: string;
    city: string;
    province: string;
    postcode: string;
  }[];
}

export default function Profile({ profile, address }: Props) {
  const [form, setForm] = useState<FormData>({
    username: profile?.username,
    phonenumber: profile?.phoneNumber,
    password: "",
  });
  const [show, setShow] = useState<boolean>();
  const router = useRouter();
  const { data: session } = useSession();
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File>();

  // const [photo, setPhoto] = useState<ChangePhoto>({
  //   photo: session?.user?.image!
  // })
  console.log(address);

  const notifAlert = () => {
    <div className="alert shadow-lg">
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-info flex-shrink-0 w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <div>
          <h3 className="font-bold">New message!</h3>
          <div className="text-xs">You have 1 unread message</div>
        </div>
      </div>
      <div className="flex-none">
        <button className="btn btn-sm">See</button>
      </div>
    </div>;
  };

  async function create(data: FormData) {
    try {
      fetch("http://localhost:3000/api/profile/setting", {
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      }).then(() => {
        setForm({
          username: data.username,
          password: "",
          phonenumber: data.phonenumber,
        });
        router.push(router.asPath);
      });
    } catch (error) {
      console.log(error);
    }
  }

  const changePhoto = async () => {
    try {
        if(!selectedFile) return;
        const formData = new FormData();
        formData.append("image", selectedFile);
        await axios.post('http://localhost:3000/api/profile/photo', formData).then(()=> router.reload())
    } catch (error: any) {
        console.log(error);
    }
  }

  const handleSubmit = async (data: FormData) => {
    try {
      create(data);
    } catch (error) {
      console.log(error);
    }
  };

  const data = [
    {
      label: "Data Diri",
      value: "datadiri",
      icon: UserCircleIcon,
      desc: `It really matters and then like it really doesn't matter.
        What matters is the people who are sparked by it. And the people 
        who are like offended by it, it doesn't matter.`,
      code: (
        <>
          <section className="mt-8 flex flex-row gap-10 bg-gray-100 p-10 rounded-md">
            <div className="columns">
              <div className="card card-compact w-96 bg-base-100 shadow-xl">
                <figure className="p-4">
                <label>
                      <input 
                        type='file' 
                        hidden 
                        onChange={({target}) => {
                            if(target.files){
                                const file = target.files[0];
                                setSelectedImage(URL.createObjectURL(file));
                                setSelectedFile(file);
                            }
                        }}
                      />
                      <div className='aspect-video rounded flex items-center justify-center border-2 border-dashed cursor-pointer'>
                          {selectedImage? (
                            <img
                              src={selectedImage}
                              alt="img-profile"
                              className="rounded-md w-96 h-96 object-cover"
                            />
                          ) : (
                            <img
                            src={session?.user?.image!}
                            alt="img-profile"
                            className="rounded-md w-96 h-96 object-cover"
                          />
                          )}
                      </div>
                  </label>
                </figure>
                <div className="card-body">
                  <div className="card-actions justify-end">
                    <p className="text-center">Ketuk gambar untuk mengubah foto</p>                    
                    <button onClick={changePhoto} className="btn btn-primary btn-outline rounded-md w-full">
                      Simpan Foto
                    </button>
                  </div>
                  <p>
                    Besar file: maksimum 10.000.000 bytes (10 Megabytes).
                    Ekstensi file yang diperbolehkan: .JPG .JPEG .PNG
                  </p>
                </div>
              </div>
              <div className="card card-compact w-96 bg-base-100 shadow-xl mt-5">
                <div className="card-actions justify-end">
                  <button className="btn btn-primary btn-outline rounded-md w-full">
                    Ubah Kata Sandi
                  </button>
                </div>
              </div>
            </div>

            <div className="w-full">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(form);
                }}
                className="flex flex-col gap-6"
              >
                {/* Handle Username */}
                <div className="title">
                  <p className="mx-auto text-gray-900 font-bold text-md">
                    Ubah biodata diri
                  </p>
                </div>
                <div className="flex gap-5">
                  <label className="my-auto mr-4">Username</label>
                  <h5>{profile?.username}</h5>
                  {/* The button to open modal */}
                  <a href="#my-modal-2" className="text-primary">
                    ubah
                  </a>
                  <div className="modal z-50" id="my-modal-2">
                    <div className="modal-box">
                      <a href="#">
                        <label
                          htmlFor="my-modal-2"
                          className="btn btn-sm btn-circle btn-outline btn-primary absolute right-2 top-2"
                        >
                          ✕
                        </label>
                      </a>
                      <h3 className="font-bold text-lg">Ubah Username</h3>
                      <p className="py-4">
                        Kamu hanya dapat mengubah nama 1 kali lagi. Pastikan
                        nama sudah benar.
                      </p>
                      <div className="form-control w-full">
                        <label htmlFor="">
                          <span className="label-text">Username</span>
                        </label>
                        <input
                          type="text"
                          name="username"
                          placeholder="Username"
                          value={form?.username}
                          className="input input-bordered input-primary w-auto rounded-md"
                          onChange={(e) =>
                            setForm({
                              ...form,
                              username: e.target.value,
                            })
                          }
                        />
                        <label className="label">
                          <span className="label-text-alt">
                            Username bisa dilihat oleh pengguna lainnya
                          </span>
                        </label>
                      </div>
                      {profile?.username == form.username ? (
                        <>
                          <div className="modal-action">
                            <a
                              href="#"
                              className="btn btn-primary btn-disabled w-full rounded-md"
                            >
                              save!
                            </a>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="modal-action">
                            <button
                              className="btn btn-primary w-full rounded-md"
                              onClick={() => handleSubmit(form)}
                            >
                              save!
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  {/* End The button to open modal */}
                </div>
                {/* End Handle Username */}

                {/* Handle Tanggal Lahir */}
                <div className="flex gap-5">
                  <label className="my-auto mr-4">Tanggal Lahir</label>
                  <h5>30 Desember 1995</h5>
                  {/* The button to open modal */}
                  <a href="#modal-tanggal-lahir" className="text-primary">
                    ubah
                  </a>
                </div>
                {/* End Handle Tanggal Lahir */}

                {/* Handle Gender */}
                <div className="flex gap-5">
                  <label className="my-auto mr-4">Jenis Kelamin</label>
                  <h5>Pria</h5>
                </div>
                {/* End Handle Gender */}

                {/* Handle Ubah Kontak */}
                <div className="title">
                  <p className="mx-auto text-gray-900 text-md font-bold">
                    Ubah Kontak
                  </p>
                </div>
                {/* Handle Nomor HP */}
                <div className="flex gap-5">
                  <label className="mr-4">Nomor HP</label>
                  <h5>{profile?.phoneNumber}</h5>
                  {/* The button to open modal */}
                  <a href="#modal-nomorhp" className="text-primary">
                    ubah
                  </a>
                  {/* <p>{/<em> Put this part before </body> tag </em>/}</p> */}
                  <div className="modal" id="modal-nomorhp">
                    <div className="modal-box">
                      <a href="#">
                        <label
                          htmlFor="modal-nomorhp"
                          className="btn btn-sm btn-circle btn-outline btn-primary absolute right-2 top-2"
                        >
                          ✕
                        </label>
                      </a>
                      <h3 className="font-bold text-lg">Ubah Nomor HP</h3>
                      <p className="py-4">
                        Konfirmasi perubahan Nomor HP akan dikirimkan ke E-mail{" "}
                        {session?.user?.email}
                      </p>
                      <div className="form-control w-full"></div>
                      <div className="modal-action">
                        <a
                          href="#"
                          className="btn btn-primary w-full rounded-md"
                        >
                          Send!
                        </a>
                      </div>
                    </div>
                  </div>
                  {/* End The button to open modal */}
                </div>
                {/* End Handle Nomor HP */}

                {/* Handle Email */}
                <div className="flex gap-5">
                  <label className="mr-4">Email</label>
                  <h5>{session?.user?.email}</h5>
                  {/* The button to open modal */}
                  <a href="#modal-email" className="text-primary">
                    ubah
                  </a>
                  {/* <p>{/<em> Put this part before </body> tag </em>/}</p> */}
                  <div className="modal" id="modal-email">
                    <div className="modal-box">
                      <a href="#">
                        <label
                          htmlFor="modal-email"
                          className="btn btn-sm btn-circle btn-outline btn-primary absolute right-2 top-2"
                        >
                          ✕
                        </label>
                      </a>
                      <h3 className="font-bold text-lg">Ubah Nomor HP</h3>
                      <p className="py-4">
                        Konfirmasi perubahan E-mail akan dikirimkan ke E-mail{" "}
                        {session?.user?.email}
                      </p>
                      <div className="form-control w-full"></div>
                      <div className="modal-action">
                        <a
                          href="#"
                          className="btn btn-primary w-full rounded-md"
                        >
                          Send!
                        </a>
                      </div>
                    </div>
                  </div>
                  {/* End The button to open modal */}
                </div>
                {/* End Handle Email */}

                {/* End Handle Ubah Kontak */}
              </form>
            </div>
          </section>
        </>
      ),
    },
    {
      label: "Address",
      value: "address",
      icon: Square3Stack3DIcon,
      desc: `Because it's about motivating the doers. Because I'm here
        to follow my dreams and inspire other people to follow their dreams, too.`,
      code: (
        <>
          <section className="mt-8 flex flex-col gap-5 bg-gray-100 p-10 rounded-md">
            <div className="flex">
              <div className="title w-full self-center">
                <input
                  type="text"
                  placeholder="Cari alamat atau nama penerima"
                  className="title input input-bordered input-primary input-group-md w-full max-w-xs rounded-md"
                />
              </div>
              <button
                className="btn btn-primary btn-outline btn-md rounded-md"
                onClick={() => router.push("/address")}
              >
                + Tambah Alamat Baru
              </button>
            </div>
            {address ? (
              <div>
                {address.map((address) => (
                  <div
                    className="card w-full bg-base-100 shadow-xl text-md leading-loose"
                    key={String(address.id)}
                  >
                    <div className="py-5 px-10 flex w-full">
                      <div className="w-5/6">
                        <h2 className="card-title">{address.address}</h2>
                        <p>
                          {address.region}, {address.city}, {address.province}
                        </p>
                        <p>{address.postcode}</p>
                        <div className="flex gap-3">
                          <a className="text-primary-focus">Ubah Alamat</a>
                          <p className="text-primary">|</p>
                          <a className="text-primary-focus">
                            Jadikan Alamat Utama
                          </a>
                          <p className="text-primary">|</p>
                          <a className="text-primary-focus">Hapus</a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>address not added yet</p>
            )}
          </section>
        </>
      ),
    },
    {
      label: "Settings",
      value: "settings",
      icon: Cog6ToothIcon,
      desc: `We're not always in the position that we want to be at.
        We're constantly growing. We're constantly making mistakes. We're
        constantly trying to express ourselves and actualize our dreams.`,
    },
  ];

  console.log("user", session?.user);
  return (
    <>
      <Navbar />
      <div className="flex my-5 w-3/4 mx-auto">
        <div className="text-center justify-center mt-8 border shadow-md w-72 h-1/2 rounded-lg">
          <div className="grid grid-cols-2 shadow p-2 pr-10">
            <div className="avatar mx-auto">
              <div className="w-16 rounded-full">
                <img src={session?.user?.image!} />
              </div>
            </div>
            <div className="text-left">
              <h5>{profile?.username}</h5>
            </div>
          </div>
          <hr />
          {/* <div className="details font-bold text-lg">
            <h5>{session?.user?.name}</h5>
            <h5>{session?.user?.email}</h5>
          </div> */}
          <div className="drawer-side">
            <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
            <ul className="menu p-4 w-full bg-base-100 text-base-content">
              <li>
                <a className="text-center">Profile</a>
              </li>
              <li>
                <a className="text-center">Orders</a>
              </li>
              <li>
                <a className="text-center">Vouchers</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="w-full mx-10">
          <span className="flex gap-2">
            <HiUser className="my-auto w-5 h-5" />
            <h5>{session?.user?.name}</h5>
          </span>
          <Tabs value="datadiri">
            <TabsHeader>
              {data.map(({ label, value, icon }) => (
                <Tab key={value} value={value}>
                  <div className="flex items-center gap-2">
                    {React.createElement(icon, { className: "w-5 h-5" })}
                    {label}
                  </div>
                </Tab>
              ))}
            </TabsHeader>
            <TabsBody>
              {data.map(({ value, code }) => (
                <TabPanel  key={value} value={value}>
                  {code}
                </TabPanel>
              ))}
            </TabsBody>
          </Tabs>

          {/* <section className="mt-8 flex flex-col gap-10 bg-gray-100 p-10 rounded-md">
            <div className="flex">
              <div className="title w-full">
                <h1 className="text-gray-800 text-4xl font-bold">Address</h1>
                <p className="mx-auto text-gray-400">Address list</p>
              </div>
              <button
                className={styles.button_square}
                onClick={() => router.push("/address")}
              >
                +
              </button>
            </div>
            {address ? (
              <div>
                {address.map((address) => (
                  <div
                    className="card w-full bg-base-100 shadow-xl text-sm"
                    key={String(address.id)}
                  >
                    <div className="py-5 px-10 flex w-full">
                      <div className="w-5/6">
                        <h2 className="card-title">{address.address}</h2>
                        <p>
                          {address.region}, {address.city}, {address.province}
                        </p>
                        <p>{address.postcode}</p>
                      </div>
                      <div className="card-actions justify-end flex w-fit my-auto ml-5">
                        <button className="btn btn-primary bg-gradient-to-r from-blue-500 to-indigo-500">
                          Edit
                        </button>
                        <button className="btn btn-primary bg-red-500">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>address not added yet</p>
            )}
          </section> */}
        </div>
      </div>
      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = await prisma.user.findUnique({
    where: { email: String(context.query.email) },
    select: {
      id: true,
    },
  });
  const profile = await prisma.profile.findUnique({
    where: { userId: user?.id },
    select: {
      id: true,
      username: true,
      phoneNumber: true,
    },
  });
  let address = null;
  if (profile) {
    address = await prisma.address.findMany({
      where: { profileId: profile?.id },
      select: {
        id: true,
        address: true,
        region: true,
        city: true,
        province: true,
        postcode: true,
      },
    });
  }
  return { props: { profile, address } };
};
