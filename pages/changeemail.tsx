import axios from "axios";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { useState } from "react";
import Image from "next/image";

interface FormData {
    email?: string;
    access_token?: string;
}

export default function Validation() {
    const router = useRouter();
    const { token: accessToken } = router.query;
    const [form, setForm] = useState<FormData>({
        email: "",
        access_token: accessToken as string,
    });
    //console.log("accessToken", accessToken);

    //console.log("form body", form);
    const changeEmail = async () => {
        // //console.log('form password', form.password)
        try {
            const response = await axios
                .put(`/api/changeemail/changeemail`, form)
                .then(() => {
                    router.push("/login");
                });
            //console.log("dari fetchProduct", response);
        } catch (error) {
            //console.log(error);
        }
    };

    return (
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
                    <h2 className="card-title">Change Your Email Here!</h2>
                    <p className="py-4">Lets dance together, dance on the dancefloor</p>
                    <div className="card-actions">
                        <div className="w-full relative group">
                            <input
                                required
                                id="newpassword"
                                type="text"
                                name="Email"
                                value={form?.email}
                                className="input input-bordered input-primary w-full rounded-md h-10 px-4 text-sm peer bg-gray-100 outline-none"
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        email: e.target.value,
                                        access_token: accessToken as string,
                                    })
                                }
                            />
                            <label
                                htmlFor="newemail"
                                className="label transform transition-all absolute top-0 left-0 h-full flex items-center pl-2 text-sm group-focus-within:text-xs peer-valid:text-xs group-focus-within:h-1/2 peer-valid:h-1/2 group-focus-within:-translate-y-full peer-valid:-translate-y-full group-focus-within:pl-0 peer-valid:pl-0"
                            >
                                Email
                            </label>
                        </div>
                        <button
                            className="btn btn-primary w-full rounded-md"
                            onClick={changeEmail}
                        >
                            Change Email
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}