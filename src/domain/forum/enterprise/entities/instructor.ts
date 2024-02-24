import { Entity } from '~/core/entities/entity'
import { UniqueEntityID } from '~/core/entities/unique-entity-id'

interface InstructorProps {
  name: string
  email: string
  password: string
}
export class Instructor extends Entity<InstructorProps> {
  get name(): string {
    return this.props.name
  }

  get email(): string {
    return this.props.email
  }

  get password(): string {
    return this.props.password
  }

  static create(props: InstructorProps, id?: UniqueEntityID) {
    const instructor = new Instructor({ ...props }, id)

    return instructor
  }
}
