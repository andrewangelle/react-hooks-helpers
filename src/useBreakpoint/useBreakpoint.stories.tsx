import { useBreakpoint } from './useBreakpoint';

function Story(): JSX.Element {
  return <></>;
}

const Meta = {
  title: 'useBreakpoint',
  component: Story,
};

export function Basic(): JSX.Element | null {
  const breakpoint = useBreakpoint();

  return (
    <div>
      <div>Resize the window!</div>
      <div>{`Current breakpoint is: ${breakpoint}`}</div>
    </div>
  );
}

export default Meta;
