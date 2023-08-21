import React, { Fragment, useEffect } from "react";
import styles from "../../styles/Form.module.css";
import Image from "next/image";
import { useState } from "react";
import { HiAtSymbol, HiKey, HiUser } from "react-icons/hi";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { getSession, useSession } from "next-auth/react";
import { prisma } from "../../lib/prisma";
import Navbar from "../navbar";
import Footer from "../footer";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Button,
} from "@material-tailwind/react";
import {
  Square3Stack3DIcon,
  UserCircleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";
import {
  BsFillHouseFill
} from "react-icons/bs"
import AddressFormModal from "@/components/profile/address_form_modal";
import { BankAccount, BankType, Gender } from "@prisma/client";
import BankAccountFormModal from "@/components/profile/bank_account_form_modal";
import BankAccountDeletionModal from "@/components/profile/bank_account_deletion_modal";
import DeleteAddressAlert from "@/components/address_delete_modal";
import AddressUpdateFormModal from "@/components/profile/address_update_form_modal";

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { format } from "date-fns";
import { Address, createAddress, deleteAddress, getAllAddress } from "@/services/address/address";
import { getBankAccount } from "@/services/bank/bank";

interface FormData {
  username?: string;
  phonenumber?: string;
  password?: string;
  birthDate?: string;
  gender?: string;
}

interface Props {
  user: {
    id: string
    bankAccount: {
      id: number,
      bankTypeId: number,
      userId: string,
      name: string
      number: string,
      bank: {
        name: string
      }
    }
  }
  profile: {
    id: Number;
    username: string;
    phoneNumber: string;
    birthDate: string;
    gender: string;
  };
  address: Address[];
  provinceData: {
    province_id: string,
    province: string
  }[];
  cityData: {
    city_id: string,
    province_id: string
    city_name: string
  }[];
  banks: BankType[]
}



export default function Profile({ profile, user, address, provinceData, cityData, banks }: Props) {
  const [form, setForm] = useState<FormData>({
    username: profile?.username,
    phonenumber: profile?.phoneNumber,
    birthDate: profile?.birthDate,
    gender: profile?.gender,
    password: "",
  });
  const [show, setShow] = useState<boolean>();
  const router = useRouter();
  const { data: session } = useSession();
  const [selectedImage, setSelectedImage] = useState("");
  const [token, setToken] = useState("")
  const [selectedFile, setSelectedFile] = useState<File>();
  const [submitted, setSubmitted] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  // const [gender, setGender] = useState('');

  const [addresses, setAddresses] = useState<Address[]>(address);
  const [bankAccount, setBankAccount] = useState<BankAccount>(user.bankAccount);

  useEffect(() => {

  }, [addresses]);

  const handleChange = (event: SelectChangeEvent) => {
    setForm({ ...form, gender: event.target.value });
  };

  //console.log(address);

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
      setIsLoading(true);
      fetch("/api/profile/setting", {
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      }).then(() => {
        setIsLoading(false);
        setForm({
          username: data.username,
          password: "",
          phonenumber: data.phonenumber,
          birthDate: data.birthDate,
          gender: data.gender
        });
        router.push(router.asPath);
      });
    } catch (error) {
      ////console.log(error);
    }
  }

  const handleBankAccountDelete = async () => {
    try {
      await fetch("/api/bank/delete", {
        method: "DELETE"
      })

      const data = await getBankAccount();
      setBankAccount(data);
    }
    catch (error) {
      //console.log(error);
    }
  }

  function onSetMainAddress(id: number) {
    const addressId = { id: id };
    try {
      fetch("/api/address/setmain", {
        body: JSON.stringify(addressId),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      }).then(() => {
        router.push(router.asPath);
      });
    } catch (error) {
      ////console.log(error);
    }
  }

  function onSetShopAddress(id: number) {
    const addressId = { id: id };
    try {
      fetch("/api/address/setshop", {
        body: JSON.stringify(addressId),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      }).then(() => {
        router.push(router.asPath);
        alert("address deleted!");
      });
    } catch (error) {
      ////console.log(error);
    }
  }

  const onDeleteAddress = async (id: number) => {
    await deleteAddress(id);
    const updatedAddresses = await getAllAddress();
    setAddresses(updatedAddresses);
  }

  async function changePhoto(file: any) {
    const storage = getStorage();
    const storageRef = ref(storage, `images/profile/${session?.user.email}`);

    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            //console.log('Upload is paused');
            break;
          case 'running':
            //console.log('Upload is running');
            break;
        }
      },
      (error) => {
        //console.log("error, ", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          const data = { image: downloadURL };
          await axios.put("/api/profile/photo", data);
        }).then(() => router.reload());
      }
    );
  };

  const changePhoneNumber = (e: any) => {
    e.preventDefault();
    //console.log("Sending");

    let data = {
      email: session?.user.email!,
      token: session?.user.accessToken!,
    };

    fetch("/api/changephoneNumber", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => {
      //console.log("Response received");
      if (res.status === 200) {
        //console.log("Response succeeded!");
        setSubmitted(true);
      }
    });
  };

  const getToken = async () => {
    const res = (await axios.get(`/api/validation/${session?.user.id}`)).data
    setToken(session?.user.accessToken!)
    //console.log('response token', res)
  }

  const changeVerifyStatus = (e: any) => {
    e.preventDefault();
    //console.log("Sending");

    let data = {
      email: session?.user.email!,
      token: token,
    };

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
        fetch("/api/contact", {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }).then((res) => {
          //console.log("Response received");
          if (res.status === 200) {
            //console.log("Response succeeded!");
            setSubmitted(true);
          }
        });
        Swal.fire("Please Check Your Email!", "Your file has been sent.", "success");
      }
    });
  };

  const resetPassword = (e: any) => {
    e.preventDefault();
    //console.log("Sending");

    let data = {
      email: session?.user.email!,
      token: token,
    };

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
          body: JSON.stringify(data),
        }).then((res) => {
          //console.log("Response received");
          if (res.status === 200) {
            //console.log("Response succeeded!");
            setSubmitted(true);
          }
        });
        Swal.fire("Please Check Your Email!", "Your file has been sent.", "success");
      }
    });
  };

  const changeEmail = (e: any) => {
    e.preventDefault();
    //console.log("Sending");

    let data = {
      email: session?.user.email!,
      token: token,
    };

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
        fetch("/api/changeemail", {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }).then((res) => {
          //console.log("Response received");
          if (res.status === 200) {
            //console.log("Response succeeded!");
            setSubmitted(true);
          }
        });
        Swal.fire("Please Check Your Email!", "Your file has been sent.", "success");
      }
    });
  };

  const handleSubmit = async (data: FormData) => {
    try {
      create(data);
    } catch (error) {
      ////console.log(error);
    }
  };

  const getDate = profile?.birthDate ? format(new Date(profile?.birthDate?.replace(/-/g,",")),"d MMMM yyyy") : "-";

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
          <section className="mt-8 flex flex-col lg:flex-row gap-10 bg-gray-100 lg:p-10 rounded-md">
            <div className="">
              <div className="card card-compact lg:w-96 bg-base-100 shadow-xl">
                <figure className="p-4">
                  <label>
                    <input
                      type="file"
                      hidden
                      onChange={({ target }) => {
                        if (target.files) {
                          const file = target.files[0];
                          setSelectedImage(URL.createObjectURL(file));
                          setSelectedFile(file);
                        }
                      }}
                    />
                    <div className="aspect-video rounded flex items-center justify-center border-2 border-dashed cursor-pointer">
                      {selectedImage ? (
                        <Image
                          src={selectedImage}
                          alt="img-profile"
                          width={1500}
                          height={1500}
                          className="rounded-md w-96 h-96 object-cover"
                        />
                      ) : (
                        <Image
                          src={session?.user?.image!}
                          alt="img-profile"
                          width={1500}
                          height={1500}
                          className="rounded-md w-96 h-96 object-cover"
                        />
                      )}
                    </div>
                  </label>
                </figure>
                <div className="card-body">
                  <div className="card-actions justify-end">
                    <p className="text-center">
                      Ketuk gambar untuk mengubah foto
                    </p>
                    <button
                      onClick={() => changePhoto(selectedFile)}
                      className="btn btn-primary btn-outline rounded-md w-full"
                      disabled = {!selectedFile}
                    >
                      Simpan Foto
                    </button>
                  </div>
                  <p>
                    Besar file: maksimum 10.000.000 bytes (10 Megabytes).
                    Ekstensi file yang diperbolehkan: .JPG .JPEG .PNG
                  </p>
                </div>
              </div>
              <div className="card card-compact lg:w-96 bg-base-100 shadow-xl mt-5">
                <div className="card-actions justify-end">
                  <button
                    className="btn btn-primary btn-outline rounded-md w-full"
                    onClick={(e) => resetPassword(e)}
                  >
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
                  <label className="my-auto mr-4 text-sm lg:text-base w-1/3 lg:w-auto">Username</label>
                  <h5 className="text-sm lg:text-base w-1/3 lg:w-auto">{profile?.username}</h5>
                  {/* The button to open modal */}
                  <a href="#my-modal-2" className="text-primary text-sm lg:text-base w-1/3 lg:w-auto">
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
                      {profile?.username == form.username || form.username == "" || form.username!.indexOf(" ") >= 0 ? (
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
                  <label className="my-auto mr-4 text-sm lg:text-base w-1/3 lg:w-auto">Tanggal Lahir</label>
                  {profile?.birthDate ?
                    <>
                      <h5 className="text-sm lg:text-base w-1/3 lg:w-auto">{getDate}</h5>
                    </>
                    :
                    <>
                      <h5 className="text-sm lg:text-base w-1/3 lg:w-auto">30 Desember 1995</h5>
                    </>
                  }
                  {/* The button to open modal */}
                  <a href="#modal-birthday" className="text-primary text-sm lg:text-base w-1/3 lg:w-auto">
                    ubah
                  </a>
                </div>
                <div className="modal" id="modal-birthday">
                  <div className="modal-box">
                    <a href="#">
                      <label
                        htmlFor="modal-birthday"
                        className="btn btn-sm btn-circle btn-outline btn-primary absolute right-2 top-2"
                      >
                        ✕
                      </label>
                    </a>
                    <h3 className="font-bold text-lg">Ubah Tanggal Lahir</h3>
                    <p className="py-4">
                      Kamu hanya dapat mengubah nama 1 kali lagi. Pastikan
                      nama sudah benar.
                    </p>
                    <div className="form-control w-full">
                      <label htmlFor="">
                        <span className="label-text">Tanggal Lahir</span>
                      </label>
                      <input
                        type="date"
                        name="birthday"
                        placeholder="Birthday"
                        value={form?.birthDate}
                        className="input input-bordered input-primary w-auto rounded-md"
                        onChange={(e) =>
                          setForm({
                            ...form,
                            birthDate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="modal-action">
                      <button
                        className="btn btn-primary w-full rounded-md"
                        onClick={() => handleSubmit(form)}
                      >
                        save!
                      </button>
                    </div>
                  </div>
                </div>
                {/* End Handle Tanggal Lahir */}

                {/* Handle Gender */}
                <div className="flex gap-5">
                  <label className="my-auto mr-4 text-sm lg:text-base w-1/3 lg:w-auto">Gender</label>
                  <div>
                    <FormControl sx={{ m: 1, minWidth: 100 }} size="small">
                      <InputLabel id="demo-simple-select-autowidth-label">Gender</InputLabel>
                      <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        value={form.gender}
                        onChange={handleChange}
                        autoWidth
                        label="Gender"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={Gender.MAN}>{Gender.MAN}</MenuItem>
                        <MenuItem value={Gender.WOMAN}>{Gender.WOMAN}</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  {
                    profile?.gender === form.gender || form.gender === "" ?
                      <>
                        <div className="textarea-disabled text-sm lg:text-base w-1/3 lg:w-auto my-auto cursor-not-allowed">
                          save
                        </div>
                      </>
                      :
                      <>
                        <div onClick={() => handleSubmit(form)} className="text-primary text-sm lg:text-base w-1/3 lg:w-auto my-auto cursor-pointer">
                          save
                        </div>

                      </>
                  }
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
                  <label className="mr-4 text-sm lg:text-base w-1/3 lg:w-auto">Nomor HP</label>
                  <h5 className="text-sm lg:text-base w-1/3 lg:w-auto">{profile?.phoneNumber}</h5>
                  {/* The button to open modal */}
                  <a href="#modal-nomorhp" className="text-primary text-sm lg:text-base w-1/3 lg:w-auto">
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
                      <div onClick={changeEmail} className="py-4">
                        Konfirmasi perubahan Nomor HP akan dikirimkan ke E-mail{" "}
                        {session?.user?.email}
                      </div>
                      <div className="form-control w-full"></div>
                      <div className="modal-action">
                        <a
                          href="#"
                          className="btn btn-primary w-full rounded-md"
                          onClick={(e) => changePhoneNumber(e)}
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
                <div className="flex flex-col lg:flex-row gap-5">
                  <div className="flex flex-row">
                    <label className="mr-4 text-sm lg:text-base w-1/3 lg:w-auto">Email</label>
                    <h5 className="text-sm lg:text-base w-1/3 lg:w-auto">{session?.user?.email}</h5>
                  </div>
                  {/* The button to open modal */}
                  <a href="#modal-email" className="text-primary text-sm lg:text-base w-1/3 lg:w-auto">
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
                      <h3 className="font-bold text-lg">Ubah Email</h3>
                      <div className="py-4">
                        Konfirmasi perubahan E-mail akan dikirimkan ke E-mail{" "}
                        {session?.user?.email}
                      </div>
                      <div className="form-control w-full"></div>
                      <div className="modal-action">
                        <a
                          href="#"
                          className="btn btn-primary w-full rounded-md"
                          onClick={(e) => changeEmail(e)}
                        >
                          Send!
                        </a>
                      </div>
                    </div>
                  </div>
                  {/* End The button to open modal */}
                </div>
                {/* End Handle Email */}

                {/* isValidation? */}
                {session?.user.emailVerified ? (
                  <>
                    <button className="btn w-full btn-md rounded-lg" disabled>
                      Youre Verified
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-outline btn-primary w-full btn-md rounded-lg"
                      onClick={(e) => changeVerifyStatus(e)}
                    >
                      Verify Account
                    </button>
                  </>
                )}
                {/* End isValidation? */}

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
      icon: BsFillHouseFill,
      desc: ``,
      code: (
        <>
          <section className="mt-8 flex flex-col gap-5 bg-gray-100 p-2 lg:p-10 rounded-md">
            <div className="flex">
              <AddressFormModal 
                provinceData={provinceData} 
                cityData={cityData}
                setAddressesState={setAddresses}
              />
            </div>
            {addresses ? (
              <div className="space-y-4">
                {addresses.map((address) => (
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
                        <div className="flex flex-col lg:flex-row gap-3 text-xs lg:text-base">
                          {/* <a className="text-primary-focus">Ubah Alamat</a> */}
                          <AddressUpdateFormModal 
                            provinceData={provinceData} 
                            cityData={cityData} 
                            address={address}
                            setAddressesState={setAddresses}
                          />
                          <p className="text-primary hidden lg:block">|</p>
                          <div>
                            {address.isMainAddress ? (
                              <a>Alamat Utama</a>
                            ) : (
                              <a className="text-primary-focus cursor-pointer" onClick={() => onSetMainAddress(address.id)}>
                                Jadikan Alamat Utama
                              </a>
                            )}
                          </div>
                          <p className="text-primary hidden lg:block">|</p>
                          <div>
                            {address.isShopAddress ? (
                              <a>Alamat Toko</a>
                            ) : (
                              <a className="text-primary-focus cursor-pointer" onClick={() => onSetShopAddress(address.id)}>
                                Jadikan Alamat Toko
                              </a>
                            )}
                          </div>
                          <p className="text-primary hidden lg:block">|</p>
                          <label className="text-primary-focus cursor-pointer" onClick={() => onDeleteAddress(address.id)} htmlFor="address-alert">Hapus</label>
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
      label: "Bank",
      value: "bank",
      icon: Cog6ToothIcon,
      desc: ``,
      code: (
        <div className="mt-8 flex flex-col gap-5 bg-gray-100 p-2 lg:p-10 rounded-md">
          {
            bankAccount ?
              <Fragment>
                <div>
                  <BankAccountDeletionModal onConfirm={handleBankAccountDelete} />
                </div>
                <div className="lg:w-1/2">
                  <div className="flex flex-row space-x-1">
                    <h1 className="w-1/2">Bank</h1>
                    <h1 className="w-1/2">: {banks.filter((bank) => bank.id === bankAccount.bankTypeId).at(0)?.name}</h1>
                  </div>
                  <div className="flex flex-row space-x-1">
                    <h1 className="w-1/2">Name</h1>
                    <h1 className="w-1/2">: {bankAccount.name}</h1>
                  </div>
                  <div className="flex flex-row space-x-1">
                    <h1 className="w-1/2">Account No.</h1>
                    <h1 className="w-1/2">: {bankAccount.number}</h1>
                  </div>
                </div>
              </Fragment>
              :
              <Fragment>
                <div>
                  <BankAccountFormModal 
                    banks={banks}
                    setBankState={setBankAccount}
                  />
                </div>
                <div>
                  <h1>No bank account has been added yet.</h1>
                </div>
              </Fragment>
          }
        </div>
      )
    },
  ];

  useEffect(() => {
    getToken();
  }, []);

  //console.log("user", session?.user);
  return (
    <>
      <Navbar />      
      <div className="lg:flex w-full my-5 lg:w-3/4 mx-auto">
        <div className="w-full lg:mx-10">
          <span className="flex gap-2">
            <HiUser className="my-auto w-5 h-5" />
            <h5>{session?.user?.name}</h5>
          </span>          
          { isLoading? (
            <div className="text-red-500">LOADING...</div>
          ) : (
            <></>
          )}
          <Tabs value="datadiri">
            <TabsHeader>
              {data.map(({ label, value, icon }) => (
                <Tab key={value} value={value}>
                  <div className="flex items-center gap-2">
                    {React.createElement(icon, { className: "w-5 h-5" })}
                    <h1 className="text-xs lg:text-base">{label}</h1>
                  </div>
                </Tab>
              ))}
            </TabsHeader>
            <TabsBody>
              {data.map(({ value, code }) => (
                <TabPanel key={value} value={value}>
                  {code}
                </TabPanel>
              ))}
            </TabsBody>
          </Tabs>
        </div>
      </div>
      <DeleteAddressAlert htmlElementId={`address-alert`} addressId={selectedAddressId}/>
      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const user = await prisma.user.findUnique({
    where: {
      id: session?.user.id
    },
    select: {
      id: true,
      bankAccount: {
        include: {
          bank: {
            select: {
              name: true
            }
          }
        }
      }
    }
  });
  const profile = await prisma.profile.findUnique({
    where: { userId: session?.user?.id },
    select: {
      id: true,
      username: true,
      phoneNumber: true,
      birthDate: true,
      gender: true
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
        isMainAddress: true,
        isShopAddress: true,
        contact: true
      },
    });
  }

  var options = {
    method: 'GET',
    url: 'https://api.rajaongkir.com/starter/province',
    headers: { key: 'c6ea8e82078275e61b3a46b5e65b69f1' }
  };

  const provinceRes = await axios.request(options);
  const province = provinceRes.data.rajaongkir.results;

  options.url = 'https://api.rajaongkir.com/starter/city'
  const cityRes = await axios.request(options);
  const city = cityRes.data.rajaongkir.results;

  const banks = await prisma.bankType.findMany();

  return {
    props: {
      profile,
      user,
      address,
      cityData: city,
      provinceData: province,
      banks
    }
  };
};
