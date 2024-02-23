import { Slug } from './slug'

it('should be able to create a new slug from text', () => {
  const slug = Slug.createFromText('Example Slug 5-4##  ')
  expect(slug.value).toEqual('example-slug-5-4')
})
