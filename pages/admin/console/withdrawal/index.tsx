import React, {useState} from "react";
import { GetServerSideProps } from "next";
import { prisma } from "@/lib/prisma";
import { useRouter } from "next/router";
import { Shop, BalanceType, WithdrawalStatus } from "@prisma/client";
import WithdrawalDetail from "@/components/transactions/withdrawal_detail_modal";
import Image from "next/image";

interface WithdrawalData {
    withdrawals: Withdrawal[];
}

interface Withdrawal {
    id: number,
    amount: number,
    BalanceType: BalanceType,
    status: WithdrawalStatus,
    user: User
}

interface User {
    id: string,
    image: string,
    name: string,
    shop: Shop,
}

export default function Withdrawal({ withdrawals }: WithdrawalData) {
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal>();
  const router = useRouter();
  console.log(withdrawals);

  const getWithdrawalDetail = () => {
    console.log("returning: ", selectedWithdrawal);
    return { selectedWithdrawal }
  }

  return (
    <div>
      <div>
        <p className="card-title">Complains</p>
      </div>
      <div className="mt-5">
        {withdrawals.length !== 0 ? (
          <div>
            {withdrawals.map((withdrawal) => (
              <div
                className="card bg-base-100 shadow-xl text-md"
                key={String(withdrawal.id)}
              >
                <div className="flex">
                  <div className="card-body py-5">
                    <figure className="h-20 w-20 rounded-full">
                      {withdrawal.user.image ? (
                        <Image
                          src={withdrawal.user.image}
                          alt=""
                          width={1500}
                          height={1500}
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src =
                              "https://static1.cbrimages.com/wordpress/wp-content/uploads/2020/01/Featured-Image-Odd-Jobs-Cropped.jpg";
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
                        <p>
                          Request By: {withdrawal.user.name}
                        </p>
                        <p>Amount: {withdrawal.amount}</p>
                        <p>Status: {withdrawal.status}</p>
                        <div className="card-actions my-2">
                          {withdrawal.status == WithdrawalStatus.DONE ? (
                            <></>
                          ) : (
                            <label
                                onClick={() => setSelectedWithdrawal(withdrawal)}
                                className="w-24 bg-blue-700 rounded-sm text-white text-center"
                                htmlFor="withdrawal-modal"
                            >
                                Selesaikan
                            </label>
                          )}
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
      <WithdrawalDetail htmlElementId={`withdrawal-modal`} selectProductCallback={getWithdrawalDetail}/>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const withdrawals = await prisma.withdrawal.findMany({
    select: {
      id: true,
      amount: true,
      BalanceType: true,
      status: true,
      user: {
        select: {
          id: true,
          image: true,
          name: true,
          shop: true,
          bankAccount: {
            select:{
                id: true,
                name: true,
                number: true,
                bank: true
            }
          }
        },
      },
    },
  });

  return {
    props: {
        withdrawals: JSON.parse(JSON.stringify(withdrawals)),
    },
  };
};
