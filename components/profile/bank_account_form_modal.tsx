import { Button, Dialog, DialogBody, DialogHeader } from "@material-tailwind/react";
import { BankType } from "@prisma/client";
import { useRouter } from "next/router";
import { ChangeEvent, Fragment, useState } from "react";

interface Props {
  banks: BankType[]
}

interface BankAccountForm {
  bankId: string
  name: string
  number: string
}

const BankAccountFormModal = ({ banks } : Props) => {

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [accountNumber, setAccountNumber] = useState<string>()

  const modalOpenHandler = () => setModalOpen(!modalOpen);

  const [form, setForm]  =  useState<BankAccountForm>({
    bankId: String(banks[0].id),
    name: '',
    number:  ''
  });

  const router = useRouter();

  const createBankAccout = async (data: BankAccountForm) => {
    //console.log(data)
    try{
      await fetch('/api/profile/bank/create', {
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        method: 'POST'
      }).then(() => router.reload())
    }
    catch (e) {
      //console.log(e);
    }
  }

  const handleInputAccountNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    const result = event.target.value.replace(/\D/g, '');
    setAccountNumber(result);

    setForm({...form, number: result})
  }

  return (
    <Fragment>
      <Button onClick={modalOpenHandler}>
        + Add Bank Account
      </Button>
      <Dialog open={modalOpen} handler={modalOpenHandler}>
        <DialogHeader>
          <h1 className="w-3/4">Add Bank Account</h1>
          <div  className="w-1/4 flex justify-end">
            <button onClick={modalOpenHandler}>
              ✕
            </button>
          </div>
        </DialogHeader>
        <DialogBody>
          <form onSubmit={(e) => {e.preventDefault(); createBankAccout(form)}} className="space-y-4" action="/api/profile/bank/create" method="post">
            <div id="bank-select-container" className="flex flex-col w-full space-y-1">
              <label htmlFor="bank-type-input">Bank</label>
              <select onChange={(e) => {e.preventDefault(); setForm({...form, bankId: String(e.target.value)}); //console.log(form)}} name="bank" id="bank-type-input" className="p-2 h-10 border rounded-lg border-gray-400 focus:border-none focus:border-white hover:cursor-pointer">
                {
                  banks.map((bank) => 
                    <option key={bank.id} value={bank.id}>{bank.name}</option>
                  )
                }
              </select>
            </div>
            <div id="account-owner-name-input-container" className="flex flex-col w-full space-y-1">
              <label htmlFor="name-input">Name</label>
              <input id="name-input" onChange={e => {setForm({...form, name: e.target.value})}} type="text" className="p-2 h-10 border rounded-lg border-gray-400 focus:border-none focus:border-white"/>
            </div>
            <div id="account-number-input-container" className="flex flex-col w-full space-y-1">
              <label htmlFor="account-number-input">Account Number</label>
              <input id="account-number-input" value={accountNumber} onChange={handleInputAccountNumberChange} type="text" className="p-2 h-10 border rounded-lg border-gray-400 focus:border-none focus:border-white"/>
            </div>
            <div className="w-full flex justify-end">
              <button type="submit" onClick={modalOpenHandler} className="w-24 h-8 bg-green-700 hover:bg-green-500 transition text-white rounded-md ">Save</button>
            </div>
          </form>
        </DialogBody>
      </Dialog>
    </Fragment>
  );
}

export default BankAccountFormModal;