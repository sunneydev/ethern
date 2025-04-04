export default class Queue<ValueType> implements Iterable<ValueType> {
  readonly size: number;
  constructor();
  [Symbol.iterator](): IterableIterator<ValueType>;
  enqueue(value: ValueType): void;
  dequeue(): ValueType | undefined;
  clear(): void;
}
