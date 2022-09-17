import { useOutsideClick } from './useOutsideClick';

function Story(): JSX.Element {
  const callback = (): void => {
    alert('Clicked outside of the button')
  }
  const ref = useOutsideClick(callback)
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }}
    >
      <button ref={ref}>Click outside of me</button>
    </div>
  )
}

const Meta = {
  title: 'useOutsideClick',
  component: Story
}

export const Basic = {
  ...Meta
}

export default Meta