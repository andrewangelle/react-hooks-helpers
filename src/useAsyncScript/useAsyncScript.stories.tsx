import { useAsyncScript } from './useAsyncScript';

const successUrl = 'https://example.com/?default=true';
const errorUrl = 'https://example.com/?error=true';

function Story(): JSX.Element {
  return <></>;
}

const Meta = {
  title: 'useAsyncScript',
  component: Story,
};

export function Success(): JSX.Element | null {
  const { loading, done } = useAsyncScript(successUrl);

  if (loading) {
    return <>Loading...</>;
  }

  if (done) {
    return <>Script complete</>;
  }

  return null;
}

export function Error(): JSX.Element | null {
  const { loading, error } = useAsyncScript(errorUrl);

  if (loading) {
    return <>Loading...</>;
  }

  if (error) {
    return <>Script errored</>;
  }

  return null;
}

export default Meta;
