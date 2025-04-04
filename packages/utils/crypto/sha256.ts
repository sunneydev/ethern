export function rotr32(n: number, x: number): number {
  return ((x << (32 - n)) | (x >>> n)) >>> 0;
}

const K = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1,
  0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
  0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
  0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
  0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
  0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
];

// To avoid unnecessary array instantiation.
const w = new Uint32Array(64);

export function sha256(data: Uint8Array): Uint8Array {
  const H = new Uint32Array([
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c,
    0x1f83d9ab, 0x5be0cd19,
  ]);

  const l = data.byteLength * 8;
  const targetLength = Math.ceil((data.length + 1 + 8) / 64) * 64;
  const buffer = new Uint8Array(targetLength);
  buffer.set(data);
  buffer[data.length] = 0x80;
  bigEndian.putUint32(buffer, l, targetLength - 4);

  for (let i = 0; i < buffer.length; i += 64) {
    for (let t = 0; t < 16; t++) {
      w[t] =
        ((buffer[i + t * 4] << 24) |
          (buffer[i + t * 4 + 1] << 16) |
          (buffer[i + t * 4 + 2] << 8) |
          buffer[i + t * 4 + 3]) >>>
        0;
    }
    for (let t = 16; t < 64; t++) {
      const sigma1 =
        (rotr32(17, w[t - 2]) ^ rotr32(19, w[t - 2]) ^ (w[t - 2] >>> 10)) >>> 0;
      const sigma0 =
        (rotr32(7, w[t - 15]) ^ rotr32(18, w[t - 15]) ^ (w[t - 15] >>> 3)) >>>
        0;
      w[t] = (sigma1 + w[t - 7] + sigma0 + w[t - 16]) | 0;
    }
    let a = H[0];
    let b = H[1];
    let c = H[2];
    let d = H[3];
    let e = H[4];
    let f = H[5];
    let g = H[6];
    let h = H[7];
    for (let t = 0; t < 64; t++) {
      const sigma1 = (rotr32(6, e) ^ rotr32(11, e) ^ rotr32(25, e)) >>> 0;
      const ch = ((e & f) ^ (~e & g)) >>> 0;
      const t1 = (h + sigma1 + ch + K[t] + w[t]) | 0;
      const sigma0 = (rotr32(2, a) ^ rotr32(13, a) ^ rotr32(22, a)) >>> 0;
      const maj = ((a & b) ^ (a & c) ^ (b & c)) >>> 0;
      const t2 = (sigma0 + maj) | 0;
      h = g;
      g = f;
      f = e;
      e = (d + t1) | 0;
      d = c;
      c = b;
      b = a;
      a = (t1 + t2) | 0;
    }
    H[0] = (a + H[0]) | 0;
    H[1] = (b + H[1]) | 0;
    H[2] = (c + H[2]) | 0;
    H[3] = (d + H[3]) | 0;
    H[4] = (e + H[4]) | 0;
    H[5] = (f + H[5]) | 0;
    H[6] = (g + H[6]) | 0;
    H[7] = (h + H[7]) | 0;
  }

  // Clean up.
  w.fill(0);

  const result = new Uint8Array(32);
  for (let i = 0; i < 8; i++) {
    bigEndian.putUint32(result, H[i], i * 4);
  }
  return result;
}

class BigEndian implements ByteOrder {
  public uint8(data: Uint8Array): number {
    if (data.byteLength === 0) {
      throw new TypeError("Empty byte array");
    }
    return data[data.length - 1];
  }

  public uint16(data: Uint8Array): number {
    if (data.byteLength === 0) {
      throw new TypeError("Empty byte array");
    }
    if (data.byteLength > 1) {
      return (data[data.byteLength - 2] << 8) | data[data.byteLength - 1];
    }
    return data[data.byteLength - 1];
  }

  public uint32(data: Uint8Array): number {
    if (data.byteLength === 0) {
      throw new TypeError("Empty byte array");
    }
    let result = 0;
    for (let i = 0; i < 4; i++) {
      let byte = 0;
      if (data.byteLength - i - 1 >= 0) {
        byte = data[data.byteLength - i - 1];
      }
      result |= byte << (i * 8);
    }
    return result;
  }

  public uint64(data: Uint8Array): bigint {
    if (data.byteLength === 0) {
      throw new TypeError("Empty byte array");
    }
    let result = 0n;
    for (let i = 0; i < 8; i++) {
      let byte = 0n;
      if (data.byteLength - i - 1 >= 0) {
        byte = BigInt(data[data.byteLength - i - 1]);
      }
      result |= byte << BigInt(i * 8);
    }
    return result;
  }

  public putUint8(target: Uint8Array, value: number, offset: number): void {
    if (target.length < 1 + offset) {
      throw new TypeError("Not enough space");
    }
    target[offset] = value;
  }

  public putUint16(target: Uint8Array, value: number, offset: number): void {
    if (target.length < 2 + offset) {
      throw new TypeError("Not enough space");
    }
    target[offset] = value >> 8;
    target[offset + 1] = value & 0xff;
  }

  public putUint32(target: Uint8Array, value: number, offset: number): void {
    if (target.length < 4 + offset) {
      throw new TypeError("Not enough space");
    }
    for (let i = 0; i < 4; i++) {
      target[offset + i] = (value >> ((3 - i) * 8)) & 0xff;
    }
  }

  public putUint64(target: Uint8Array, value: bigint, offset: number): void {
    if (target.length < 8 + offset) {
      throw new TypeError("Not enough space");
    }
    for (let i = 0; i < 8; i++) {
      target[offset + i] = Number((value >> BigInt((7 - i) * 8)) & 0xffn);
    }
  }
}

class LittleEndian implements ByteOrder {
  public uint8(data: Uint8Array): number {
    if (data.byteLength === 0) {
      throw new TypeError("Empty byte array");
    }
    return data[0];
  }

  public uint16(data: Uint8Array): number {
    if (data.byteLength === 0) {
      throw new TypeError("Empty byte array");
    }
    return data[0] | ((data[1] ?? 0) << 8);
  }

  public uint32(data: Uint8Array): number {
    if (data.byteLength === 0) {
      throw new TypeError("Empty byte array");
    }
    let result = 0;
    for (let i = 0; i < 4; i++) {
      result |= (data[i] ?? 0) << (i * 8);
    }
    return result;
  }

  public uint64(data: Uint8Array): bigint {
    if (data.byteLength === 0) {
      throw new TypeError("Empty byte array");
    }
    let result = 0n;
    for (let i = 0; i < 8; i++) {
      const byte = BigInt(data[i] ?? 0);
      result |= byte << BigInt(i * 8);
    }
    return result;
  }

  public putUint8(target: Uint8Array, value: number, offset: number): void {
    if (target.length < 1 + offset) {
      throw new TypeError("Not enough space");
    }
    target[offset] = value;
  }

  public putUint16(target: Uint8Array, value: number, offset: number): void {
    if (target.length < 2 + offset) {
      throw new TypeError("Not enough space");
    }
    target[offset + 1] = value >> 8;
    target[offset] = value & 0xff;
  }

  public putUint32(target: Uint8Array, value: number, offset: number): void {
    if (target.length < 4 + offset) {
      throw new TypeError("Not enough space");
    }
    for (let i = 0; i < 4; i++) {
      target[offset + i] = (value >> (i * 8)) & 0xff;
    }
  }

  public putUint64(target: Uint8Array, value: bigint, offset: number): void {
    if (target.length < 8 + offset) {
      throw new TypeError("Not enough space");
    }
    for (let i = 0; i < 8; i++) {
      target[offset + i] = Number((value >> BigInt(i * 8)) & 0xffn);
    }
  }
}

export const bigEndian = new BigEndian();

export const littleEndian = new LittleEndian();

export interface ByteOrder {
  uint8(data: Uint8Array): number;
  uint16(data: Uint8Array): number;
  uint32(data: Uint8Array): number;
  uint64(data: Uint8Array): bigint;
  putUint8(target: Uint8Array, value: number, offset: number): void;
  putUint16(target: Uint8Array, value: number, offset: number): void;
  putUint32(target: Uint8Array, value: number, offset: number): void;
  putUint64(target: Uint8Array, value: bigint, offset: number): void;
}
