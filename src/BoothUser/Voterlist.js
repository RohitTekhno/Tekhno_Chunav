import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, TextInput, TouchableWithoutFeedback, Modal, Alert, Animated
} from 'react-native';
import { MaterialIcons, FontAwesome, Ionicons, AntDesign, } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { VoterContext } from './VoterContext';
import withSidebar from './Withsidebar';
import RNPickerSelect from 'react-native-picker-select';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import HeaderFooterLayout from './HeaderFooterLayout';
import { LinearGradient } from 'expo-linear-gradient';


const { width, height } = Dimensions.get('window');
const scaleFontSize = (size) => Math.round(size * width * 0.0025);

function VoterList({ route, navigation, }) {
  const { boothId, townId, buserId, voterNames, voterId, voterContactNumbers, voterCasts, voterParentNames, voterAges, voterGenders, voterfavour, voterTown, voterBooth, voterStatus, voterEngaged, voterVoted } = route.params;
  const { voters, setVoters } = useContext(VoterContext);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [casteModalVisible, setCasteModalVisible] = useState(false);
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [selectedVoter, setSelectedVoter] = useState(null);
  const [updatedContactNumber, setUpdatedContactNumber] = useState('');
  const [updatedName, setUpdatedName] = useState('');
  const [updatedCaste, setUpdatedCaste] = useState('');
  const [updatedParentName, setUpdatedParentName] = useState('');
  const [updatedAge, setUpdatedAge] = useState('');
  const [updatedGender, setUpdatedGender] = useState('');
  const [updatedStatus, setUpdatedStatus] = useState('');
  const [updatedEngaged, setUpdatedEngaged] = useState('');
  const [updatedVoted, setUpdatedVoted] = useState('');
  const [newCaste, setNewCaste] = useState('');
  const [yearOfDeath, setYearOfDeath] = useState('');
  const [colorLegendModalVisible, setColorLegendModalVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#000000');

  const [casteOpen, setCasteOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [maritalOpen, setMaritalOpen] = useState(false);
  const [genderOpen, setGenderOpen] = useState(false);
  const [allCasts, setAllCasts] = useState([]);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const sidebarAnimation = useRef(new Animated.Value(width * 0.6)).current;



  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const url = `http://192.168.200.23:8000/api/get_voters_by_user_wise/${buserId}/`;
        const response = await axios.get(url);

        if (response.data && response.data.voters) {
          const apiData = response.data.voters;
          const combinedData = voterId.map((id, index) => {
            const apiVoter = apiData.find(voter => voter.voter_id === id) || {};
            let color = '#f7f5fa';
            if (apiVoter.voter_favour_id === 1) color = 'green';
            else if (apiVoter.voter_favour_id === 2) color = 'red';
            else if (apiVoter.voter_favour_id === 3) color = 'yellow';
            else if (apiVoter.voter_favour_id === 4) color = 'blue';

            return {
              voter_id: id,
              voter_name: voterNames[index],
              voter_contact_number: voterContactNumbers[index],
              color,
              caste: voterCasts[index] || '',
              parent_name: voterParentNames[index] || '',
              age: voterAges[index] || '',
              gender: voterGenders[index] || '',
              favour: voterfavour[index] || '',
              town: voterTown[index] || '',
              booth: voterBooth[index] || '',
              status: voterStatus[index] || '',
              engaged: voterEngaged[index] || '',
              voted: voterVoted[index] || '',

              isThumbUp: apiVoter.voter_vote_confirmation_id === 1,
              isPaid: false,
            };
          });

          setVoters(combinedData);
          setFilteredData(combinedData);
        } else {
          Alert.alert('Error', 'Unexpected data format.');
        }
      } catch (error) {
        Alert.alert('Error', `Failed to fetch voter data: ${error.message}`);
      }
    };

    fetchInitialData();
  }, [boothId, voterId, buserId, voterNames, voterContactNumbers, voterCasts, voterParentNames, voterAges, voterGenders, voterfavour, voterStatus, voterEngaged, voterVoted]);


  useEffect(() => {
    if (search === '') {
      setFilteredData(voters);
    } else {
      const searchTerms = search.split(' ').filter(term => term);
      setFilteredData(voters.filter(item =>
        searchTerms.every(term =>
          String(item.voter_name).toLowerCase().includes(term.toLowerCase()) ||
          String(item.voter_id).includes(term)
        )
      ));
    }
  }, [search, voters]);


  const hideMenu = () => {
    setMenuVisible(false);
  };

  const handleLongPress = (id) => {
    setIsSelecting(true);
    setSelectedItems([id]);
  };

  const handleSelect = (id) => {
    if (isSelecting) {
      setSelectedItems(prevSelected => {
        if (prevSelected.includes(id)) {
          return prevSelected.filter(item => item !== id);
        } else {
          return [...prevSelected, id];
        }
      });
    }
  };



  const showEditModal = (voter) => {
    setSelectedVoter(voter);
    setUpdatedContactNumber(voter.voter_contact_number || '');
    setUpdatedName(voter.voter_name || '');
    setUpdatedCaste(voter.caste || '');
    setUpdatedParentName(voter.parent_name || '');
    setUpdatedAge(voter.age || '');
    setUpdatedGender(voter.gender || '');
    setUpdatedStatus(voter.status || '');
    setUpdatedEngaged(voter.engaged || '');
    setUpdatedVoted(voter.voted || '');
    setCheckboxState({
      green: voter.color === 'green',
      yellow: voter.color === 'yellow',
      red: voter.color === 'red',
      blue: voter.color === 'blue'
    });
    setContactModalVisible(true);
  };

  const closeEditModal = () => {
    setContactModalVisible(false);
    setSelectedVoter(null);
    setUpdatedContactNumber('');
    setUpdatedName('');
    setUpdatedCaste('');
    setUpdatedParentName('');
    setUpdatedAge('');
    setUpdatedGender('');
    setUpdatedStatus('');
    setUpdatedEngaged('');
    setUpdatedVoted('');
    setCheckboxState({
      green: false,
      yellow: false,
      red: false,
      blue: false
    });
  };

  const [checkboxState, setCheckboxState] = useState({
    green: false,
    yellow: false,
    red: false,
    blue: false
  });


  const sendCheckboxStateToAPI = async (voter_id, checkboxID) => {
    try {
      const response = await axios.put(`http://192.168.200.23:8000/api/favour/${voter_id}/`, {
        voter_favour_id: checkboxID,
      });

      if (response.status !== 200) {
        throw new Error('Failed to update checkbox state.');
      }
    } catch (error) {
      console.error('Error updating checkbox state:', error.message);
      alert('Failed to update checkbox state. Please try again.');
    }
  };

  const getBackgroundColor = (color) => {
    switch (color) {
      case 'green':
        return '#1cb833';
      case 'red':
        return '#bf0606';
      case 'yellow':
        return '#ffd117';
      case 'blue':
        return '#0000ff';
      default:
        return 'black';
    }
  };


  const updateSelectedCheckboxes = (checkboxType) => {
    setVoters((prevVoters) => {
      return prevVoters.map((voter) => {
        if (selectedItems.includes(voter.voter_id)) {
          let newColor = 'black';
          let checkboxID = 0;

          if (checkboxType === 'favourable') {
            newColor = 'green';
            checkboxID = 1;
          } else if (checkboxType === 'Non-favorable') {
            newColor = 'red';
            checkboxID = 2;
          } else if (checkboxType === 'Doubted') {
            newColor = 'yellow';
            checkboxID = 3;
          } else if (checkboxType === 'Chocolate') {
            newColor = 'blue';
            checkboxID = 4;
          }

          sendCheckboxStateToAPI(voter.voter_id, checkboxID);
          return { ...voter, color: newColor };
        }
        return voter;
      });
    });
  };


  const openColorLegendModal = () => setColorLegendModalVisible(true);
  const closeColorLegendModal = () => setColorLegendModalVisible(false);

  const handleColorSelection = (color) => {
    setSelectedColor(color);

    if (selectedVoter) {
      let checkboxID = 0;

      if (color === 'green') {
        checkboxID = 1;
      } else if (color === 'red') {
        checkboxID = 2;
      } else if (color === 'yellow') {
        checkboxID = 3;
      } else if (color === 'blue') {
        checkboxID = 4;
      }

      setVoters((prevVoters) => {
        return prevVoters.map((voter) => {
          if (voter.voter_id === selectedVoter.voter_id) {
            sendCheckboxStateToAPI(voter.voter_id, checkboxID);
            return { ...voter, color };
          }
          return voter;
        });
      });
    }
    closeColorLegendModal();
  };


  const navigateToFavour = () => {
    const greenRecords = voters.filter(voter => voter.color === 'green');
    navigation.navigate('Favour', { greenRecords });
  };

  const navigateToNonfavour = () => {
    const redRecords = voters.filter(voter => voter.color === 'red');
    navigation.navigate('Nonfavour', { redRecords });
  };

  const navigateToOuters = () => {
    const yellowRecords = voters.filter(voter => voter.color === 'yellow');
    navigation.navigate('Yellow', { yellowRecords });
  };

  // const updateVoterDetails = async (voterId, votedStatus) => {
  //   try {
  //     const apiUrl = `http://192.168.200.23:8000/api/voters/${selectedVoter.voter_id}/`;
  //     const response = await axios.patch(apiUrl, {
  //       voter_name: updatedName,
  //       voter_contact_number: updatedContactNumber,
  //       voter_cast_id: updatedCaste,
  //       voter_parent_name: updatedParentName,
  //       voter_age: updatedAge,
  //       voter_gender: updatedGender,
  //       voter_live_status_id: updatedStatus,
  //       voter_marital_status_id: updatedEngaged,
  //       // voter_vote_confirmation_id: votedStatus,

  //     });

  //     if (response.status !== 200) {
  //       throw new Error('Failed to update voter details.');
  //     }

  //     setVoters(prevVoters =>
  //       prevVoters.map(item =>
  //         item.voter_id === selectedVoter.voter_id
  //           ? {
  //             ...item, voter_name: updatedName, voter_contact_number: updatedContactNumber, caste: updatedCaste, parent_name: updatedParentName, age: updatedAge, gender: updatedGender, status: updatedStatus, engaged: updatedEngaged, 
  //           }
  //           : item
  //       )
  //     );
  //     setFilteredData(prevFiltered =>
  //       prevFiltered.map(item =>
  //         item.voter_id === selectedVoter.voter_id
  //           ? {
  //             ...item, voter_name: updatedName, voter_contact_number: updatedContactNumber, caste: updatedCaste, parent_name: updatedParentName, age: updatedAge, gender: updatedGender, status: updatedStatus, engaged: updatedEngaged, 
  //           }
  //           : item
  //       )
  //     );

  //     alert('Voter details updated successfully!');
  //     closeEditModal();
  //   } catch (error) {
  //     console.error('Error updating voter details:', error.message);
  //     alert('Failed to update voter details. Please try again.');
  //   }
  // };


  //   const updateVoterDetails = async () => {
  //     try {
  //         const apiUrl = `http://192.168.200.23:8000/api/voters/${selectedVoter.voter_id}/`;

  //         let updatedFields = {};


  //         if (updatedName !== '') updatedFields.voter_name = updatedName;
  //         if (updatedContactNumber !== '') updatedFields.voter_contact_number = updatedContactNumber;
  //         if (updatedCaste !== '') updatedFields.voter_cast_id = updatedCaste;
  //         if (updatedParentName !== '') updatedFields.voter_parent_name = updatedParentName;
  //         if (updatedAge !== '') updatedFields.voter_age = updatedAge;
  //         if (updatedGender !== '') updatedFields.voter_gender = updatedGender;
  //         if (updatedStatus !== '') updatedFields.voter_live_status_id = updatedStatus;
  //         if (updatedEngaged !== '') updatedFields.voter_marital_status_id = updatedEngaged;


  //         if (updatedName === '') updatedFields.voter_name = null;
  //         if (updatedContactNumber === '') updatedFields.voter_contact_number = null;
  //         if (updatedCaste === '') updatedFields.voter_cast_id = null;
  //         if (updatedParentName === '') updatedFields.voter_parent_name = null;
  //         if (updatedAge === '') updatedFields.voter_age = null;
  //         if (updatedGender === '') updatedFields.voter_gender = null;
  //         if (updatedStatus === '') updatedFields.voter_live_status_id = null;
  //         if (updatedEngaged === '') updatedFields.voter_marital_status_id = null;

  //         const response = await axios.patch(apiUrl, updatedFields);

  //         if (response.status !== 200) {
  //             throw new Error('Failed to update voter details.');
  //         }


  //         setVoters(prevVoters =>
  //                 prevVoters.map(item =>
  //                   item.voter_id === selectedVoter.voter_id
  //                     ? {
  //                       ...item, voter_name: updatedName, voter_contact_number: updatedContactNumber, caste: updatedCaste, parent_name: updatedParentName, age: updatedAge, gender: updatedGender, status: updatedStatus, engaged: updatedEngaged, 
  //                     }
  //                     : item
  //                 )
  //               );
  //               setFilteredData(prevFiltered =>
  //                 prevFiltered.map(item =>
  //                   item.voter_id === selectedVoter.voter_id
  //                     ? {
  //                       ...item, voter_name: updatedName, voter_contact_number: updatedContactNumber, caste: updatedCaste, parent_name: updatedParentName, age: updatedAge, gender: updatedGender, status: updatedStatus, engaged: updatedEngaged, 
  //                     }
  //                     : item
  //                 )
  //               );

  //         alert('Voter details updated successfully!');
  //         closeEditModal();
  //     } catch (error) {
  //         console.error('Error updating voter details:', error.message);
  //         alert('Failed to update voter details. Please try again.');
  //     }
  // };


  const updateVoterDetails = async () => {
    try {
      const apiUrl = `http://192.168.200.23:8000/api/compare_voter_data/`;

      // Prepare the updated fields
      const updatedFields = {
        voter_id: selectedVoter.voter_id, // Include voter_id in the body
        voter_name: updatedName !== '' ? updatedName : null,
        voter_contact_number: updatedContactNumber !== '' ? updatedContactNumber : null,
        voter_cast_id: updatedCaste !== '' ? updatedCaste : null,
        voter_parent_name: updatedParentName !== '' ? updatedParentName : null,
        voter_age: updatedAge !== '' ? updatedAge : null,
        voter_gender: updatedGender !== '' ? updatedGender : null,
        voter_live_status_id: updatedStatus !== '' ? updatedStatus : null,
        voter_marital_status_id: updatedEngaged !== '' ? updatedEngaged : null,
      };

      // Make the POST request
      const response = await axios.post(apiUrl, updatedFields, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Check if the update was successful
      if (response.status !== 200 && response.status !== 201) {
        throw new Error('Failed to update voter information.');
      }

      // Update the voter data in the state
      setVoters(prevVoters =>
        prevVoters.map(item =>
          item.voter_id === selectedVoter.voter_id
            ? {
              ...item,
              voter_name: updatedName,
              voter_contact_number: updatedContactNumber,
              caste: updatedCaste,
              parent_name: updatedParentName,
              age: updatedAge,
              gender: updatedGender,
              status: updatedStatus,
              engaged: updatedEngaged,
            }
            : item
        )
      );

      setFilteredData(prevFiltered =>
        prevFiltered.map(item =>
          item.voter_id === selectedVoter.voter_id
            ? {
              ...item,
              voter_name: updatedName,
              voter_contact_number: updatedContactNumber,
              caste: updatedCaste,
              parent_name: updatedParentName,
              age: updatedAge,
              gender: updatedGender,
              status: updatedStatus,
              engaged: updatedEngaged,
            }
            : item
        )
      );

      alert('Voter information updated successfully!');
      closeEditModal();
    } catch (error) {
      console.error('Error updating voter information:', error.message);
      alert('Failed to update voter information. Please try again.');
    }
  };

  const updateVoterThumbStatus = async (voterId, thumbStatus) => {
    try {
      const apiUrl = `http://192.168.200.23:8000/api/voter_confirmation/${voterId}/`;

      const response = await axios.put(apiUrl, {
        voter_id: voterId,
        voter_vote_confirmation_id: thumbStatus,
      });

      if (response.status !== 200) {
        throw new Error('Failed to update thumb status');
      }

      console.log('Thumb status updated successfully!');
      return true;
    } catch (error) {
      console.error('Error updating thumb status:', error.message);
      Alert.alert('Error', 'Failed to update thumb status. Please try again.');
      return false;
    }
  };

  const toggleThumb = async (voterId) => {
    try {
      // Find the voter in the current list of voters
      const voter = voters.find((item) => item.voter_id === voterId);

      if (!voter) {
        Alert.alert('Error', 'Voter not found');
        return;
      }

      // Toggle the thumb status (voted status)
      const updatedThumbStatus = voter.voted === 1 ? null : 1; // 1 for voted, null for not voted

      // Call the function to update thumb status in the backend
      const updateResponse = await updateVoterThumbStatus(voterId, updatedThumbStatus);

      // If the update is successful, update the local state
      if (updateResponse) {
        setVoters((prevVoters) =>
          prevVoters.map((item) =>
            item.voter_id === voterId
              ? { ...item, voted: updatedThumbStatus === 1 ? 1 : null } // Update state to reflect the new voted status
              : item
          )
        );

        setFilteredData((prevFiltered) =>
          prevFiltered.map((item) =>
            item.voter_id === voterId
              ? { ...item, voted: updatedThumbStatus === 1 ? 1 : null }
              : item
          )
        );
      }
    } catch (error) {
      console.error('Error toggling thumb status:', error.message);
      Alert.alert('Error', 'Failed to toggle thumb status. Please try again.');
    }
  };

  const selectAllVoters = () => {
    setSelectedItems(filteredData.map(item => item.voter_id));
  };

  const Header = () => (
    <View style={styles.headerContainer}>
      {isSelecting && (
        <View style={styles.selectionButtonsContainer}>
          <TouchableOpacity style={styles.button} onPress={() => setCasteModalVisible(true)}>
            <Text style={styles.buttonText}>Assign Caste</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={selectAllVoters}>
            <Text style={styles.buttonText}>Select All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={exitSelection}>
            <Text style={styles.buttonText}>Exit Selection</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderColorCircles = () => {
    if (selectedItems.length > 0) {
      return (
        <View style={styles.colorCirclesContainer}>
          <TouchableOpacity onPress={() => updateSelectedCheckboxes('favourable')} style={styles.greenCircle} />
          <TouchableOpacity onPress={() => updateSelectedCheckboxes('Non-favorable')} style={styles.redCircle} />
          <TouchableOpacity onPress={() => updateSelectedCheckboxes('Doubted')} style={styles.yellowCircle} />
        </View>
      );
    }
    return null;
  };

  const assignCaste = async () => {
    if (!newCaste) {
      Alert.alert('Please enter a caste.');
      return;
    }

    try {

      console.log('Selected Caste:', newCaste);
      console.log('Selected Items:', selectedItems);

      const promises = selectedItems.map(voterId => {
        const apiUrl = `http://192.168.200.23:8000/api/voters/${voterId}/`;
        console.log('API URL:', apiUrl);

        //   return axios.patch(apiUrl, { voter_cast: newCaste });
        // });

        const voter = voters.find(voter => voter.voter_id === voterId);
        if (!voter) {
          console.error(`Voter with ID ${voterId} not found`);
          return Promise.reject('Voter not found');
        }

        const payload = {
          voter_cast_id: newCaste,
          voter_name: voter.voter_name
        };

        return axios.patch(apiUrl, payload);
      });
      await Promise.all(promises);

      setVoters(prevVoters =>
        prevVoters.map(item =>
          selectedItems.includes(item.voter_id)
            ? { ...item, caste: newCaste }
            : item
        )
      );

      setFilteredData(prevFiltered =>
        prevFiltered.map(item =>
          selectedItems.includes(item.voter_id)
            ? { ...item, caste: newCaste }
            : item
        )
      );

      Alert.alert('Caste assigned successfully!');
      setIsSelecting(false);
      setSelectedItems([]);
      setNewCaste('');
      setCasteModalVisible(false)
    } catch (error) {
      console.error('Error assigning caste:', error.response ? error.response.data : error.message);
      Alert.alert('Failed to assign caste. Please try again.');
    }
  };

  const fetchCasteData = async () => {
    try {
      const response = await axios.get('http://192.168.200.23:8000/api/cast/');
      if (response.status === 200) {
        const castData = response.data.map((item) => ({
          label: `${item.cast_id} - ${item.cast_name}`, // Display both cast_id and cast_name
          value: item.cast_id, // Use cast_id for backend operations
        }));
        setAllCasts(castData);
      }
    } catch (error) {
      console.error('Error fetching caste data:', error);
    }
  };

  useEffect(() => {
    fetchCasteData();
  }, []);


  const exitSelection = () => {
    setIsSelecting(false);
    setSelectedItems([]);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };


  const toggleSidebar = () => {
    if (isSidebarVisible) {

      Animated.timing(sidebarAnimation, {
        toValue: width * 0.6,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setSidebarVisible(false));
    } else {

      setSidebarVisible(true);
      Animated.timing(sidebarAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };


  return (
    <TouchableWithoutFeedback onPress={hideMenu}>
      <HeaderFooterLayout
        headerText="Voter List"
        leftIcon={<MaterialIcons name="chevron-left" size={scaleFontSize(25)} color="black" />}
        leftIconAction={handleGoBack}
        rightIcon={<MaterialIcons name="menu" size={scaleFontSize(25)} color="black" onPress={toggleSidebar} />
        }>

        <View style={styles.container}>


          <View style={styles.searchContainer}>
            <FontAwesome name="search" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name or ID"
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <Header />

          {renderColorCircles()}

          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.voter_id.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => handleSelect(item.voter_id)}
                onLongPress={() => handleLongPress(item.voter_id)}
              >
                <View style={styles.cardContent}>
                  <View style={styles.leftSection}>
                    <View style={styles.indexAndIDContainer}>
                      <View style={styles.indexBox}>
                        <Text style={styles.indexText}>{index + 1}</Text>
                      </View>
                      <Text style={styles.idText}>ID: {item.voter_id}</Text>
                    </View>
                    <Text style={styles.name}>Name: {item.voter_name}</Text>
                    <Text style={styles.details}>Contact: {item.voter_contact_number}</Text>
                    <Text style={styles.details}>Town: {item.town}</Text>
                    <Text style={styles.details}>Booth: {item.booth}</Text>
                  </View>

                  <View style={styles.rightSection}>
                    <TouchableOpacity onPress={() => showEditModal(item)} style={styles.editIcon}>
                      <MaterialIcons name="edit" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => toggleThumb(item.voter_id)} style={styles.thumbIcon}>
                      <MaterialIcons
                        name={item.voted === 1 ? "thumb-up" : "thumb-up-off-alt"}
                        size={24}
                        color={item.voted === 1 ? "black" : "#ccc"}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={[
                    styles.colorIndicator,
                    { backgroundColor: selectedItems.includes(item.voter_id) ? '#f549ef' : getBackgroundColor(item.color) }
                  ]}
                />
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text>Loading</Text>}
          />

          <Modal
            visible={contactModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={closeEditModal}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>

                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Edit Voter Details</Text>
                  <TouchableOpacity style={[styles.closeCircle, { backgroundColor: selectedColor }]} onPress={openColorLegendModal}>
                    <View style={styles.circle}></View>
                  </TouchableOpacity>
                </View>


                <TextInput
                  style={styles.modalInput}
                  placeholder="Enter Name"
                  value={updatedName}
                  onChangeText={setUpdatedName}
                />


                <TextInput
                  style={styles.modalInput}
                  placeholder="Enter Parent Name"
                  value={updatedParentName}
                  onChangeText={setUpdatedParentName}
                />


                <TextInput
                  style={styles.modalInput}
                  placeholder="Enter Contact Number"
                  value={updatedContactNumber}
                  onChangeText={setUpdatedContactNumber}
                />


                <DropDownPicker
                  items={allCasts}
                  placeholder="Select Caste"
                  open={casteOpen}
                  setOpen={setCasteOpen}
                  value={updatedCaste}
                  setValue={setUpdatedCaste}
                  style={styles.dropdown}
                  dropDownContainerStyle={styles.dropdownContainer}
                  zIndex={5000}
                  scrollViewProps={{
                    nestedScrollEnabled: true,
                  }}
                />

                <View style={styles.dropdownRow}>
                  <View style={styles.rowItem}>
                    <DropDownPicker
                      items={[
                        { label: 'Alive', value: 1 },
                        { label: 'Dead', value: 2 }
                      ]}
                      placeholder="Select Status"
                      open={statusOpen}
                      setOpen={setStatusOpen}
                      value={updatedStatus}
                      setValue={setUpdatedStatus}
                      style={styles.dropdown}
                      dropDownContainerStyle={styles.dropdownContainer}
                      zIndex={4000}
                    />
                  </View>
                  <View style={styles.rowItem}>
                    <DropDownPicker
                      items={[
                        { label: 'Married', value: 1 },
                        { label: 'Single', value: 2 }
                      ]}
                      placeholder="Marital Status"
                      open={maritalOpen}
                      setOpen={setMaritalOpen}
                      value={updatedEngaged}
                      setValue={setUpdatedEngaged}
                      style={styles.dropdown}
                      dropDownContainerStyle={styles.dropdownContainer}
                      zIndex={4000}
                    />
                  </View>
                </View>


                <View style={styles.dropdownRoww}>
                  <TextInput
                    style={styles.modalInputt}
                    placeholder="Enter Age"
                    keyboardType="numeric"
                    value={updatedAge}
                    onChangeText={setUpdatedAge}
                  />

                  <View style={styles.rowItem}>
                    <DropDownPicker
                      items={[
                        { label: 'Male', value: 'male' },
                        { label: 'Female', value: 'female' },
                        { label: 'Other', value: 'other' }
                      ]}
                      placeholder="Gender"
                      open={genderOpen}
                      setOpen={setGenderOpen}
                      value={updatedGender}
                      setValue={setUpdatedGender}
                      style={styles.dropdown}
                      dropDownContainerStyle={styles.dropdownContainer}
                      zIndex={3000}
                    />
                  </View>
                </View>

                {/* Modal Buttons */}
                <View style={styles.modalButtons}>
                  <TouchableOpacity style={styles.cancelButton} onPress={closeEditModal}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveButton} onPress={updateVoterDetails}>
                    <Text style={styles.saveButtonText}>Update</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>



          <Modal
            visible={colorLegendModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={closeColorLegendModal}
          >
            <View style={styles.overlay}>
              <View style={styles.colorLegendModalContainer}>
                {[
                  { color: 'green', label: 'Favourable' },
                  { color: 'red', label: 'Non-Favourable' },
                  { color: 'yellow', label: 'Doubted' },
                  { color: '#000000', label: 'Pending' },
                  { color: 'blue', label: 'VIP' },
                ].map((item, index) => (
                  <TouchableOpacity key={index} style={styles.legendItem} onPress={() => handleColorSelection(item.color)}>
                    <View style={[styles.colorCircle, { backgroundColor: item.color }]} />
                    <Text style={styles.label}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Modal>




          <Modal
            visible={casteModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setCasteModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Assign Caste</Text>
                <RNPickerSelect
                  onValueChange={(value) => setNewCaste(value)}
                  items={allCasts}
                  style={pickerSelectStyles}
                  value={newCaste}
                  placeholder={{
                    label: 'Select caste...',
                    value: null,
                  }}
                />
                <View style={styles.modalButtonsContainer}>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => {
                      if (newCaste) {
                        assignCaste(newCaste);
                        setCasteModalVisible(false);
                      } else {
                        Alert.alert('Warning', 'Please select a caste');
                      }
                    }}
                  >
                    <Text style={styles.modalButtonText}>Assign</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => setCasteModalVisible(false)}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>


          {isSidebarVisible && (
            <TouchableWithoutFeedback onPress={() => null}>
              <LinearGradient
                colors={['#3C4CAC', '#F04393']}
                locations={[0.1, 1]}
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 20,
                  width: width * 0.35,
                  height: '25%',
                  borderRadius: 10,
                  elevation: 10,

                }}
              >
                <Animated.View
                  style={{
                    flex: 1,
                    padding: 20,
                    transform: [{ translateX: sidebarAnimation }],
                  }}
                >
                  <Text style={{ fontSize: 20, marginBottom: 20, color: 'white', fontWeight: '800' }}>Menu</Text>
                  <TouchableOpacity onPress={navigateToFavour}>
                    <Text style={{ fontSize: 16, marginBottom: 15, color: 'white' }}>Favourable</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={navigateToNonfavour}>
                    <Text style={{ fontSize: 16, marginBottom: 15, color: 'white' }}>Against</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={navigateToOuters}>
                    <Text style={{ fontSize: 16, marginBottom: 15, color: 'white' }}>Doubted</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.navigate('Family')}>
                    <Text style={{ fontSize: 16, marginBottom: 15, color: 'white' }}>Family</Text>
                  </TouchableOpacity>
                  {/* <TouchableOpacity onPress={handleMenuSelection}>
          <Text style={{ fontSize: 16, marginBottom: 15, color: 'white' }}>Reach</Text>
        </TouchableOpacity> */}
                </Animated.View>
              </LinearGradient>
            </TouchableWithoutFeedback>
          )}
        </View>
      </HeaderFooterLayout>
    </TouchableWithoutFeedback >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 15
  },
  // header 
  heading: {
    fontSize: scaleFontSize(24),
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  // search bar
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: width * 0.03,
    // marginHorizontal:width * 0.05, 
    backgroundColor: '#F5F5F5',
    marginVertical: '3%',
  },

  icon: {
    marginRight: width * 0.02,
  },

  searchInput: {
    flex: 1,
    fontSize: width * 0.04,
    color: '#333',
    paddingVertical: height * 0.01,
  },
  // assign color to multiple voter 
  colorCirclesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 10,
  },
  greenCircle: {
    width: 20,
    height: 20,
    backgroundColor: 'green',
    borderRadius: 15,
  },
  redCircle: {
    width: 20,
    height: 20,
    backgroundColor: 'red',
    borderRadius: 15,
  },
  yellowCircle: {
    width: 20,
    height: 20,
    backgroundColor: '#ffd326',
    borderRadius: 15,
  },

  // voter record card
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    elevation: 7,
    marginVertical: '2%',
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  leftSection: {
    flex: 1,
  },
  indexAndIDContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indexBox: {
    width: 24,
    height: 24,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'blue',
    width: '15%'
  },
  indexText: {
    color: 'blue',
    fontSize: 14,
    fontWeight: 'bold',
  },
  idText: {
    color: 'blue',
    fontSize: 16,
    fontWeight: 'bold',
  },
  name: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  details: {
    color: '#333',
    fontSize: 14,
    marginTop: 2,
  },
  rightSection: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingVertical: 20,
  },
  editIcon: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  thumbIcon: {
    alignSelf: 'flex-end',
    marginTop: 20,
  },
  colorIndicator: {
    width: '1.5%',
    height: '90%',
    marginRight: '5%',
    borderTopStartRadius: 20,
    borderBottomStartRadius: 20
  },
  // footer
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    // marginBottom: height * 0.07,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: height * 0.07,
    paddingHorizontal: width * 0.03,
  },
  footerButton: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: height * 0.01,
  },
  footerButtonText: {
    fontSize: width * 0.03,
    color: '#000000',
    // marginTop: 3,
  },
  // edit voter information modal
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  closeCircle: {
    width: 35,
    height: 35,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 15,
    height: 15,
    backgroundColor: 'black',
    borderRadius: 50,
  },
  modalInput: {
    backgroundColor: '#fff',
    borderColor: '#E2E2E2',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 18,
    color: '#000',
    width: '100%',
    marginBottom: 10,
  },
  modalInputt: {
    backgroundColor: '#fff',
    borderColor: '#E2E2E2',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 18,
    color: '#000',
    width: '45%',
    marginBottom: 10,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderColor: '#E2E2E2',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: '100%',
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderColor: '#E2E2E2',
    marginBottom: 15,
  },
  dropdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    width: '100%',
    marginBottom: '3%',
    marginTop: '3%'
  },
  dropdownRoww: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    width: '100%',
    marginBottom: '3%',
  },
  rowItem: {
    width: '45%',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#ff69b4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '45%',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderColor: '#ff69b4',
    borderWidth: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '45%',
  },
  cancelButtonText: {
    color: '#ff69b4',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // color modal
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  colorLegendModalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  colorCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  // assign cast to multiple 
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  selectionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    // paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#8d93fc',
    padding: 5,
    borderRadius: 10,
    // marginHorizontal: 5,  
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

const pickerSelectStyles = StyleSheet.create({
  casteDropdown: {
    inputAndroid: {
      fontSize: 16,
      paddingVertical: 10,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: '#E2E2E2',
      borderRadius: 10,
      color: 'black',
      paddingRight: 30,
    },
  },
  statusDropdown: {
    inputAndroid: {
      fontSize: 16,
      paddingVertical: 10,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      color: 'black',
      paddingRight: 30,
      width: '100%',
    },
  },
  maritalStatusDropdown: {
    inputAndroid: {
      fontSize: 16,
      paddingVertical: 10,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      color: 'black',
      paddingRight: 30,
      width: '100%',
    },
  },
  ageDropdown: {

    inputAndroid: {
      fontSize: 16,
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      color: 'black',
      paddingRight: 30,
      width: '100%',
      flex: 1,
    },
  },
  genderDropdown: {
    inputAndroid: {
      fontSize: 16,
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      color: 'black',
      paddingRight: 30,
      width: '100%',
      flex: 1,
    },
  },
});


export default withSidebar(VoterList)