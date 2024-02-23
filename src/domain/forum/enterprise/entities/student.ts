import { Entity } from '~/core/entities/entity'
import { UniqueEntityID } from '~/core/entities/unique-entity-id'

interface StudentProps {
  name: string
}
export class Student extends Entity<StudentProps> {
  get name(): string {
    return this.name
  }

  static create(props: StudentProps, id?: UniqueEntityID) {
    const student = new Student({ ...props }, id)

    return student
  }
}
