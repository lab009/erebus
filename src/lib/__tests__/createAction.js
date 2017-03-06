import { fromJS } from 'immutable'

import { mergeOptions } from '../createAction'

it('mergeOptions should exist', () => {
  expect(mergeOptions).toBeTruthy()
})

it('mergeOptions should merge correctly', () => {
  const defaults = {
    foo: 1,
    bar: 2,
  }
  const options = {
    foo: 3,
  }

  expect(mergeOptions(defaults, options)).toEqual({ foo: 3, bar: 2 })
})

it('should apply defaults and convert non reserved functions to values', () => {
  const defaults = {
    collection: false,
  }
  const options = {
    onResponse: () => 'response',
    onError: () => 'error',
    method: 'GET',
    endpoint: params => `${params.string}/test`,
    params: {
      string: '/other',
    },
  }
  const expected = fromJS(options).withMutations((updated) => {
    updated.set('endpoint', '/other/test')
    updated.set('collection', false)
  })

  expect(mergeOptions(defaults, options)).toEqual(expected.toJS())
})
