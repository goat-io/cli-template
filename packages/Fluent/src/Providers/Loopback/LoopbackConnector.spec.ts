import to from 'await-to-js'
import { Fluent } from '../../Fluent'
import { Loopback } from './LoopbackConnector'

const DB = Fluent.model({
  properties: {
    name: undefined,
    remoteConnection: undefined
  },
  methods: {
    table({ name, remoteConnection }) {
      this.name = name
      this.config = {
        remote: remoteConnection
      }
      return this
    }
  }
})()

let testModel
let token = 'w5h8l6pPWJ2ld990xCfApoPW74xKfA'

beforeAll(async () => {
  await Fluent.config({
    REMOTE_CONNECTORS: [
      {
        baseUrl: 'https://suopywgtyuabhru.form.io',
        connector: Loopback,
        default: true,
        name: 'Loopback'
      }
    ]
  })
  testModel = Fluent.model({
    properties: {
      config: {
        remote: {
          path: 'mytestmodel'
        }
      },
      name: 'myTestModel'
    }
  })()
})

it('name should be Private', () => {
  expect(testModel.name).toBe(undefined)
})

it('name should be visible using a getter and composable overwriting properties', () => {
  expect(testModel.getModelName()).toBe('myTestModel')
})

/*
describe('Given a FLUENT Remote Instance', () => {
  before(async () => {
    
  })

 

  it('Should insert Data', async () => {
    let inserted = await testModel.remote({ token }).insert({
      data: {
        name: 'Ignacio',
        age: 29
      }
    })

    let inserted2 = await testModel.remote({ token }).insert({
      data: {
        name: 'Andres',
        age: 15
      }
    })

    expect(inserted._id).to.be.a('string')
    expect(inserted2._id).to.be.a('string')
  })

  it('Should get remote data', async () => {
    let [error, data] = await to(testModel.remote({ token }).get())

    if (error) {
      console.log(error)
      throw new Error('Cannot get remote Model')
    }

    expect(data[0].data.name).toBe('Ignacio')
  })

  it('DB should get data for any local Model', async () => {
    let [error, data] = await to(
      DB.table({
        remoteConnection: {
          baseUrl: 'https://suopywgtyuabhru.form.io',
          path: 'mytestmodel',
          token: undefined
        }
      })
        .remote({ token })
        .all()
    )

    if (error) {
      console.log(error)
      throw new Error('Cannot get remote Model')
    }

    expect(data[0].data.name).toBe('Ignacio')
  })

  it('select() should filter and name specific columns', async () => {
    let [error, data] = await to(
      testModel
        .remote({ token })
        .select('data.name as Name')
        .get()
    )

    if (error) {
      console.log(error)
      throw new Error('Cannot get remote Model')
    }
    expect(data[0].Name).toBe('Ignacio')
  })

  it('pluck() should return a single array', async () => {
    let [error, data] = await to(testModel.remote({ token }).pluck('data.name'))

    if (error) {
      console.log(error)
      throw new Error('Cannot get remote Model')
    }

    expect(data[0]).toBe('Ignacio')
  })

  it('orderBy() should order results desc', async () => {
    let [error, data] = await to(
      testModel
        .remote({ token })
        .select('data.name as Name')
        .orderBy('Name', 'desc')
        .get()
    )

    if (error) {
      console.log(error)
      throw new Error('Cannot get remote Model')
    }

    expect(data[0].Name).toBe('Ignacio')
  })

  it('orderBy() should order results asc', async () => {
    let [error, data] = await to(
      testModel
        .remote({ token })
        .select('data.name as Name')
        .orderBy('Name', 'asc')
        .get()
    )

    if (error) {
      console.log(error)
      throw new Error('Cannot get remote Model')
    }

    expect(data[0].Name).toBe('Andres')
  })

  it('orderBy() should order by Dates with Select()', async () => {
    let [error, data] = await to(
      testModel
        .remote({ token })
        .select('data.name as Name', 'created as created')
        .orderBy('created', 'asc')
        .get()
    )

    if (error) {
      console.log(error)
      throw new Error('Cannot get remote Model')
    }
    expect(data[0].Name).toBe('Ignacio')
  })

  it('orderBy() should order by Dates without Select()', async () => {
    let [error, data] = await to(
      testModel
        .remote({ token })
        .orderBy('created', 'asc')
        .get()
    )

    if (error) {
      console.log(error)
      throw new Error('Cannot get remote Model')
    }

    expect(data[0].data.name).toBe('Ignacio')
  })

  it('limit() should limit the amount of results', async () => {
    let [error, data] = await to(
      testModel
        .remote({ token })
        .select('data.name as Name', 'created as created')
        .orderBy('created', 'asc', 'date')
        .limit(1)
        .get()
    )

    if (error) {
      console.log(error)
      throw new Error('Cannot get remote Model')
    }
    expect(data.length).toBe(1)
  })

  it('offset() should start at the given position', async () => {
    let [error, data] = await to(
      testModel
        .remote({ token })
        .select('data.name as Name', 'created as created')
        .orderBy('created', 'desc')
        .limit(1)
        .offset(1)
        .get()
    )

    if (error) {
      console.log(error)
      throw new Error('Cannot get remote Model')
    }

    expect(data[0].Name).toBe('Andres')
  })

  it('where() should filter the data', async () => {
    let [error, data] = await to(
      testModel
        .remote({ token })
        .where('data.name', '=', 'Andres')
        .select('data.name as Name', 'created as created')
        .get()
    )

    if (error) {
      console.log(error)
      throw new Error('Cannot get remote Model')
    }

    expect(data[0].Name).toBe('Andres')
  })

  it('first() should take the first result from data', async () => {
    let [error, data] = await to(
      testModel
        .remote({ token })
        .where('data.name', '=', 'Ignacio')
        .select('data.name as Name', 'created as created')
        .first()
    )

    if (error) {
      console.log(error)
      throw new Error('Cannot get remote Model')
    }

    expect(data.Name).toBe('Ignacio')
  })

  it('collect() should return the data as collection', async () => {
    let [error, data] = await to(testModel.remote({ token }).collect())

    if (error) {
      console.log(error)
      throw new Error('Cannot get remote Model')
    }

    describe('Collection methods:', () => {
      it('avg() should calculate avg on an obj attribute', () => {
        let avg = data.avg('data.age')

        expect(avg).toBe(22)
      })

      it('chunks() and collapse() an array', () => {
        var chunk = data.chunks(3).get()

        expect(chunk.length).toBe(1)

        // let collapsed = Collection(chunk)
        //  .collapse()
        //  .get();

        //expect(collapsed.length).toBe(2);
      })

      it('concat() should merge two arrays', () => {})
    })
  })

  it('clear() should remove all records from the Model', async () => {
    let [error, data] = await to(testModel.remote({ token }).clear({ sure: true }))

    if (error) {
      console.log(error)
      throw new Error('Cannot get remote Model')
    }

    ;[error, data] = await to(
      testModel
        .remote({ token })
        .select('_id')
        .get()
    )

    if (error) {
      console.log(error)
      throw new Error('Cannot get remote Model')
    }

    expect(data.length).toBe(0)
  })
})
*/
