import { GetServerSideProps } from "next";
import { getTypeTransactions } from "@/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import getDataOrders from "./action/getComplainSeller";
import { Fragment, useState, useEffect } from "react";
import { HiShoppingCart } from "react-icons/hi";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { HiOutlineCamera, HiPlus } from "react-icons/hi";
import { HiOutlinePhoto } from "react-icons/hi2";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { prisma } from "@/lib/prisma";
import { getSession } from "next-auth/react";
import { Complain, Order, Transaction, User, Shop } from "@prisma/client";

interface Props {
  // getOrders: getTypeTransactions[]
  getOrders: Transaction & {
    order: Order[] & {
      Complain: Complain
    }
    user: User;
    shop: Shop;
  }[]
}

interface FormData {
  complainId: number,
  description: string,
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function ComplainAdmin({ getOrders }: Props) {

  const router = useRouter()
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [selectedImage, setSelectedImage] = useState<string>();
  const [selectedFiles, setFile] = useState<any[]>([]);
  const [form, setForm] = useState<FormData>({
    complainId: 0,
    description: "",
  });
  const [urls, setURLs] = useState<string[]>([]);

  useEffect(() => {
    console.log("images: ", urls.join(","));
    console.log("url length: ", urls.length);
    console.log("files length: ", selectedFiles.length);
    console.log("condition: ", selectedFiles.length == urls.length);
    if (urls.join(",") != "" && urls.length == selectedFiles.length) {
      const data = { complainId: form.complainId, description: form.description, images: urls.join(",") };
      axios.post(`/api/complain/seller/shopComment`, data).then(() => { console.log("created!"); router.back(); });
    }
  }, [urls]);

  const acceptStatus = async (id: string) => {
    try {
      const response = await axios.patch(`/api/complain/seller/accept`, {
        id: id
      }).then(() => router.refresh())

    } catch (error) {

    }
  };

  const shopComment = async () => {
    // const data:FormData = {complainId: form.complainId,description:form.description};
    // try {
    //   await axios.post('/api/complain/seller/shopComment', {
    //     complainId: data.complainId,
    //     description: data.description,
    // })
    // } catch (error) {

    // }
  }


  // const rejectStatus = async (id: string) => {
  //   try {
  //     const response = await axios.patch(`/api/complain/seller/reject`, {
  //       id: id
  //     }).then(() => router.refresh())

  //   } catch (error) {

  //   }
  // };

  const postComment = async () => {
    const promises: any[] = [];
    const storage = getStorage();

    selectedFiles.map((file) => {
      console.log("loop");

      const sotrageRef = ref(storage, `images/product/${file.name}`);

      const uploadTask = uploadBytesResumable(sotrageRef, file);
      promises.push(uploadTask);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const prog = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          //setProgress(prog);
        },
        (error) => console.log(error),
        async () => {
          await getDownloadURL(uploadTask.snapshot.ref).then((downloadURLs) => {
            setURLs(prevArray => [...prevArray, downloadURLs]);
          });
        }
      );
    });
    Promise.all(promises)
      .then(async () => {
        alert("All images uploaded");
      })
      .then((err) => console.log(err));
    // }
    // }
  };

  function handleFile(target: any) {
    let file = target.files;

    for (let i = 0; i < file.length; i++) {
      const fileType = file[i]["type"];
      const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
      if (validImageTypes.includes(fileType)) {
        setFile([...selectedFiles, file[i]]);
      } else {
        console.log("only images accepted");
      }
      console.log("FILES: ", selectedFiles);
    }
  };

  const removeImage = (i: string) => {
    setFile(selectedFiles.filter((x) => x.name !== i));
    if (selectedFiles.length >= 2)
      setSelectedImage(URL.createObjectURL(selectedFiles[selectedFiles.length - 2]));
  };

  const renderInputMessage = () => {

    if (selectedFiles.length >= 5) return (
      <>
        <label htmlFor="product-image-input" className='hover:cursor-pointer flex flex-col lg:flex-row justify-center items-center'>
          <HiOutlinePhoto className='w-6 h-6' />
          <p className='text-xs lg:text-base'>&nbsp;You have reached the max limit for photos.</p>
        </label>
      </>
    );

    return (
      <>
        <label htmlFor="product-image-input" className='hover:cursor-pointer flex flex-col lg:flex-row justify-center items-center'>
          <HiOutlineCamera className='w-6 h-6' />
          &nbsp;Select Image
        </label>
      </>
    );
  }

  const renderSelectedImages = () => {
    if (selectedFiles.length == 0) return;

    return (
      <>
        <div className='flex flex-row gap-2'>
          {
            selectedFiles.map(
              (file, key) =>
                <div key={key} className="relative">
                  <div onClick={() => removeImage(file.name)} className="flex justify-center items-center bg-black text-white rounded-full h-4 w-4 text-xs font-bold absolute -right-2 -top-2 sm:-right-2 hover:cursor-pointer">
                    ✕
                  </div>
                  <img src={URL.createObjectURL(file)} alt="" className="w-12 h-12 sm:w-16 sm:h-16 object-cover border border-gray-600" />
                </div>
            )
          }
        </div>
      </>
    );

  }

  // console.log(`getOrders`,getOrders)
  // console.log(`getOrders`, getOrders[11].order[0].OrderStatus)
  console.log(`desc`, form)
  console.log(`img`, selectedImage)
  return (
    <>
      <div className="hidden lg:block">
        <table className="table">
          {/* head */}
          <thead>
            <tr className="text-center">
              <th>ID</th>
              <th>Image</th>
              <th>Description</th>
              <th>Status Complain</th>
              <th>Status Order</th>
              <th>Action Complain</th>
              <th>Nama Buyer</th>
              <th>Nama Toko</th>
              <th>Product</th>
            </tr>
          </thead>
          {getOrders.map((comp: any) => (
            <Fragment key={comp.id}>
              {comp.order.map((orders: any) => (
                <Fragment key={orders.id}>
                  {orders.Complain?.status && (
                    <tbody>
                      <tr className="hover">
                        <th>{orders.Complain?.orderId}</th>
                        <td className="flex gap-4">
                          {orders.Complain?.image.split(",").map((kocak: string) => (
                            <img
                              key={kocak}
                              src={kocak}
                              className="w-16 h-16"
                            />
                          ))}
                        </td>
                        <td>{orders.Complain?.description}</td>
                        <td className="text-center">{orders.Complain?.status}</td>
                        <td className="text-center">{orders.OrderStatus}</td>
                        <td className="gap-4">
                          {orders.OrderStatus === "RETURNED" || orders.OrderStatus === "NEED_ADMIN_REVIEW" || orders.OrderStatus === "RETURN_REJECTED" ?
                            <>
                              <div className="flex gap-2">
                                <button onClick={() => acceptStatus(String(orders.Complain?.orderId))} className="btn-disabled w-16 h-8 rounded-sm">accept</button>
                                {/* <button className="btn" onClick={() => window.my_modal_3.showModal()}>open modal</button>
                                <dialog id="my_modal_3" className="modal">
                                  <form method="dialog" className="modal-box">
                                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                    <h3 className="font-bold text-lg">Hello!</h3>
                                    <p className="py-4">Press ESC key or click on ✕ button to close</p>
                                  </form>
                                </dialog> */}
                                <button className="btn-disabled w-16 h-8 rounded-sm">reject</button>
                              </div>
                            </>
                            :
                            <>
                              <div className="flex gap-2">
                                <button onClick={() => acceptStatus(String(orders.Complain?.orderId))} className="w-16 h-8 rounded-sm bg-green-500 border border-green-500 text-white hover:bg-transparent hover:bg-white hover:text-black">accept</button>
                                <button onClick={() => {
                                  handleOpen();
                                  setForm({ ...form, complainId: orders.Complain?.id });
                                }} className="w-16 h-8 rounded-sm bg-red-500 border border-red-500 text-white hover:bg-transparent hover:bg-white hover:text-black">reject</button>
                                <Modal
                                  open={open}
                                  onClose={handleClose}
                                  aria-labelledby="modal-modal-title"
                                  aria-describedby="modal-modal-description"
                                >
                                  <Box sx={style}>
                                    <Typography id="modal-modal-title" variant="h6" component="h2">
                                      Text in a modal
                                    </Typography>
                                    <Box
                                      component="form"
                                      sx={{
                                        '& .MuiTextField-root': { width: '100%' },
                                      }}
                                      noValidate
                                      autoComplete="off"
                                    >
                                      <div>
                                        <TextField
                                          id="outlined-textarea"
                                          label="Multiline Placeholder"
                                          placeholder="Placeholder"
                                          multiline
                                          value={form.description}
                                          onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        />
                                      </div>
                                    </Box>
                                    <div id="complain-image" className="cursor-pointer">
                                      <h1 className="text-xl font-bold">Upload Gambar</h1>
                                      <form action="" className='lg:flex lg:flex-row'>
                                        <section className='px-4 lg:w-1/2 flex flex-col justify-center items-center space-y-4'>
                                          <div className='border-gray-600 border border-dashed rounded-xl flex justify-center items-center h-40 w-full lg:h-5/6 lg:w-5/6 relative'>
                                            <input disabled={selectedFiles.length >= 5} type="file" accept='.jpg, .jpeg, .png, .webp' name="product-image" id="product-image-input" className='w-full h-full cursor-pointer opacity-0 absolute'
                                              onChange={({ target }) => {
                                                handleFile(target);
                                                if (target.files) {
                                                  const file = target.files[0];
                                                  if (file)
                                                    setSelectedImage(URL.createObjectURL(file));
                                                }
                                              }}
                                            />
                                            {renderInputMessage()}
                                          </div>
                                          {renderSelectedImages()}
                                        </section>
                                      </form>
                                    </div>
                                    <button
                                      // onClick={() => { postComment(), rejectStatus(String(orders.Complain?.orderId)) }}
                                      onClick={() => { postComment() }}
                                      className="w-16 h-8 rounded-sm bg-red-500 border border-red-500 text-white hover:bg-transparent hover:bg-white hover:text-black"
                                    >
                                      reject
                                    </button>
                                  </Box>
                                </Modal>
                                {/* <button onClick={() => rejectStatus(String(orders.Complain?.orderId))} className="w-16 h-8 rounded-sm bg-red-500 border border-red-500 text-white hover:bg-transparent hover:bg-white hover:text-black">reject</button> */}
                              </div>
                            </>
                          }
                          {/* <div className="flex gap-2">
                          <button onClick={() => acceptStatus(String(orders.Complain?.orderId))} className="w-16 h-8 rounded-sm bg-green-500 border border-green-500 text-white hover:bg-transparent hover:bg-white hover:text-black">accept</button>
                          <button onClick={() => rejectStatus(String(orders.Complain?.orderId))} className="w-16 h-8 rounded-sm bg-red-500 border border-red-500 text-white hover:bg-transparent hover:bg-white hover:text-black">reject</button>
                        </div> */}
                        </td>
                        <td>{comp.user.name}</td>
                        <td>{comp.shop.shopName}</td>
                        <td></td>
                      </tr>
                    </tbody>
                  )}
                </Fragment>
              ))}
            </Fragment>
          ))}

        </table>
      </div>
      <div className="lg:hidden">
        {getOrders.map((comp: any) => (
          <Fragment key={comp.id}>
            {comp.order.map((orders: any) => (
              <Fragment key={orders.id}>
                {orders.Complain?.status && (
                  <div className="my-4">
                    <div id="upper-detail" className="flex flex-row p-2 bg-gray-400">
                      <div className="w-1/2 flex justify-start items-center ">
                        <h1 className="text-sm lg:text-xl font-bold">{orders.Complain?.id}</h1>
                      </div>
                      <div className="w-full flex flex-row items-center space-x-2 justify-end">
                        <h1 className="flex justify-end text-sm font-bold text-red-600">{orders.OrderStatus}</h1>
                        <h1 className="flex justify-end text-xs">{orders.createdAt.split("", 10)}</h1>
                      </div>
                    </div><div id="lower-detail">
                      <div id="product-details" className="flex flex-row p-2 bg-gray-300">
                        <div id="product-detail-img-container" className=" flex justify-center items-center">
                          {orders.Complain?.image.split(",").map((kocak: string) => (
                            <img
                              key={kocak}
                              src={kocak}
                              className="w-16 h-16"
                            />
                          ))}
                        </div>
                        <div id="product-detail" className="flex-1 p-4 flex flex-col justify-center">
                          <h1 className="text-xs lg:text-base">Kode Transaksi: {orders.Complain?.orderId} </h1>
                          <h1 className="text-xs lg:text-base font-bold">{orders.Complain?.description}</h1>
                          <h1 className="text-xs lg:text-base">Jumlah: {orders.count}</h1>
                          {/* {renderExtraItems()} */}
                        </div>
                      </div>
                      <div id="total-section" className="flex flex-row p-2 bg-gray-400">
                        <div id="total-details" className="w-full lg:hidden">
                          <h1 className="text-xs items-center">Complain Status: {orders.Complain?.status}</h1>
                          {/* <h1 className="text-xs">Rp {calculateTransactionTotal().toString()}</h1> */}
                        </div>
                        <div className="w-1/3 hidden lg:flex lg:flex-row lg:justify-start lg:items-center">
                          <HiShoppingCart className="mr-1" />
                          {/* {renderTransactionDate()} */}
                        </div>
                        <div id="transaction-actions" className="w-2/3 lg:w-full flex flex-row justify-end space-x-2">
                          {/* {renderActionButtons()} */}
                          {orders.OrderStatus === "RETURNED" || orders.OrderStatus === "NEED_ADMIN_REVIEW" || orders.OrderStatus === "RETURN_REJECTED" ?
                            <>
                              <div className="flex gap-2">
                                <button onClick={() => acceptStatus(String(orders.Complain?.orderId))} className="btn-disabled btn-xs w-16 h-4 rounded-sm">accept</button>
                                <button className="btn-disabled btn-xs w-16 h-4 rounded-sm">reject</button>
                              </div>
                            </>
                            :
                            <>
                              <div className="flex gap-2">
                                <button onClick={() => acceptStatus(String(orders.Complain?.orderId))} className="w-16 h-8 rounded-sm bg-green-500 border border-green-500 text-white hover:bg-transparent hover:bg-white hover:text-black">accept</button>
                                <button className="w-16 h-8 rounded-sm bg-red-500 border border-red-500 text-white hover:bg-transparent hover:bg-white hover:text-black">reject</button>
                              </div>
                            </>
                          }
                        </div>
                      </div>
                    </div></div>
                )}
              </Fragment>
            ))}
          </Fragment>
        ))}
      </div>
    </>
  )
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  // const complain = await getDataOrders(context)
  const currUser = await getSession(context);
  console.log(`currUser`, currUser?.user.id)
  const getShop = await prisma.shop.findFirst({
    where: {
      userId: currUser?.user.id
    }

  })
  console.log(`getShop`, getShop)
  const getTransactions = await prisma.transaction.findMany({
    where: {
      shopId: getShop?.id
    },
    include: {
      order: {
        include: {
          Complain: true
        }
      },
      user: true,
      shop: true
    }
  })
  console.log(`getTransactions`, getTransactions)

  return {
    props: {
      getOrders: JSON.parse(JSON.stringify(getTransactions))
    },
  };
}