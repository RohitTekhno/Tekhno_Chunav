import React, { useContext } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { VoterContext } from './VoterContext';

const { width } = Dimensions.get('window');

export default function Percentage() {
  const { voters } = useContext(VoterContext);

  const totalVoters = voters.length;
  const favorableVoters = voters.filter(voter => voter.color === 'green').length;
  const oppositionVoters = voters.filter(voter => voter.color === 'red').length;
  const doubtedVoters = voters.filter(voter => voter.color === 'yellow').length;
  const nonVoters = voters.filter(voter => voter.color === '#f7f5fa' || !voter.color).length;
  
  const totalVotesCast = favorableVoters + oppositionVoters;
  const winningPercentage = totalVotesCast > 0 ? ((favorableVoters / totalVotesCast) * 100).toFixed(2) : 0;

  return (
    <LinearGradient
      colors={['#FF9933', '#FFFFFF', '#138808']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>Winning Percentage</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Total Voters: {totalVoters}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Favorable Voters: {favorableVoters}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Opposition Voters: {oppositionVoters}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Doubted Voters: {doubtedVoters}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Non-Voters: {nonVoters}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Winning Chances: {winningPercentage}%</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: 'black',
    width: '100%',
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoBox: {
    width: width * 0.8,
    height: width * 0.2,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 5,
  },
  infoText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
