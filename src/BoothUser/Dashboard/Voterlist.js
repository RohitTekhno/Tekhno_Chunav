import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, TextInput, TouchableWithoutFeedback, Modal, Alert, Pressable, Picker,
  Animated, ActivityIndicator
} from 'react-native';
import { MaterialIcons, FontAwesome, Ionicons, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import RNPickerSelect from 'react-native-picker-select';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { LanguageContext } from '../../ContextApi/LanguageContext';
import { BoothUserContext } from '../../ContextApi/BuserContext';
import { VoterContext } from '../../ContextApi/VoterContext';
import { ColorLegendModal, EditVoterModal } from '../Voters/VoterDetailsFormModal';
import Sidebar from '../Voters/SideBarMenu';
import CasteModal from '../Voters/CasteModal';



const { width, height } = Dimensions.get('window');
const scaleFontSize = (size) => Math.round(size * width * 0.0025);

const VoterList = ({ navigation, }) => {
  const { buserId, boothId } = useContext(BoothUserContext);

  const { language, toggleLanguage } = useContext(LanguageContext);
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
  const [loading, setLoading] = useState(false);
  const [casteOpen, setCasteOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [maritalOpen, setMaritalOpen] = useState(false);
  const [genderOpen, setGenderOpen] = useState(false);
  const [allCasts, setAllCasts] = useState([]);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const sidebarAnimation = useRef(new Animated.Value(width * 0.6)).current;


  const [voterId, setVoterId] = useState('');
  const [voterNames, setVoterNames] = useState([]);
  const [voterContactNumbers, setVoterContactNumbers] = useState([]);
  const [voterCasts, setVoterCasts] = useState([]);
  const [voterParentNames, setVoterParentNames] = useState([]);
  const [voterAges, setVoterAges] = useState([]);
  const [voterGenders, setVoterGenders] = useState([]);
  const [voterFavour, setVoterFavour] = useState('');
  const [voterTown, setVoterTown] = useState('');
  const [voterBooth, setVoterBooth] = useState('');
  const [voterStatus, setVoterStatus] = useState('');
  const [voterEngaged, setVoterEngaged] = useState(false);
  const [voterVoted, setVoterVoted] = useState(false);


  const fetchVotersData = async () => {
    try {
      const url = `http://192.168.1.31:8000/api/get_voters_by_user_wise/${buserId}/`;
      const { data } = await axios.get(url);

      if (data && data.voters) {
        const voters = data.voters;

        const id = voters.map(voter => voter.voter_id);
        const names = voters.map(voter => voter.voter_name || ''); // Default to empty string
        const contactNumbers = voters.map(voter => voter.voter_contact_number || '');
        const casts = voters.map(voter => voter.voter_cast_id);
        const parentNames = voters.map(voter => voter.voter_parent_name || '');
        const ages = voters.map(voter => voter.voter_age || 0); // Default to 0
        const genders = voters.map(voter => voter.voter_gender || ''); // Default to empty string
        const favour = voters.map(voter => voter.voter_favour_id);
        const town = voters.map(voter => voter.town_name || '');
        const booth = voters.map(voter => voter.booth_name || '');
        const status = voters.map(voter => voter.voter_live_status_id);
        const engaged = voters.map(voter => voter.voter_marital_status_id);
        const voted = voters.map(voter => voter.voter_vote_confirmation_id);

        // Set states
        setVoterId(id);
        setVoterNames(names);
        setVoterGenders(genders);
        setVoterAges(ages);
        setVoterParentNames(parentNames);
        setVoterCasts(casts);
        setVoterContactNumbers(contactNumbers);
        setVoterFavour(favour);
        setVoterVoted(voted);
        setVoterEngaged(engaged);
        setVoterStatus(status);
        setVoterBooth(booth);
        setVoterTown(town);
      } else {
        Alert.alert('Error', 'Unexpected data format.');
      }
    } catch (error) {
      Alert.alert('Error', `Failed to fetch voter names: ${error.message}`);
    }
  }


  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const url = `http://192.168.1.31:8000/api/get_voters_by_user_wise/${buserId}/`;
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
            else if (apiVoter.voter_favour_id === 5) color = 'skyblue';


            return {
              voter_id: id,
              voter_name: voterNames[index],
              voter_contact_number: voterContactNumbers[index],
              color,
              caste: voterCasts[index] || '',
              parent_name: voterParentNames[index] || '',
              age: voterAges[index] || '',
              gender: voterGenders[index] || '',
              favour: voterFavour[index] || '',
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
  }, [boothId, voterId, buserId, voterNames, voterContactNumbers, voterCasts, voterParentNames, voterAges, voterGenders, voterFavour, voterStatus, voterEngaged, voterVoted]);

  useEffect(() => {
    fetchVotersData()
  })

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

  const updateVoterDetails = async () => {
    try {
      setLoading(true);

      const apiUrl = `http://192.168.1.31:8000/api/compare_voter_data/`;
      const updatedFields = {
        voter_id: selectedVoter.voter_id,
        voter_name: updatedName !== '' ? updatedName : null,
        voter_contact_number: updatedContactNumber !== '' ? updatedContactNumber : null,
        voter_cast_id: updatedCaste !== '' ? updatedCaste : null,
        voter_parent_name: updatedParentName !== '' ? updatedParentName : null,
        voter_age: updatedAge !== '' ? updatedAge : null,
        voter_gender: updatedGender !== '' ? updatedGender : null,
        voter_live_status_id: updatedStatus !== '' ? updatedStatus : null,
        voter_marital_status_id: updatedEngaged !== '' ? updatedEngaged : null,
      };

      const response = await axios.post(apiUrl, updatedFields, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== 200 && response.status !== 201) {
        throw new Error('Failed to update voter information.');
      }


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
      Alert.alert('Error updating voter information:', error.message);
      alert('Failed to update voter information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateVoterThumbStatus = async (voterId, thumbStatus) => {
    try {
      const apiUrl = `http://192.168.1.31:8000/api/voter_confirmation/${voterId}/`;

      const response = await axios.put(apiUrl, {
        voter_id: voterId,
        voter_vote_confirmation_id: thumbStatus,
      });

      if (response.status !== 200) {
        throw new Error('Failed to update thumb status');
      }
      return true;
    } catch (error) {
      Alert.alert('Error updating thumb status:', error.message);
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
      Alert.alert('Error toggling thumb status:', error.message);
      Alert.alert('Error', 'Failed to toggle thumb status. Please try again.');
    }
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
      blue: voter.color === 'blue',
      skyblue: voter.color === 'skyblue'
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
      blue: false,
      skyblue: false,
    });
  };

  const [checkboxState, setCheckboxState] = useState({
    green: false,
    yellow: false,
    red: false,
    blue: false,
    skyblue: false,
  });


  const sendCheckboxStateToAPI = async (voter_id, checkboxID) => {
    try {
      const response = await axios.put(`http://192.168.1.31:8000/api/favour/${voter_id}/`, {
        voter_favour_id: checkboxID,
      });

      if (response.status !== 200) {
        throw new Error('Failed to update checkbox state.');
      }
    } catch (error) {
      Alert.alert('Error updating checkbox state:', error.message);
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
      case 'skyblue':
        return '#9eb1ff';

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
          } else if (checkboxType === 'Pro') {
            newColor = 'skyblue';
            checkboxID = 5;
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
      } else if (color === 'skyblue') {
        checkboxID = 5;
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


  const navigateToBlue = () => {
    const blueRecords = voters.filter(voter => voter.color === 'blue');
    navigation.navigate('Pro', { blueRecords });
  };

  const navigateToSkyBlue = () => {
    const skyblueRecords = voters.filter(voter => voter.color === 'skyblue');
    navigation.navigate('Hpro', { skyblueRecords });
  };





  const selectAllVoters = () => {
    setSelectedItems(filteredData.map(item => item.voter_id));
  };

  const Header = () => (
    <View style={styles.headerContainer}>
      {isSelecting && (
        <View style={styles.selectionButtonsContainer}>
          <TouchableOpacity style={styles.button} onPress={() => setCasteModalVisible(true)}>
            <Text style={styles.buttonText}>
              {language === 'en' ? 'Assign Caste' : 'जात नियुक्त करा'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={selectAllVoters}>
            <Text style={styles.buttonText}>
              {language === 'en' ? 'Select All' : 'सर्व निवडा'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={exitSelection}>
            <Text style={styles.buttonText}>
              {language === 'en' ? 'Exit Selection' : 'निवडीतून बाहेर'}
            </Text>
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
          <TouchableOpacity onPress={() => updateSelectedCheckboxes('Chocolate')} style={styles.blueCircle} />
          <TouchableOpacity onPress={() => updateSelectedCheckboxes('Pro')} style={styles.skyblueCircle} />
          <TouchableOpacity onPress={() => updateSelectedCheckboxes('Pending')} style={styles.blackCircle} />
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
      const promises = selectedItems.map(voterId => {
        const apiUrl = `http://192.168.1.31:8000/api/voters/${voterId}/`;

        //   return axios.patch(apiUrl, { voter_cast: newCaste });
        // });

        const voter = voters.find(voter => voter.voter_id === voterId);
        if (!voter) {
          Alert.alert(`Voter with ID ${voterId} not found`);
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
      Alert.alert('Error assigning caste:', error.response ? error.response.data : error.message);
      Alert.alert('Failed to assign caste. Please try again.');
    }
  };

  const fetchCasteData = async () => {
    try {
      const response = await axios.get('http://192.168.1.31:8000/api/cast/');
      if (response.status === 200) {
        const castData = response.data.map((item) => ({
          label: `${item.cast_id} - ${item.cast_name}`, // Display both cast_id and cast_name
          value: item.cast_id, // Use cast_id for backend operations
        }));
        setAllCasts(castData);
      }
    } catch (error) {
      Alert.alert('Error fetching caste data:', error);
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

  // sidebar functionality 
  const toggleSidebar = () => {
    if (isSidebarVisible) {

      Animated.timing(sidebarAnimation, {
        toValue: width * 0.6,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setSidebarVisible(false));
    } else {

      setSidebarVisible(true);
      Animated.timing(sidebarAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const toTitleCase = (str) => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };


  return (
    <TouchableWithoutFeedback onPress={hideMenu}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <FontAwesome name="search" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.searchInput}
            placeholder={language === 'en' ? "Search by name or ID" : 'नाव किंवा आयडी द्वारे शोधा'}
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
              style={[
                styles.card,
                selectedItems.includes(item.voter_id) && { backgroundColor: '#ababab' }
              ]}
              onPress={() => handleSelect(item.voter_id)}
              onLongPress={() => handleLongPress(item.voter_id)}
            >
              <View style={styles.cardContent}>
                <View style={styles.leftSection}>
                  <View style={styles.indexAndIDContainer}>
                    <View style={styles.indexBox}>
                      <Text style={styles.indexText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.idText}>
                      {language === 'en' ? 'ID' : 'क्र.'} : {item.voter_id}</Text>
                  </View>
                  <Text style={styles.name}>
                    {language === 'en' ? 'Name' : 'नाव'}: {toTitleCase(item.voter_name)}</Text>
                  <Text style={styles.details}>
                    {language === 'en' ? 'Contact' : 'संपर्क'}: {item.voter_contact_number}</Text>
                  <Text style={styles.details}>
                    {language === 'en' ? 'Town' : 'नगर'}: {item.town}</Text>
                  <Text style={styles.details}>
                    {language === 'en' ? 'Booth' : 'बूथ'}: {item.booth}</Text>
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
                  { backgroundColor: getBackgroundColor(item.color) }
                ]}
              />
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={{ textAlign: 'center' }}>
            {language === 'en' ? 'Loading' : 'लोड करत आहे'}
          </Text>}
        />

        <EditVoterModal
          contactModalVisible={contactModalVisible}
          closeEditModal={closeEditModal}
          language={language}
          updatedName={updatedName}
          setUpdatedName={setUpdatedName}
          updatedParentName={updatedParentName}
          setUpdatedParentName={setUpdatedParentName}
          updatedContactNumber={updatedContactNumber}
          setUpdatedContactNumber={setUpdatedContactNumber}
          allCasts={allCasts}
          casteOpen={casteOpen}
          setCasteOpen={setCasteOpen}
          updatedCaste={updatedCaste}
          setUpdatedCaste={setUpdatedCaste}
          statusOpen={statusOpen}
          setStatusOpen={setStatusOpen}
          updatedStatus={updatedStatus}
          setUpdatedStatus={setUpdatedStatus}
          maritalOpen={maritalOpen}
          setMaritalOpen={setMaritalOpen}
          updatedEngaged={updatedEngaged}
          setUpdatedEngaged={setUpdatedEngaged}
          updatedAge={updatedAge}
          setUpdatedAge={setUpdatedAge}
          genderOpen={genderOpen}
          setGenderOpen={setGenderOpen}
          updatedGender={updatedGender}
          setUpdatedGender={setUpdatedGender}
          loading={loading}
          updateVoterDetails={updateVoterDetails}
          openColorLegendModal={openColorLegendModal}
        />

        <ColorLegendModal
          colorLegendModalVisible={colorLegendModalVisible}
          closeColorLegendModal={closeColorLegendModal}
          handleColorSelection={handleColorSelection}
        />

        <CasteModal
          visible={casteModalVisible}
          onClose={() => setCasteModalVisible(false)}
          allCasts={allCasts}
          newCaste={newCaste}
          setNewCaste={setNewCaste}
          assignCaste={assignCaste}
          language={language}
        />

        <Sidebar
          isVisible={isSidebarVisible}
          setSidebarVisible={setSidebarVisible}
          sidebarAnimation={sidebarAnimation}
          language={language}
          navigation={navigation}
        />
      </View>
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

  blueCircle: {
    width: 20,
    height: 20,
    backgroundColor: 'blue',
    borderRadius: 15,
  },

  skyblueCircle: {
    width: 20,
    height: 20,
    backgroundColor: '#a3c6ff',
    borderRadius: 15,
  },

  blackCircle: {
    width: 20,
    height: 20,
    backgroundColor: 'black',
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
    width: 25,
    height: 25,
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


export default VoterList