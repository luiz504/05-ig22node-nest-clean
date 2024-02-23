import { AggregateRoot } from '~/core/entities/aggregate-root'
import { UniqueEntityID } from '~/core/entities/unique-entity-id'
import { DomainEvent } from '~/core/events/domain-event'
import { DomainEvents } from '~/core/events/domain-events'
class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date
  private aggregate: CustomAggregate //eslint-disable-line 
  constructor(aggregate: CustomAggregate) {
    this.ocurredAt = new Date()
    this.aggregate = aggregate
  }

  public getAggregateId(): UniqueEntityID {
    return this.aggregate.id
  }
}
class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null)
    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))
    return aggregate
  }
}

describe('Domain Events', () => {
  it('should be able to dispatch and listen to events', () => {
    const callbackSpy = vi.fn()
    // Prepare => Subscribing
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

    // Act
    const aggregate = CustomAggregate.create()
    // Assert
    expect(aggregate.domainEvents).toHaveLength(1)

    // Act
    DomainEvents.dispatchEventsForAggregate(aggregate.id)
    // Assert
    expect(callbackSpy).toBeCalledTimes(1)
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
