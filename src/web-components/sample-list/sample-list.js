import { h, customElement } from 'atomico'
import patterns from './patterns'

const SampleList = props => {
  const { items, needle } = props
  const upperNeedle = needle.toUpperCase()
  const found = v => v.indexOf(upperNeedle) > -1
  return (
    <host shadowDom>
      <ul style="list-style-type: none; margin: 0; padding: 6px;">
        {items.filter(found).map((val, idx) => {
          return <li key={idx}>{val}</li>
        })}
      </ul>
    </host>
  )
}

SampleList.props = {
  items: {
    type: Array,
    get value () {
      return Object.keys(patterns)
    }
  },
  needle: {
    type: String,
    get value () {
      return ''
    }
  }
}

export default customElement('sample-list', SampleList)
