import { Principal } from '@dfinity/principal'

export const principal2string = (p: Principal): string => p.toText()

export const string2principal = (p: string): Principal => Principal.fromText(p)
