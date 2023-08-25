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
        Hapus Akun Bank
      </Button>
      <Dialog open={modalOpen} handler={handleModalOpen}>
        <DialogHeader>
          <h1 className="w-3/4">Konfirmasi Penghapusan</h1>
            <div  className="w-1/4 flex justify-end">
              <button onClick={handleModalOpen}>
                ✕
              </button>
            </div>
        </DialogHeader>
        <DialogBody>
          <p>Apakah anda yakin untuk menghapus akun bank anda?</p>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button onClick={handleModalOpen} className="bg-red-500">
            Batal
          </Button>
          <Button onClick={() => {onConfirm(); handleModalOpen();}}>
            Konfirmasi
          </Button>
        </DialogFooter>
      </Dialog>
    </Fragment>
  );
}

export default BankAccountDeletionModal;