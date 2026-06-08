import React, {useEffect} from 'react';

import {Lotties} from '@app/assets/animations';
import {Box} from '@app/themes';
import {Container} from '@components/container';
import {MascotText} from '@components/mascot-text';
import {translate} from '@i18n';
import {Navigation} from '@router/navigation-helper';
import {Route} from '@router/route-name';

const TRANSITION_DELAY_MS = 2400;

const TransitionMotivationScreen = () => {
  const t = translate;

  useEffect(() => {
    const timer = setTimeout(() => {
      Navigation.navigate(Route.time_commitment);
    }, TRANSITION_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Container>
      <Box flex={1} justifyContent={'center'} alignItems={'center'} padding={'md'}>
        <MascotText lottieAnimation={Lotties.main_mascot} text={t('onboarding.transitionMotivation.message')} />
      </Box>
    </Container>
  );
};

export {TransitionMotivationScreen};
