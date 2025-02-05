import { css } from 'styled-components';
import { theme } from '../../themes/theme.styled';
import { BreakPoint } from '../../themes/screens.styled';

const spacingObj = {
  0: '0px',
  1: theme.spacing.one.spacing,
  2: theme.spacing.two.spacing,
  3: theme.spacing.three.spacing,
  4: theme.spacing.four.spacing,
  5: theme.spacing.five.spacing,
  6: theme.spacing.six.spacing,
  7: theme.spacing.seven.spacing,
  8: theme.spacing.eight.spacing,
  auto: 'auto',
};
type SpacingOptions = keyof typeof spacingObj;

type MediaQuery<T> = Partial<Record<BreakPoint, T>> | T;

type SpacingType<T extends string> =
  | `${T}b`
  | `${T}r`
  | `${T}l`
  | `${T}t`
  | `${T}`
  | `${T}x`
  | `${T}y`;

export type SpacingProps = {
  [key in SpacingType<'m'> | SpacingType<'p'>]?: MediaQuery<SpacingOptions>;
};

const cssMap: Record<string, string[]> = {
  m: ['margin'],
  p: ['padding'],
  l: ['left'],
  r: ['right'],
  x: ['left', 'right'],
  t: ['top'],
  b: ['bottom'],
  y: ['top', 'bottom'],
};

export const spacing = css<SpacingProps>`
  ${props => {
    const finalCss = [];

    for (const key in props) {
      if (Object.prototype.hasOwnProperty.call(props, key)) {
        finalCss.push(
          ...getCss(getProperties(key as any), (props as any)[key]),
        );
      }
    }

    return finalCss.length ? finalCss.join(' ') : null;
  }}
`;

const getProperties = (key: SpacingType<'m'> | SpacingType<'p'>) => {
  const [first, second] = key.split('');
  const properties = [];
  for (const i of cssMap[first] ?? []) {
    if (second) {
      for (const j of cssMap[second] ?? []) {
        properties.push(`${i}-${j}`);
      }
    } else {
      properties.push(i);
    }
  }
  return properties;
};

const getCss = (names: string[], obj?: MediaQuery<SpacingOptions>) => {
  const result: any = [];
  if (obj) {
    if (typeof obj === 'object') {
      for (const bp in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, bp)) {
          const value = obj[bp as BreakPoint] as SpacingOptions;
          names.forEach(name => {
            result.push(`
              @media ${theme.screens[bp as BreakPoint]} {
                ${name}: ${spacingObj[value]};
              }
            `);
          });
        }
      }
    } else {
      names.forEach(name => {
        result.push(`${name}: ${spacingObj[obj]};`);
      });
    }
  }
  return result;
};
