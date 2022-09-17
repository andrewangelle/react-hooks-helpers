import { useAsyncScript } from './useAsyncScript';

const successUrl = 'https://example.com/?default=true';

function Story(): JSX.Element {
  return <></>;
}

const Meta = {
  title: 'useAsyncScript',
  component: Story,
};

export function Basic(): JSX.Element | null {
  const { loading, done } = useAsyncScript(successUrl);

  if (loading) {
    return <>Loading...</>;
  }

  if (done) {
    return <>Script complete</>;
  }

  return null;
}

export default Meta;
