import React from 'react';
import {Image} from 'react-native';
import { Container, Body, Title, Content } from 'native-base'
import {Header} from '../components/ui'
import Onboarding from 'react-native-onboarding-swiper';

export default () => (
    <Container>
        <Header
            title="Hygiene Tips"
        />
        <Onboarding
          showSkip={false}
          showDone={false}
          pages={[
            {
              backgroundColor: '#ffffff',
              image: <Image />,
              title: 'Stay at home',
              subtitle: 'If you’re showing any symptoms, avoid contact with your family and friends',
            },
            {
              backgroundColor: '#ffffff',
              image: <Image />,
              title: 'Avoid touching your face',
              subtitle: 'If you’re out in public, don’t touch your face without washing your hands before and after',
            },
            {
              backgroundColor: '#ffffff',
              image: <Image />,
              title: 'Keep clear of coughing',
              subtitle: 'If you see someone coughing in public, try and keep at least 6 feet away',
            },
            {
              backgroundColor: '#ffffff',
              image: <Image />,
              title: 'Handshakes are cancelled',
              subtitle: 'Instead of shaking hands, try alternatives such as bumping elbows, a foot shake, or just waving',
            },
            {
              backgroundColor: '#ffffff',
              image: <Image />,
              title: 'Keep surfaces clean',
              subtitle: 'Try and sanitize frequently touched surfaces as often as possible',
            },
            {
              backgroundColor: '#ffffff',
              image: <Image />,
              title: 'Work from home',
              subtitle: 'If you are able to work from home, take advantage of it and avoid putting yourself at risk',
            },
          ]}
        />
    </Container>
)
