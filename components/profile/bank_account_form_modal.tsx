import { Button, Dialog, DialogBody, DialogHeader } from "@material-tailwind/react";
import { BankType } from "@prisma/client";
import { Fragment, useState } from "react";

interface Props {
  banks: BankType[]
}

const BankAccountFormModal = ({ banks } : Props) => {

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const modalOpenHandler = () => setModalOpen(!modalOpen);

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
          <form className="space-y-4">
            <div id="bank-select-container" className="flex flex-col w-full space-y-1">
              <label htmlFor="bank-type-input">Bank</label>
              <select name="bank" id="bank-type-input" className="p-2 h-10 border rounded-lg border-gray-400 focus:border-none focus:border-white hover:cursor-pointer">
                {
                  banks.map((bank, i) => 
                    <option key={i}>{bank.name}</option>
                  )
                }
              </select>
            </div>
            <div id="account-owner-name-input-container" className="flex flex-col w-full space-y-1">
              <label htmlFor="">Name</label>
              <input type="text" className="p-2 h-10 border rounded-lg border-gray-400 focus:border-none focus:border-white"/>
            </div>
            <div id="account-number-input-container" className="flex flex-col w-full space-y-1">
              <label htmlFor="">Account Number</label>
              <input type="text" className="p-2 h-10 border rounded-lg border-gray-400 focus:border-none focus:border-white"/>
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