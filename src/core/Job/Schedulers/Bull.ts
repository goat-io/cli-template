import * as Bull from 'bull'
import Redis from 'ioredis'
import { For } from '../../../Helpers/For'
import { IJob, IJobDescription, RepeatEvery, TimeZones } from '../Job'

export enum BullCronTimes {
  never = 'never',
  second = '* * * * * *',
  minute = '*/1 * * * *',
  minutes5 = '*/5 * * * *',
  minutes10 = '*/10 * * * *',
  minutes20 = '*/20 * * * *',
  minutes30 = '*/30 * * * *',
  minutes40 = '*/40 * * * *',
  minutes50 = '*/50 * * * *',
  hour = '0 */1 * * *',
  hours2 = '0 */2 * * *',
  hours3 = '0 */3 * * *',
  hours4 = '0 */4 * * *',
  hours5 = '0 */5 * * *',
  hours6 = '0 */6 * * *',
  hours7 = '0 */7 * * *',
  hours8 = '0 */8 * * *',
  hours9 = '0 */9 * * *',
  hours10 = '0 */10 * * *'
}

export enum BullTimeZones {
  EuropeStockholm = 'Europe/Stockholm'
}

const getCronString = (cronTime: RepeatEvery): BullCronTimes => {
  return BullCronTimes[cronTime]
}

const getTimezoneString = (timeZone: TimeZones): BullTimeZones => {
  return BullTimeZones[timeZone]
}

const getRedisInstance = () => {
  return new Redis({
    db: 0,
    family: 4, // 4 (IPv4) or 6 (IPv6)
    host: process.env.REDIS_HOST || '127.0.0.1',
    password: process.env.REDIS_PASSWORD || undefined,
    port: Number(process.env.REDIS_PORT) || 6379
  })
}

const client = getRedisInstance()
const subscriber = getRedisInstance()

const opts = {
  createClient(type) {
    switch (type) {
      case 'client':
        return client
      case 'subscriber':
        return subscriber
      default:
        return getRedisInstance()
    }
  }
}

export const BullScheduler = (() => {
  /**
   *
   * @param options
   */
  const schedule = async (options: IJob) => {
    const croneString = getCronString((options.repeat && options.repeat.cronTime) || RepeatEvery.never)
    const timezoneString = getTimezoneString((options.repeat && options.repeat.timeZone) || TimeZones.EuropeStockholm)

    const queue = new Bull.default(options.jobName, opts)

    let queueOptions: any = { repeat: { cron: croneString, tz: timezoneString } }

    if (croneString === BullCronTimes.never) {
      queueOptions = {}
    }

    queue.add(options.data, queueOptions)

    queue.process(async job => {
      const jobDescription: IJobDescription = {
        data: job.data,
        id: String(job.id),
        instance: job,
        name: job.name
      }

      const [error] = await For.async(options.handle(jobDescription))
      if (error) {
        console.log('error', error)
        console.log('Could not process the job', jobDescription)
      }
    })

    return queue
  }
  return Object.freeze({ schedule })
})()
