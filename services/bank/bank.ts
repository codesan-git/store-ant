import { BankAccount } from "@prisma/client";
import axios from "axios";

export interface BankAccountForm {
  bankId: string
  name: string
  number: string
}

export const getBankAccount = async (): Promise<BankAccount> => {
  let bankAccount: BankAccount = {
    id: 0,
    name: '',
    number: '',
    userId: '',
    bankTypeId: 0
  };

  try {
    const response = await axios.get(`api/bank/get/byuser`);
    
    bankAccount = response.data.bank;
  }
  catch (error){

  }

  return bankAccount;
}

export const createBankAccount = async (data: BankAccountForm) => {
  //console.log(data)
  try{
    await fetch('/api/bank/create', {
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
      method: 'POST'
    })
  }
  catch (e) {
    console.log(e);
  }
}