import { Dimensions, StyleSheet, Text, View, TextInput, FlatList, Alert } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import HeaderFooterLayout from '../../ReusableCompo/HeaderFooterLayout';
import axios from 'axios';
import { ActivityIndicator } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { LanguageContext } from '../../ContextApi/LanguageContext';
import LoadingListComponent from '../../ReusableCompo/LoadingListComponent';
import EmptyListComponent from '../../ReusableCompo/EmptyListComponent';


const scaleFontSize = (size) => Math.round(size * width * 0.0025);
const { width, height } = Dimensions.get('window');

export default function LocationWise() {
    const { language } = useContext(LanguageContext);
    const [boothValue, setBoothValue] = useState(null);
    const [boothItems, setBoothItems] = useState([]);
    const [locationValue, setLocationValue] = useState(null);
    const [locationItems] = useState([
        { label: language === 'en' ? 'In City' : 'शहरामध्ये', value: 1 },
        { label: language === 'en' ? 'Near City' : 'शहराजवळ', value: 2 },
        { label: language === 'en' ? 'Out of City' : 'शहराबाहेर', value: 3 }
    ]);

    const [voterData, setVoterData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [pdfLoading, setPdfLoading] = useState(false);

    useEffect(() => {
        fetchBoothData();
    }, []);

    const fetchBoothData = async () => {
        try {
            const response = await axios.get('http://192.168.1.8:8000/api/booths/');
            const boothOptions = response.data.map((item) => ({
                label: `${item.booth_id} - ${language === 'en' ? item.booth_name : item.booth_name_mar}`,
                value: item.booth_id,
            }));
            setBoothItems(boothOptions);
            setLoading(false);
        } catch (error) {
            Alert.alert('Error fetching booth data:', error.toString ? error.toString() : 'Unknown error');
            setLoading(false);
        }
    };

    const fetchVoterData = async () => {
        if (boothValue && locationValue) {
            setLoading(true);
            try {
                const response = await axios.get(
                    `http://192.168.1.8:8000/api/get_voter_current_location_details_by_booth/booth_id/${boothValue}/city_id/${locationValue}/`
                );
                setVoterData(response.data);
                setLoading(false);
            } catch (error) {
                Alert.alert('Error fetching voter data', error.toString ? error.toString() : 'Unknown error');

                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchVoterData();
    }, [boothValue, locationValue]);

    const handlePDFClick = async () => {
        if (!boothValue || !locationValue) {
            Alert.alert('Error', 'Please select both Booth and Location');
            return;
        }

        setPdfLoading(true);
        try {
            const response = await axios.get(
                `http://192.168.1.8:8000/api/generate_voter_pdf_by_booth/booth_id/${boothValue}/city_id/${locationValue}/`,
                { responseType: 'arraybuffer' }
            );
            const base64 = btoa(new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
            const fileUri = FileSystem.documentDirectory + 'voters_report.pdf';
            await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: FileSystem.EncodingType.Base64 });
            Alert.alert('Success', 'PDF has been saved to your device!');

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri);
            } else {
                Alert.alert('Error', 'Sharing not available on this device.');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to download the PDF.');
        } finally {
            setPdfLoading(false);
        }
    };

    const renderVoterItem = ({ item }) => (
        <View style={styles.voterItem}>
            <Text style={styles.voterText}>{language === 'en' ? 'ID' : 'आईडी'}: {item.voter_id}</Text>
            <Text style={styles.voterText}>{language === 'en' ? 'Name' : 'नाव'}: {language === 'en' ? toTitleCase(item.voter_name) : item.voter_name_mar}</Text>
            <Text style={styles.voterText}>{language === 'en' ? 'Contact' : 'संपर्क'}:
                {item.voter_contact_number ? item.voter_contact_number : 'N/A'}
            </Text>
            <Text style={styles.voterText}>{language === 'en' ? 'Location' : 'स्थान'}:
                {item.voter_current_location ? item.voter_current_location : 'N/A'}
            </Text>
        </View>
    );

    const filteredVoterData = voterData.filter((voter) =>
        voter.voter_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <HeaderFooterLayout
            showFooter={false}
            headerText={language === 'en' ? 'Location Wise Voter' : 'स्थानानुसार मतदार'}
            rightIcon={true}
            rightIconName="file-pdf"
            onRightIconPress={handlePDFClick}
        >
            <View style={styles.container}>

                <View style={styles.contentContainer}>
                    <Dropdown
                        style={styles.dropdown}
                        containerStyle={styles.dropdownContainer}
                        data={boothItems}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={language === 'en' ? 'Select Booth' : 'बूथ निवडा'}
                        searchPlaceholder={language === 'en' ? 'Search Booth' : 'बूथ शोधा'}
                        value={boothValue}
                        onChange={(item) => setBoothValue(item.value)}
                    />
                    <Dropdown
                        style={styles.dropdown}
                        containerStyle={styles.dropdownContainer}
                        data={locationItems}
                        labelField="label"
                        valueField="value"
                        placeholder={language === 'en' ? 'Select Location' : 'स्थान निवडा'}
                        value={locationValue}
                        onChange={(item) => setLocationValue(item.value)}
                    />
                    <TextInput
                        style={styles.searchBar}
                        placeholder={language === 'en' ? 'Search by name' : 'नाव शोधा'}
                        value={searchQuery}
                        onChangeText={(text) => setSearchQuery(text)}
                    />


                    <FlatList
                        data={filteredVoterData}
                        keyExtractor={(item) => item.voter_id.toString()}
                        renderItem={renderVoterItem}
                        ListHeaderComponent={loading && <LoadingListComponent />}
                        ListEmptyComponent={!loading && <EmptyListComponent />}
                    />
                </View>
            </View>
        </HeaderFooterLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 15,
    },
    contentContainer: {
        flex: 1,
    },
    dropdown: {
        height: 50,
        backgroundColor: 'white',
        borderRadius: 8,
        paddingHorizontal: 8,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: 'black',
    },
    dropdownContainer: {
        width: '90%',
        borderColor: '#9095A1',
        borderRadius: 8,
    },
    searchBar: {
        height: 50,
        backgroundColor: 'white',
        borderRadius: 8,
        borderWidth: 1,
        paddingHorizontal: 8,
        marginVertical: 10,
        borderColor: 'black',
    },
    voterItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#9095A1',
    },
    voterText: {
        fontSize: 16,
    },
    loadingContainer: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#9095A1',
    },
});
