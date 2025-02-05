import React from 'react';
import { styled } from 'styled-components';
import {
  DirectionProps,
  JoystickArrowProps,
  directionMap,
  textColorMap,
  typeMap,
} from './types';
import { theme } from '../../../themes/theme.styled';
import { Typography, Image, Container } from '../../atoms';
import { UtilsProps } from '../../utils';

export const Indicator = styled.div<DirectionProps>`
  width: 16px;
  height: 16px;
  border-radius: 8px;
  background: ${props => {
    if (props.state === 'completed') return theme.palette.success.main;
    if (props.state === 'selected') return theme.palette.golden;
    return 'transparent';
  }};
  ${props =>
    props.state === 'unselected' &&
    `border: 2px solid ${theme.palette.text.muted};`}
`;

Indicator.defaultProps = {
  state: 'unselected',
};

export const Circle = styled.div`
  width: 156px;
  height: 156px;
  border: 1px solid ${theme.palette.border.popup};
  background: ${theme.palette.background.input};
  border-radius: 78px;
  position: relative;
`;

export const Text: React.FC<{ text: string } & DirectionProps> = props => {
  const { text, state = 'unselected' } = props;
  return (
    <Typography variant="h6" font="medium" color={textColorMap[state] as any}>
      {text}
    </Typography>
  );
};

export const JoystickArrow: React.FC<JoystickArrowProps> = props => {
  const { type, state = 'unselected' } = props;
  return (
    <Image
      src={typeMap[state]}
      alt="Arrow"
      position="absolute"
      {...directionMap[type]}
    />
  );
};

export const Ring: React.FC<UtilsProps> = ({ children, ...props }) => (
  <Container height={120} width={120} $bgColor="golden" rounded={60} {...props}>
    <Container height={116} width={116} $bgColor="primary" rounded={58}>
      {children}
    </Container>
  </Container>
);
