import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Animated, Easing, Modal, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import HeaderFooterLayout from './HeaderFooterLayout';
import axios from 'axios';
import { BoothUserContext } from './ContextApi/BuserContext';

export default function Familylist({ navigation }) {
  const { buserId } = useContext(BoothUserContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [arrowAnimations, setArrowAnimations] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [members, setMembers] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const fetchFamilyGroups = async () => {
      try {
        const response = await axios.get(`http://192.168.200.23:8000/api/get_family_groups_by_user/${buserId}/`);
        if (response.status === 200) {
          const familyGroups = await Promise.all(response.data.map(async (group) => {

            const membersResponse = await axios.get(`http://192.168.200.23:8000/api/get_voters_by_group_id/${group.family_group_id}/`);
            const membersCount = membersResponse.status === 200 ? membersResponse.data.voters.length : 0;
            return {
              ...group,
              member_count: membersCount,
            };
          }));
          setData(familyGroups);
          initializeArrowAnimations(familyGroups);
        } else {
          setError('Data not found');
        }
      } catch (error) {
        console.error('Error fetching family group data:', error);
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    const initializeArrowAnimations = (groups) => {
      const animations = {};
      groups.forEach((group) => {
        animations[group.family_group_id] = new Animated.Value(0);
      });
      setArrowAnimations(animations);
    };

    if (buserId) {
      fetchFamilyGroups();
    } else {
      setError('Invalid user ID');
      setLoading(false);
    }
  }, [buserId]);

  const handlePress = async (id) => {
    setSelectedId(selectedId === id ? null : id);

    Animated.timing(arrowAnimations[id], {
      toValue: selectedId === id ? 0 : 1,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

    if (selectedId !== id) {
      setModalLoading(true);
      setModalVisible(true);
      try {
        const response = await axios.get(`http://192.168.200.23:8000/api/get_voters_by_group_id/${id}/`);
        if (response.status === 200) {
          setMembers(response.data.voters);
        }
      } catch (error) {
        console.error('Error fetching voters:', error);
      } finally {
        setModalLoading(false);
      }
    }
  };

  const rotateArrow = (id) =>
    arrowAnimations[id]?.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '90deg'],
    }) || '0deg';

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handlePress(item.family_group_id)}>
      <View style={styles.leftSection}>
        <View style={styles.row}>
          <Text style={styles.idText}>ID: {item.family_group_id}</Text>
          <Text style={styles.memberCountText}>Members: {item.member_count}</Text>
        </View>
        <Text style={styles.nameText}>Name: {item.family_group_name}</Text>
        <Text style={styles.contactText}>Contact: {item.family_group_contact_no}</Text>
      </View>
      <Animated.View style={{ transform: [{ rotate: rotateArrow(item.family_group_id) }] }}>
        <MaterialIcons name="arrow-forward-ios" size={24} color="#000" style={styles.arrowIcon} />
      </Animated.View>
    </TouchableOpacity>
  );

  const renderModalContent = () => {
    if (modalLoading) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (members.length === 0) {
      return <Text>No members found for this group.</Text>;
    }

    return (
      <FlatList
        data={members}
        keyExtractor={(item) => item.voter_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.memberItem}>
            <Text style={styles.memberText}>ID: {item.voter_id}</Text>
            <Text style={styles.memberText}>Name: {item.voter_name}</Text>
            <Text style={styles.memberText}>Contact: {item.voter_contact_number || 'N/A'}</Text>
          </View>
        )}
      />
    );
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <HeaderFooterLayout
      headerText="Family"
      leftIcon={<MaterialIcons name="chevron-left" size={24} color="black" onPress={handleGoBack} />}
      showFooter={false}>
      <View style={styles.container}>
        {loading ? (
          <Text>Loading...</Text>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.family_group_id.toString()}
            renderItem={renderItem}
            ListEmptyComponent={<Text>No family groups available</Text>}
          />
        )}

        <Modal visible={modalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Group Members</Text>
                <Text style={styles.modalMemberCount}>Members: {members.length}</Text>
              </View>

              {renderModalContent()}

              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </HeaderFooterLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: '#F5F5F5',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    marginVertical: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  leftSection: {
    flexDirection: 'column',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  idText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  nameText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    marginTop: 5,
  },
  contactText: {
    fontSize: 16,
    color: '#888',
    marginTop: 5,
  },
  memberCountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  arrowIcon: {
    color: '#333',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
    height: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalMemberCount: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  memberItem: {
    marginVertical: 10,
  },
  memberText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
