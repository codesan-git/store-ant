import React from "react";
import { GetServerSideProps } from "next";
import { prisma } from "@/lib/prisma";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import Image from "next/image";

interface EventData {
  events: Event[];
}

interface Event {
  id: number;
  eventName: string;
  eventPath: string;
  startDate: Date;
  endDate: Date;
  image: string;
}

export default function Admin({ events }: EventData) {
  const router = useRouter();

  async function handleSignOut() {
    signOut({ callbackUrl: "/admin/login" });
  }

  async function onEdit(id:string) {
    router.push({
      pathname: '/admin/console/event/update/',
      query: { id: id },
    })
  }
  
  async function onDelete(id:string) {
    try{
      fetch(`/api/admin/event/${id}`, {
        headers: {
          'Content-Type' : 'application/json'
        },
        method: 'DELETE'
      }).then(()=>{
        router.replace(router.asPath)
      })
    }catch(error){
        //console.log(error)
    }
  }

  return (
    <div>
      <div className="flex w-full justify-between">
        <p className="card-title">Events</p>  
        <div className="flex gap-x-5">
          <button
            onClick={() => router.push('/admin/console/event/create')}
            className="w-64 btn btn-primary"
          >
            Tambah Event
          </button>
          <button
            onClick={() => router.push('/admin/console/complain/')}
            className="w-64 btn btn-primary"
          >
            Lihat Pengajuan Pengembalian
          </button>
          <button
            onClick={() => handleSignOut()}
            className="w-32 btn btn-primary"
          >
            Log Out
          </button>
        </div>
      </div>
      <div className="mt-5">
        {events.length !== 0 ? (
          <div>
            {events.map((event) => (
              <div
                className="card bg-base-100 shadow-xl text-md"
                key={String(event.id)}
              >
                <div className="flex">
                  <div className="card-body py-5">
                    <figure className="rounded-md h-40 w-40">
                      {event.image ? (
                        <Image
                          src={event.image}    
                          alt=""
                          width={1500}
                          height={1500}                                    
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src =
                            "https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg"
                          }}
                        />
                      ) : (
                        <Image 
                          src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg"
                          alt=""
                          width={1500}
                          height={1500}
                          />
                      )}
                    </figure>
                  </div>
                  <div className="w-full">
                    <div className="py-5 px-10 flex w-full">
                      <div>
                        <h2 className="card-title">{event.eventName}</h2>
                        <p>Start: {String(event.startDate).split("T")[0]}</p>
                        <p>End: {String(event.endDate).split("T")[0]}</p>
                        <button
                          onClick={() => window.open(event.eventPath)}
                          className="w-32 btn btn-primary"
                        >
                          Lihat
                        </button>
                        <div className="card-actions justify-end my-2">
                            <button onClick={() => onEdit(event.id.toString())} className="w-16 btn btn-primary">Edit</button>
                            <button onClick={() => onDelete(event.id.toString())} className="w-16 btn bg-red-500">Delete</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No on going events</p>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const events = await prisma.event.findMany();

  return {
    props: {
      events: JSON.parse(JSON.stringify(events)),
    },
  };
};
