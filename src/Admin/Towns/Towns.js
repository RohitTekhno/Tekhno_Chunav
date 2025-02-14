import { Dimensions, FlatList, Pressable, StyleSheet, Text, TextInput, View, Alert, Animated } from 'react-native';
import React, { useEffect, useState, useRef, useContext } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { LanguageContext } from '../../ContextApi/LanguageContext';
import HeaderFooterLayout from '../../ReusableCompo/HeaderFooterLayout';
import LoadingListComponent from '../../ReusableCompo/LoadingListComponent';
import EmptyListComponent from '../../ReusableCompo/EmptyListComponent';

const { width, height } = Dimensions.get('screen');
const API_BASE_URL = 'http://192.168.1.8:8000/api/';

const Towns = () => {
    const { language, toggleLanguage } = useContext(LanguageContext);
    const navigation = useNavigation();
    const [searchedValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [pdfLoading, setPdfLoading] = useState(false);
    const [towns, setTowns] = useState([]);
    const scaleValue = useRef(new Animated.Value(1)).current;

    const searchedTown = towns.filter(town =>
        (town.town_name && town.town_name.toString().toLowerCase().includes(searchedValue.toLowerCase())) ||
        (town.town_name_mar && town.town_name_mar.toString().toLowerCase().includes(searchedValue.toLowerCase())) ||
        (town.town_id && town.town_id.toString().includes(searchedValue))
    );

    const fetchData = async () => {
        try {
            const statesResponse = await axios.get(`${API_BASE_URL}towns/`);
            const formattedTowns = statesResponse.data;
            if (Array.isArray(formattedTowns)) {
                setTowns(formattedTowns);
            } else {
                Alert.alert('Expected an array of towns');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch town data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const animateButton = () => {
        Animated.sequence([
            Animated.timing(scaleValue, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true
            }),
            Animated.timing(scaleValue, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true
            }),
        ]).start();
    };

    const toTitleCase = (str) => {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const handlePDFClick = async () => {
        animateButton();
        setPdfLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}voter_town_count/`, { responseType: 'arraybuffer' });
            const base64 = btoa(new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
            const fileUri = FileSystem.documentDirectory + 'booths_report.pdf';
            await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: FileSystem.EncodingType.Base64 });
            //Alert.alert('Success', 'PDF has been saved to your device!');

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

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <HeaderFooterLayout
            headerText={language === 'en' ? 'Town List' : 'शहर/गावांची यादी'}
            showHeader={true}
            showFooter={false}
            rightIconName="file-pdf"
            onRightIconPress={handlePDFClick}
        >
            <View style={styles.container}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="grey" />
                    <TextInput
                        value={searchedValue}
                        onChangeText={setSearchValue}
                        placeholder={language === 'en' ? 'Search Town by name or ID' : 'नाव किंवा आयडीनुसार गाव/शहर शोधा'}
                        style={styles.searchInput}
                    />
                </View>

                <View style={styles.listContainer}>
                    <FlatList
                        data={searchedTown}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, index }) => (
                            <Pressable
                                style={styles.voterItem}
                                onPress={() => navigation.navigate('Town Voters', { townId: item.town_id, townName: language === 'en' ? toTitleCase(item.town_name) : item.town_name_mar })}
                            >
                                <View style={styles.voterDetails}>
                                    <Text style={styles.index}>{index + 1}</Text>
                                    {/* <Text style={styles.townId}>{item.town_id}</Text> */}
                                    <Text>{language === 'en' ? toTitleCase(item.town_name) : item.town_name_mar}</Text>
                                </View>
                            </Pressable>
                        )}
                        ListHeaderComponent={loading && <LoadingListComponent />}
                        ListEmptyComponent={!loading && <EmptyListComponent />}
                    />
                </View>

                {pdfLoading && (
                    <View style={styles.pdfLoadingOverlay}>
                        <ActivityIndicator size="large" color="white" />
                        <Text style={styles.pdfLoadingText}>Generating PDF...</Text>
                    </View>
                )}
            </View>
        </HeaderFooterLayout>
    );
};

export default Towns;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
    },
    searchContainer: {
        borderColor: '#9095A1',
        borderWidth: 1,
        borderRadius: 5,
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginVertical: 10,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 10
    },
    listContainer: {
        flex: 1,
    },
    voterItem: {
        paddingVertical: 12,
        paddingHorizontal: 15,
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 1,
        borderWidth: 0.1,
    },
    voterDetails: {
        flexDirection: 'row',
        gap: 10,
    },
    townId: {
        borderWidth: 1,
        borderColor: 'blue',
        width: 30,
        textAlign: 'center',
        borderRadius: 3,
        fontWeight: '700',
    },
    index: {
        borderWidth: 1,
        borderColor: 'blue',
        width: 30,
        textAlign: 'center',
        borderRadius: 3,
        fontWeight: '700',
    },
    noDataText: {
        textAlign: 'center',
        marginVertical: 20,
        fontSize: 16,
        color: 'gray',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pdfLoadingOverlay: {
        height: '120%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pdfLoadingText: {
        color: 'white',
        fontSize: 18,
        marginTop: 10,
    },
});
