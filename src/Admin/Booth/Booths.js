import {
    Dimensions,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
    Alert,
    Animated
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, FontAwesome6 } from '@expo/vector-icons';
import HeaderFooterLayout from '../ReusableCompo/HeaderFooterLayout';
import axios from 'axios';
import { ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const { width, height } = Dimensions.get('screen');

const Booths = () => {
    const navigation = useNavigation();
    const [searchedValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [booths, setBooths] = useState([]);
    const [pdfLoading, setPdfLoading] = useState(false);
    const scaleValue = useRef(new Animated.Value(1)).current;

    const searchedBooth = booths.filter(booth => {
        const boothId = booth.booth_id ? booth.booth_id.toString().toLowerCase() : '';
        const boothName = booth.booth_name ? booth.booth_name.toLowerCase() : '';
        const searchValueLower = searchedValue.toLowerCase();

        return boothId.includes(searchValueLower) || boothName.includes(searchValueLower);
    });

    const fetchData = async () => {
        try {
            const response = await axios.get('http://192.168.200.23:8000/api/booths/');
            const formattedTowns = response.data;

            if (Array.isArray(formattedTowns)) {
                setBooths(formattedTowns);
            } else {
                console.error('Expected an array of booths');
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const toTitleCase = (str) => {
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    useEffect(() => {
        setLoading(true);
        fetchData();
    }, []);

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

    const handlePDFClick = async () => {
        animateButton();

        setPdfLoading(true);
        try {
            const response = await axios.get('http://192.168.200.23:8000/api/generate_pdf/', {
                responseType: 'arraybuffer',
            });

            const base64 = btoa(
                new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
            );

            const fileUri = FileSystem.documentDirectory + 'booths_report.pdf';
            await FileSystem.writeAsStringAsync(fileUri, base64, {
                encoding: FileSystem.EncodingType.Base64,
            });

            Alert.alert('Success', 'PDF has been saved to your device!');

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri);
            } else {
                Alert.alert('Error', 'Sharing not available on this device.');
            }
        } catch (error) {
            console.error('Error downloading PDF:', error);
            Alert.alert('Error', 'Failed to download the PDF.');
        } finally {
            setPdfLoading(false);
        }
    };


    return (
        <HeaderFooterLayout
            headerText="Booths List"
            showFooter={true}
            leftIcon={true}
            rightIcon={true}
            leftIconName="chevron-left"
            rightIconName="file-pdf"
            onRightIconPress={handlePDFClick}
        >
            <View style={styles.container}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="grey" />
                    <TextInput
                        value={searchedValue}
                        onChangeText={text => setSearchValue(text)}
                        placeholder="search by user’s name or ID"
                        style={styles.searchInput}
                    />
                </View>


                {(loading) ?
                    (<View style={styles.loadingContainer}>
                        <ActivityIndicator size={'small'} />
                        <Text>Loading...</Text>
                    </View>
                    ) : (
                        <View style={styles.listContainer}>
                            {searchedBooth.length > 0 ? (
                                <FlatList
                                    data={searchedBooth}
                                    keyExtractor={item => item.booth_id.toString()}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item }) => (
                                        <Pressable
                                            style={styles.voterItem}
                                            onPress={() => {
                                                navigation.navigate('Booth Voters', { boothId: item.booth_id });
                                            }}
                                        >
                                            <Text style={styles.boothIdText}>{item.booth_id}</Text>
                                            <Text style={{ flex: 1 }}>{toTitleCase(item.booth_name)}</Text>
                                        </Pressable>
                                    )}
                                />
                            ) : (
                                <Text style={styles.noDataText}>No results found</Text>
                            )}
                        </View>
                    )
                }

                {pdfLoading && (
                    <View style={styles.pdfLoadingOverlay}>
                        <ActivityIndicator size="large" color="white" />
                        <Text style={styles.pdfLoadingText}>Generating PDF...</Text>
                    </View>
                )}

                {/* <Animated.View style={[styles.pdfButtonContainer, { transform: [{ scale: scaleValue }] }]}>
                    <Pressable onPress={handlePDFClick} style={styles.pdfButton}>
                        <FontAwesome6 name="file-pdf" size={30} color="white" />
                        <Text style={styles.pdfButtonText}>Generate PDF</Text>
                    </Pressable>
                </Animated.View> */}
            </View>
        </HeaderFooterLayout>
    );
};

export default Booths;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        height: height * 0.77,
        backgroundColor: 'white',
    },
    searchContainer: {
        borderColor: '#9095A1',
        borderWidth: 1,
        borderRadius: 5,
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginVertical: 5,
        columnGap: 20,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
    },
    listContainer: {},
    voterItem: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 1,
        borderWidth: 0.1,
        gap: 10,
        alignItems: 'center',
    },
    boothIdText: {
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
    pdfButtonContainer: {
        alignSelf: 'center',
        marginVertical: 20,
    },
    pdfButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF6347',
        padding: 10,
        borderRadius: 5,
    },
    pdfButtonText: {
        color: 'white',
        marginLeft: 10,
        fontSize: 18,
        fontWeight: 'bold',
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
