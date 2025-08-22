import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface InfoTextProps {
  text: string;
}

const InfoText: React.FC<InfoTextProps> = ({ text }) => (
  <View style={styles.container}>
    <Text style={styles.infoText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  infoText: {
    fontSize: 16,
    color: "#5A5A5A",
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default InfoText;
