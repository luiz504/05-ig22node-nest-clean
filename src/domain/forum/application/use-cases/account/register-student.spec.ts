import { RegisterStudentUseCase } from '~/domain/forum/application/use-cases/account/register-student'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakerHasher: FakeHasher
// SUT: System under test
let sut: RegisterStudentUseCase
describe('Register Student Use Case', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakerHasher = new FakeHasher()
    sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakerHasher)
  })
  it('should be able to register a new Student', async () => {
    // Act
    const result = await sut.execute({
      name: 'John doe',
      email: 'john@example.com',
      password: '123456',
    })

    // Assert
    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      student: inMemoryStudentsRepository.items[0],
    })
  })

  it('should hash student password', async () => {
    // Act
    const result = await sut.execute({
      name: 'John doe',
      email: 'john@example.com',
      password: '123456',
    })
    const hashedPassword = await fakerHasher.hash('123456')
    // Assert
    expect(result.isRight()).toBe(true)
    expect(inMemoryStudentsRepository.items[0].password).toEqual(hashedPassword)
  })
})
