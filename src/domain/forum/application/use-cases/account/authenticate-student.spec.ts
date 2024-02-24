import { AuthenticateStudentUseCase } from '~/domain/forum/application/use-cases/account/authenticate-student'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { makeStudent } from 'test/factories/make-student'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakerHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
// SUT: System under test
let sut: AuthenticateStudentUseCase
describe('Authenticate Student Use Case', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakerHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateStudentUseCase(
      inMemoryStudentsRepository,
      fakerHasher,
      fakeEncrypter,
    )
  })
  const credentials = { email: 'john@example.com', password: '123456' }
  it('should be able to authenticate a Student', async () => {
    // Prepare
    const student = makeStudent({
      email: credentials.email,
      password: await fakerHasher.hash(credentials.password),
    })

    inMemoryStudentsRepository.create(student)
    // Act
    const result = await sut.execute(credentials)

    // Assert
    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})
