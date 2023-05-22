import React from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "@/lib/prisma";

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

  async function onEdit(id:string) {
    
  }
  
  async function onDelete(id:string) {
    
  }

  return (
    <div>
      <p className="card-title">Events</p>
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
                        <img
                          src={`http://localhost:3000/${event.image}`}
                        />
                      ) : (
                        <img src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg" />
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
          <p>No on going transaction</p>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const events = await prisma.event.findMany();

  return {
    props: {
      events: JSON.parse(JSON.stringify(events)),
    },
  };
};
