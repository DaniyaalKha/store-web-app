import { hash, verify, type Options } from "@node-rs/argon2";

const options: Options = {
  memoryCost: 65536, // 64 MB
  timeCost: 3,
  parallelism: 4,
  outputLen: 32,
  algorithm: 2, // Argon2id
};

export async function hashPassword(password: string): Promise<string> {
  return hash(password, options);
}

export async function verifyPassword({
  password,
  hash: hashedPassword,
}: {
  password: string;
  hash: string;
}): Promise<boolean> {
  return verify(hashedPassword, password, options);
}
