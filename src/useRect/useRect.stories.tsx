import { CSSProperties, useRef } from 'react';
import { domRectProps } from './observeRect';
import { useRect } from './useRect';

const Meta = {
  title: 'useRect',
  component: () => null,
};

export function Basic(): JSX.Element {
  const ref1 = useRef<HTMLDivElement | null>(null);
  const ref2 = useRef<HTMLDivElement | null>(null);
  const ref3 = useRef<HTMLDivElement | null>(null);
  const rect1 = useRect(ref1);
  const rect2 = useRect(ref2);
  const rect3 = useRect(ref3);

  const containerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    height: '200vh',
    padding: '30px 60px',
  };

  const box1Styles: CSSProperties = {
    position: 'relative',
    border: '1px solid green',
    display: 'flex',
    flexDirection: 'column',
    height: '80%',
    width: '25%',
    justifyContent: 'center',
  };

  const box2Styles: CSSProperties = {
    position: 'relative',
    border: '1px solid blue',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    height: '25%',
    width: '25%',
  };

  const box3Styles: CSSProperties = {
    position: 'relative',
    border: '1px solid red',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    height: '50%',
    width: '25%',
  };

  return (
    <div style={containerStyles}>
      <div ref={ref1} style={box1Styles}>
        {domRectProps.map((key, index) => {
          return (
            <div key={`${index}-1`}>
              {`${key}: ${(rect1 && (rect1[key] as number)) ?? ''}`}
            </div>
          );
        })}
      </div>

      <div ref={ref2} style={box2Styles}>
        {domRectProps.map((key, index) => {
          return (
            <div key={`${index}-2`}>
              <div>{`${key}: ${(rect2 && (rect2[key] as number)) ?? ''}`}</div>
            </div>
          );
        })}
      </div>

      <div ref={ref3} style={box3Styles}>
        {domRectProps.map((key, index) => {
          return (
            <div key={`${index}-3`}>
              {`${key}: ${(rect3 && (rect3[key] as number)) ?? ''}`}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Meta;
