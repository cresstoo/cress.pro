import { useAtomValue } from 'jotai'
import { Modal } from './Modal'
import { modalStackAtom } from '@/store/modalStack'
import { AnimatePresence } from 'framer-motion'
import * as Dialog from '@radix-ui/react-dialog'

export function ModalStack() {
  const modalStack = useAtomValue(modalStackAtom)

  return (
    <AnimatePresence>
      {modalStack.map((modal, index) => (
        <Modal key={modal.id} index={index} id={modal.id}>
          <Dialog.Root>
            <Dialog.Portal>
              <Dialog.Content aria-describedby="modal-description">
                <Dialog.Title>Modal Title</Dialog.Title>
                <div id="modal-description">
                  {/* 内容 */}
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </Modal>
      ))}
    </AnimatePresence>
  )
}
