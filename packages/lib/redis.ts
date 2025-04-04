import { requestly, type Requestly } from "requestly";

export class Redis {
  private client: Requestly;

  constructor({
    username,
    password,
    domain,
  }: {
    username: string;
    password: string;
    domain: string;
  }) {
    this.client = requestly.create({
      baseUrl: `https://${domain}/api`,
      headers: {
        authorization: `Basic ${btoa(`${username}:${password}`)}`,
      },
    });
  }

  private async execute(command: `${string} ${string}`) {
    return this.client.post<{
      result: string | number | null | (string | null | number)[];
    }>("/", {
      body: command.split(" "),
    });
  }

  async keys(pattern: string) {
    const response = await this.execute(`KEYS ${pattern}`);

    return response.data.result as string[];
  }

  async sadd(key: string, value: string) {
    const response = await this.execute(`SADD ${key} ${value}`);

    return response.data.result === 1 || response.data.result === 0;
  }

  async scard(key: string) {
    const response = await this.execute(`SCARD ${key}`);

    return response.data.result as number;
  }

  async saddex(key: string, value: string, expire: number) {
    const response = await this.execute(`SADDEX ${key} ${expire} ${value}`);

    return response.data.result === 1 || response.data.result === 0;
  }

  async get<T extends string | number | string[] | number[] | null>(
    key: string,
  ) {
    const response = await this.execute(`GET ${key}`);

    return response.data.result as T;
  }

  async set(key: string, value: string, ttl?: number) {
    let cmd = `SET ${key} ${value}` as const;

    if (ttl) {
      cmd = `${cmd} EX ${ttl}`;
    }

    const response = await this.execute(cmd);

    return response.data.result === "OK";
  }

  async del(key: string) {
    const response = await this.execute(`DEL ${key}`);

    return response.data.result === 1;
  }

  async expire(key: string, ttl: number) {
    const response = await this.execute(`EXPIRE ${key} ${ttl}`);

    return response.data.result === 1;
  }
}
