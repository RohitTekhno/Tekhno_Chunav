
import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, ActivityIndicator, Animated, TouchableOpacity } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';
import axios from 'axios';
import withSidebar from './Withsidebar';
import HeaderFooterLayout from './HeaderFooterLayout';
import { LinearGradient } from 'expo-linear-gradient';
import { BoothUserContext } from './ContextApi/BuserContext';

const { width, height } = Dimensions.get('window');

const scaleFontSize = (size) => Math.round(size * width * 0.0025);

function Newdashuser({ navigation, toggleSidebar }) {
  const [voterCounts, setVoterCounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { buserId } = useContext(BoothUserContext);
  const [totalVoted, setTotalVoted] = useState('000');
  const [totalNVoted, setNTotalVoted] = useState('000');
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const fetchVoterData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://192.168.200.23:8000/api/get_voters_by_user_wise/${buserId}/`);
      // console.log(response)
      const voters = response.data.voters || [];
      // console.log(voters)
      const totalVoters = voters.length;
      // console.log(totalVoters)
      const ours = voters.filter(voter => voter.voter_favour_id === 1).length;
      const against = voters.filter(voter => voter.voter_favour_id === 2).length;
      const doubted = voters.filter(voter => voter.voter_favour_id === 3).length;
      const pending = totalVoters - (ours + against + doubted);

      setVoterCounts({
        total: totalVoters,
        ours: ours,
        against: against,
        doubted: doubted,
        pending: pending,
      });

      const voteCountResponse = await axios.get(
        `http://192.168.200.23:8000/api/get_voted_and_non_voted_count_by_booth_user/${buserId}/`
      );
      setTotalVoted(voteCountResponse.data.voted_count.toString());
      setNTotalVoted(voteCountResponse.data.non_voted_count.toString());

    } catch (error) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    if (buserId) {
      fetchVoterData();
    }
  }, [buserId]);

  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      Animated.timing(rotateAnim).stop();
    }
  }, [loading]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (loading) {
    return (
      <HeaderFooterLayout
        headerText="Dashboard"
        leftIcon={<MaterialIcons name="menu" size={scaleFontSize(28)} color="black" />}
        leftIconAction={toggleSidebar}
        rightIcon={<FontAwesome name="refresh" size={scaleFontSize(28)} color="black" />}
        rightIconAction={fetchVoterData}
      >
        <View style={styles.container}>
          <View style={styles.infoContainer}>
            <Text style={styles.constituencyText}>Washim Constituency</Text>
            <Text style={styles.userIdText}>User Id: {buserId}</Text>
          </View>
          <View style={styles.loadingGraphsContainer}>
            <Animated.View style={[styles.graphWrapper, { transform: [{ rotate }] }]}>
              <Progress.Circle
                size={width * 0.22}
                indeterminate
                thickness={15}
                color="gray"
                unfilledColor="#e0e0e0"
                borderWidth={0}
              />
            </Animated.View>
          </View>
        </View>
      </HeaderFooterLayout>
    );
  }

  if (error) {
    return (
      <HeaderFooterLayout
        headerText="Dashboard"
        leftIcon={<MaterialIcons name="menu" size={scaleFontSize(28)} color="black" />}
        leftIconAction={toggleSidebar}
        rightIcon={<FontAwesome name="refresh" size={scaleFontSize(28)} color="black" />}
        rightIconAction={fetchVoterData}
      >
        <View style={styles.container}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchVoterData}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </HeaderFooterLayout>
    );
  }


  return (
    <HeaderFooterLayout
      headerText="Dashboard"
      leftIcon={<MaterialIcons name="menu" size={scaleFontSize(28)} color="black" />}
      leftIconAction={toggleSidebar}
      rightIcon={<FontAwesome name="refresh" size={scaleFontSize(28)} color="black" />}
      rightIconAction={fetchVoterData}
    >
      {/* <View style={styles.infoContainer}>
        <Text style={styles.constituencyText}>Washim Constituency</Text>
        <Text style={styles.userIdText}>User Id: {buserId}</Text>
      </View> */}

      <View style={styles.totalVotersContainer}>
        <LinearGradient
          colors={['#3C4CAC', '#F04393']}
          locations={[0.3, 1]}
          style={styles.gradient}
        >
          <Text style={styles.gradientText}>Total Voters</Text>
          <Text style={styles.gradientText}>{voterCounts.total}</Text>
        </LinearGradient>
      </View>



      <View style={styles.statsRow}>
        <Pressable style={[styles.statsBox, styles.statsBoxYellow]}
          onPress={() => navigation.navigate('BoothVotedList', { buserId })}>
          <Text style={styles.statsLabel}>Total Voted</Text>
          <Text style={styles.statsValue}>{totalVoted}</Text>
        </Pressable>

        <Pressable style={[styles.statsBox, styles.statsBoxCyan]}
          onPress={() => navigation.navigate('BoothNVoted', { buserId })}>
          <Text style={styles.statsLabel}>Total Non-Voted</Text>
          <Text style={styles.statsValue}>{totalNVoted}</Text>
        </Pressable>
      </View>


      <Text style={styles.overviewText}>Overview</Text>

      <View style={styles.graphsContainer}>
        <View style={styles.row}>
          <View style={styles.graphWrappergreen}>
            <Progress.Circle
              size={width * 0.22}
              progress={voterCounts.ours / voterCounts.total}
              thickness={15}
              showsText
              color="green"
              unfilledColor="#b3ffba"
              borderWidth={0}
              strokeCap="round"
              formatText={() => `${voterCounts.ours}`}
            />
            <Text style={styles.graphText}>Favours</Text>
          </View>
          <View style={styles.graphWrapperyellow}>
            <Progress.Circle
              size={width * 0.22}
              progress={voterCounts.doubted / voterCounts.total}
              thickness={15}
              showsText
              color="#f7ba11"
              unfilledColor="#fff0b3"
              borderWidth={0}
              strokeCap="round"
              formatText={() => `${voterCounts.doubted}`}
            />
            <Text style={styles.graphText}>Doubted</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.graphWrapperred}>
            <Progress.Circle
              size={width * 0.22}
              progress={voterCounts.against / voterCounts.total}
              thickness={15}
              showsText
              color="red"
              unfilledColor="#ffcccc"
              borderWidth={0}
              strokeCap="round"
              formatText={() => `${voterCounts.against}`}
            />
            <Text style={styles.graphText}>Against</Text>
          </View>
          <View style={styles.graphWrapperblack}>
            <Progress.Circle
              size={width * 0.22}
              progress={voterCounts.pending / voterCounts.total}
              thickness={15}
              showsText
              color="black"
              unfilledColor="#bababa"
              borderWidth={0}
              strokeCap="round"
              formatText={() => `${voterCounts.pending}`}
            />
            <Text style={styles.graphText}>Pending</Text>
          </View>
        </View>
      </View>
    </HeaderFooterLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: width * 0.05,
    paddingBottom: height * 0.1,
  },
  infoContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '100%',
    height: height * 0.08,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  constituencyText: {
    fontSize: scaleFontSize(24),
    fontWeight: 'bold',
    color: '#3C4CAC',
    marginBottom: height * 0.01,
  },
  userIdText: {
    fontSize: scaleFontSize(20),
    color: '#000000',
  },
  totalVotersContainer: {
    height: height * 0.13,
    borderRadius: 10,
    width: '100%',
    padding: 20,
  },
  gradient: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: '2%',
    height: '100%',
  },
  gradientText: {
    fontSize: scaleFontSize(20),
    fontWeight: '600',
    textAlign: 'center',
    color: 'white',
  },
  overviewText: {
    fontSize: scaleFontSize(17),
    fontWeight: 'bold',
    color: '#565D6D',
    marginLeft: width * 0.05,
    marginBottom: height * 0.02,
    marginTop: height * 0.03,
  },
  graphsContainer: {
    flex: 1,
    marginBottom: height * 0.1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: height * 0.02,
  },
  graphWrappergreen: {
    backgroundColor: '#D9F4E9',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '10%',
    paddingVertical: '5%',
  },
  graphWrapperyellow: {
    backgroundColor: '#FFFAE1',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '10%',
    paddingVertical: '5%',
  },
  graphWrapperred: {
    backgroundColor: '#FDDDDD',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '10%',
    paddingVertical: '5%',
  },
  graphWrapperblack: {
    backgroundColor: '#DEDEDE',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '10%',
    paddingVertical: '5%',
  },
  graphText: {
    fontSize: scaleFontSize(14),
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: height * 0.01,
  },
  loadingGraphsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  graphWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  errorText: {
    fontSize: scaleFontSize(18),
    color: 'red',
    textAlign: 'center',
  },
  retryText: {
    fontSize: scaleFontSize(16),
    color: '#007BFF',
    textAlign: 'center',
    marginTop: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: height * 0.08,
    marginVertical: "1.8%",
    marginHorizontal: '5%',
    columnGap: 15
  },
  statsBox: {
    flex: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3
  },
  statsBoxBlue: {
    backgroundColor: '#DAE3FF',
  },
  statsBoxGreen: {
    backgroundColor: '#D3FFDB',
  },
  statsBoxYellow: {
    backgroundColor: '#FFEFB2',
  },
  statsBoxCyan: {
    backgroundColor: '#B8F7FE',
  },
  statsLabel: {
    fontSize: width * 0.03,
    fontWeight: '500',
  },
  statsValue: {
    fontSize: width * 0.05,
    fontWeight: '700',
  },
});

export default withSidebar(Newdashuser);
