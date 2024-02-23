import { WatchedList } from '~/core/entities/watched-list'

class NumberWatchedList extends WatchedList<number> {
  compareItems(a: number, b: number): boolean {
    return a === b
  }
}

describe('watched-list', () => {
  it('should be able to create a watched list with initial items', () => {
    // Act
    const list = new NumberWatchedList([1, 2, 3])

    // Assert
    expect(list.currentItems).toHaveLength(3)
    expect(list.getItems()).toEqual([1, 2, 3])
  })

  it('should be able to add a new item to the list', () => {
    // Prepare
    const list = new NumberWatchedList([1, 2, 3])

    // Act

    list.add(4)

    // Assert
    expect(list.currentItems).toHaveLength(4)
    expect(list.getNewItems()).toEqual([4])
  })

  it('should be able to remove a item to the list', () => {
    // Prepare
    const list = new NumberWatchedList([1, 2, 3])

    // Act

    list.remove(2)

    // Assert
    expect(list.currentItems).toHaveLength(2)
    expect(list.getRemovedItems()).toEqual([2])
  })

  it('should be able to add an item even if it was removed before', () => {
    // Prepare
    const list = new NumberWatchedList([1, 2, 3])

    // Act
    list.remove(2)
    list.add(2)

    // Assert
    expect(list.currentItems).toHaveLength(3)
    expect(list.getRemovedItems()).toEqual([])
    expect(list.getNewItems()).toEqual([])
  })

  it('should be able to remove an item even if it was added before', () => {
    // Prepare
    const list = new NumberWatchedList([1, 2, 3])

    // Act
    list.add(4)
    list.remove(4)

    // Assert
    expect(list.currentItems).toHaveLength(3)
    expect(list.getRemovedItems()).toEqual([])
    expect(list.getNewItems()).toEqual([])
  })

  it('should be able to update watched list items', () => {
    // Prepare
    const list = new NumberWatchedList([1, 2, 3])

    // Act
    list.update([1, 3, 5, 7])

    // Assert
    expect(list.currentItems).toHaveLength(4)
    expect(list.getRemovedItems()).toEqual([2])
    expect(list.getNewItems()).toEqual([5, 7])
  })
})
