export type VoidFunction = () => void;

export type ConsumerFunction<T> = (val: T) => void;

export type ProducerFunction<T> = () => T;

export type CPFunction<C, P> = (val: C) => P;

export type DoubleCPFunction<C1, C2, P> = (val1: C1, val2: C2) => P;

export type TripleCPFunction<C1, C2, C3, P> = (val1: C1, val2: C2, val3: C3) => P;

export type QuadCPFunction<C1, C2, C3, C4, P> = (val1: C1, val2: C2, val3: C3, val4: C4) => P;
