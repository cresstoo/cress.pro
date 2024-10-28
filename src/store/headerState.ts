import { atom } from 'jotai'

export const headerVisibleAtom = atom(true)
export const headerTitleAtom = atom<string | null>(null)
