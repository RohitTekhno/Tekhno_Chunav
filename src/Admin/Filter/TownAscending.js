import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator, Animated } from 'react-native';
import HeaderFooterLayout from '../ReusableCompo/HeaderFooterLayout';
import axios from 'axios';

export default function TownAscending() {
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    fetchTownData();

    // Auto-refresh every 30 seconds
    const intervalId = setInterval(() => {
      fetchTownData();
    }, 60000);

    return () => clearInterval(intervalId); // Cleanup the interval on unmount
  }, []);

  const toTitleCase = (str) => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const fetchTownData = () => {
    setLoading(true);
    axios.get('http://192.168.200.23:8000/api/town_voting_percentage/')
      .then(response => {
        const sortedData = response.data.sort((a, b) => a.voted_percentage - b.voted_percentage);
        setData(sortedData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  const filteredData = data.filter((item) =>
    item.town_name.toLowerCase().includes(searchText.toLowerCase())
  );

  const getStageColor = (percentage) => {
    if (percentage <= 0) return 'red';
    if (percentage <= 2) return 'yellow';
    return 'green';
  };

  const renderItem = ({ item }) => {
    const color = getStageColor(item.voted_percentage);

    // Same animated effect for the border
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        })
      ])
    ).start();

    const borderColor = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['#fff', color], // Transition from white to the stage color
    });

    return (
      <TouchableOpacity style={[styles.card, { borderBottomColor: color, borderBottomWidth: 4 }]}>
        <View style={styles.leftSection}>
          <Text style={styles.cardTitle}>Town ID: {item.town_id}</Text>
          <Text style={styles.cardDescription}>Town Name: {toTitleCase(item.town_name)}</Text>
        </View>
        <View style={styles.rightSection}>
          <Text style={styles.cardTitle}>{item.voted_percentage}%</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <HeaderFooterLayout
      headerText='Town Analysis'
      showFooter={false}
    >
      <View style={styles.container}>
        {/* Search Bar */}
        <TextInput
          style={styles.searchBar}
          placeholder="Search Towns..."
          value={searchText}
          onChangeText={setSearchText}
        />

        {/* Show loading spinner while data is being fetched */}
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.town_id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.flatListContent}
            refreshing={refreshing}
            onRefresh={fetchTownData}
          />
        )}
      </View>
    </HeaderFooterLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
    borderBottomWidth: 4, // Will be controlled by the percentage stage color
  },
  leftSection: {
    flex: 1,
    width: '70%',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
  },
  flatListContent: {
    paddingBottom: 20,
  },
});
