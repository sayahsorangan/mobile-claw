import React, {useEffect} from 'react';

import {Lotties} from '@app/assets/animations';
import {useAppSelector} from '@app/hooks/redux';
import {Box} from '@app/themes';
import {Container} from '@components/container';
import {MascotText} from '@components/mascot-text';
import {translate} from '@i18n';
import {Navigation} from '@router/navigation-helper';
import {Route} from '@router/route-name';

const REACTION_DELAY_MS = 2200;

const EXPERIENCE_RESPONSE_KEYS: Record<string, string> = {
  'no-prior-knowledge': 'onboarding.mascotReaction.responses.noPriorKnowledge',
  'heard-about-it': 'onboarding.mascotReaction.responses.heardAboutIt',
  'know-basics': 'onboarding.mascotReaction.responses.knowBasics',
  'practical-experience': 'onboarding.mascotReaction.responses.practicalExperience',
  'worked-several-times': 'onboarding.mascotReaction.responses.workedSeveralTimes',
  'very-familiar': 'onboarding.mascotReaction.responses.veryFamiliar',
  'higher-level-directly': 'onboarding.mascotReaction.responses.higherLevelDirectly',
  'no-practical-experience': 'onboarding.mascotReaction.responses.noPracticalExperience',
};

const MascotReactionScreen = () => {
  const t = translate;
  const selectedExperienceId = useAppSelector(state => state.OnboardingReducer.selectedExperienceId);

  const messageKey =
    selectedExperienceId && EXPERIENCE_RESPONSE_KEYS[selectedExperienceId]
      ? EXPERIENCE_RESPONSE_KEYS[selectedExperienceId]
      : 'onboarding.mascotReaction.responses.fallback';

  useEffect(() => {
    const timer = setTimeout(() => {
      Navigation.navigate(Route.level_hypothesis);
    }, REACTION_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Container>
      <Box flex={1} padding={'md'} paddingBottom={'xl'} justifyContent={'center'} alignItems={'center'}>
        <MascotText lottieAnimation={Lotties.main_mascot} text={t(messageKey as any)} />
      </Box>
    </Container>
  );
};

export {MascotReactionScreen};
