import React, { useCallback } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { FontAwesome } from '@expo/vector-icons';
import { slides } from '../constants/slides';

interface OnboardingProps {
  onDone: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onDone }) => {
  const renderItem = useCallback(({ item }: { item: typeof slides[0] }) => (
    <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
      <Text style={styles.title}>{item.title}</Text>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.text}>{item.text}</Text>
    </View>
  ), []);

  const renderButton = (name: string) => (
    <View style={styles.buttonCircle}>
      <FontAwesome name={name as any} color="rgba(255, 255, 255, .9)" size={24} />
    </View>
  );

  return (
    <AppIntroSlider
      keyExtractor={(item) => item.key}
      renderItem={renderItem}
      data={slides}
      onDone={onDone}
      renderNextButton={() => renderButton('arrow-right')}
      renderDoneButton={() => renderButton('check')}
      showSkipButton
      showPrevButton
    />
  );
};

const styles = StyleSheet.create({
  buttonCircle: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginVertical: 32,
    tintColor: 'white',
  },
  text: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});

export default Onboarding;
