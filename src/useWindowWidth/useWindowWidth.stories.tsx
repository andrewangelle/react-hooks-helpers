import { useWindowWidth } from './useWindowWidth';

const Meta = {
  title: 'useWindowWidth',
  component: () => null,
};

export function Basic(): JSX.Element {
  const width = useWindowWidth();
  return <div>{`Window's width is ${width}px`}</div>;
}

export default Meta;
