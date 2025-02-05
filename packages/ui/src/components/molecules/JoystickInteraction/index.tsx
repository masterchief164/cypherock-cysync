import React from 'react';
import { Circle, Indicator, JoystickArrow, Ring, Text } from './Elements';
import { JoystickInteractionProps } from './types';
import { Container, Typography } from '../../atoms';

const CenterClickPrompt: React.FC = () => (
  <Container height={192} position="relative">
    <Ring
      position="absolute"
      $animDelay={0.6}
      animate="pulse"
      $animDuration={2}
    />
    <Ring position="absolute" animate="pulse" $animDuration={2} />
    <Ring position="absolute">
      <Container gap={8} direction="column">
        <Container width={12} height={12} rounded={6} $bgColor="golden" />
        <Typography variant="h5" color="gold">
          Press
        </Typography>
      </Container>
    </Ring>
  </Container>
);

const DirectionButtonPrompt: React.FC<JoystickInteractionProps> = ({
  down,
  left,
  right,
  up,
}) => (
  <>
    <Container>
      <Container gap={8} direction="column">
        <Text text="Up" state={up} />
        <Indicator state={up} />
      </Container>
    </Container>
    <Container gap={12}>
      <Container justify="flex-end" width={66} gap={8}>
        <Text text="Left" state={left} />
        <Indicator state={left} />
      </Container>
      <Circle>
        <JoystickArrow type="up" state={up} />
        <JoystickArrow type="right" state={right} />
        <Container
          width={14}
          height={14}
          rounded={7}
          $bgColor="muted"
          position="absolute"
          top={0.5}
          left={0.5}
          $translateX={-0.5}
          $translateY={-0.5}
        />
        <JoystickArrow type="down" state={down} />
        <JoystickArrow type="left" state={left} />
      </Circle>
      <Container justify="flex-start" width={66} gap={8}>
        <Indicator state={right} />
        <Text text="Right" state={right} />
      </Container>
    </Container>
    <Container>
      <Container gap={8} direction="column">
        <Indicator state={down} />
        <Text text="Down" state={down} />
      </Container>
    </Container>
  </>
);

export const JoystickInteraction: React.FC<JoystickInteractionProps> = ({
  up,
  right,
  down,
  left,
  center,
}) => (
  <Container mb={7} display="flex" direction="column" gap={12}>
    {center === undefined && (
      <DirectionButtonPrompt down={down} left={left} right={right} up={up} />
    )}
    {center !== undefined && <CenterClickPrompt />}
  </Container>
);

export type { JoystickInteractionProps };
