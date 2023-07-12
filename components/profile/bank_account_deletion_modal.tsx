import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from "@material-tailwind/react";
import { Fragment, useState } from "react";

interface Props {
  onConfirm: () => void;
}

const BankAccountDeletionModal = ({ onConfirm } : Props) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handleModalOpen = () => setModalOpen(!modalOpen)
  
  return (
    <Fragment>
      <Button onClick={handleModalOpen} className="bg-red-500">
        Delete Bank Account
      </Button>
      <Dialog open={modalOpen} handler={handleModalOpen}>
        <DialogHeader>
          <h1 className="w-3/4">Confirm Deletion</h1>
            <div  className="w-1/4 flex justify-end">
              <button onClick={handleModalOpen}>
                ✕
              </button>
            </div>
        </DialogHeader>
        <DialogBody>
          <p>Are you sure you want to delete your bank account?</p>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button onClick={handleModalOpen}>
            Cancel
          </Button>
          <Button onClick={() => {onConfirm(); handleModalOpen();}}>
            Confirm
          </Button>
        </DialogFooter>
      </Dialog>
    </Fragment>
  );
}

export default BankAccountDeletionModal;