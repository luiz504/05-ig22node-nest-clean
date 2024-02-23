import { makeNotification } from 'test/factories/make-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { UniqueEntityID } from '~/core/entities/unique-entity-id'
import { NotAllowedError } from '~/core/errors/not-allowed-error'
import { ReadNotificationUseCase } from '~/domain/notification/application/use-cases/read-notification'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository

// SUT: System under test
let sut: ReadNotificationUseCase
describe('Read Notification Use Case', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository)
  })
  it('should be able to read a notification', async () => {
    // Prepare
    const notification = makeNotification()

    await inMemoryNotificationsRepository.create(notification)

    // Act
    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString(),
    })

    // Assert
    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificationsRepository.items[0].readAt).toEqual(
      expect.any(Date),
    )
  })
  it('should not be able to read an notification, from another author', async () => {
    // Prepare
    const newNotification = makeNotification(
      {
        recipientId: new UniqueEntityID('bruce-bennet'),
      },
      new UniqueEntityID('notification-x'),
    )

    await inMemoryNotificationsRepository.create(newNotification)

    // Act
    const result = await sut.execute({
      recipientId: 'recipient-x',
      notificationId: 'notification-x',
    })

    // Assert
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
