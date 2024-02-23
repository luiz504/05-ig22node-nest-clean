import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'

import { SendNotificationUseCase } from '~/domain/notification/application/use-cases/send-notification'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository

// SUT: System under test
let sut: SendNotificationUseCase
describe('Send Notification Use Case', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository)
  })
  it('should be able to send a notification', async () => {
    // Act
    const result = await sut.execute({
      recipientId: 'some-recipient-id',
      title: 'Some Notification',
      content: 'Some content',
    })

    // Assert
    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificationsRepository.items[0]).toEqual(
      result.value?.notification,
    )
  })
})
