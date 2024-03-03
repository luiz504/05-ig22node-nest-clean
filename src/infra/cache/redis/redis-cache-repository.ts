import { Injectable } from '@nestjs/common'
import { CacheRepository } from '~/infra/cache/cache-repository'
import { RedisService } from '~/infra/cache/redis/redis.service'

@Injectable()
export class RedisCacheRepository implements CacheRepository {
  constructor(private redis: RedisService) {}
  async set(key: string, value: string): Promise<void> {
    const expires = 60 * 15 // 15min expiration
    await this.redis.set(key, value, 'EX', expires)
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key)
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key)
  }
}
