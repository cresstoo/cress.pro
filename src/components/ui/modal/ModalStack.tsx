import { useAtomValue } from 'jotai'
import { Modal } from './Modal'
import { modalStackAtom } from '@/store/modalStack'
import { AnimatePresence } from 'framer-motion'

export function ModalStack() {
  const modalStack = useAtomValue(modalStackAtom)

  return (
    <AnimatePresence>
      {modalStack.map((modal, index) => (
        <Modal key={modal.id} index={index} id={modal.id}>
          <DialogContent aria-describedby="modal-description">
            <DialogTitle>Modal Title</DialogTitle>
            <div id="modal-description">
              {/* 内容 */}
            </div>
          </DialogContent>
        </Modal>
      ))}
    </AnimatePresence>
  )
}
