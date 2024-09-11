import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions, Alert, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import HeaderFooterLayout from '../ReusableCompo/HeaderFooterLayout';
import Octicons from '@expo/vector-icons/Octicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const { width, height } = Dimensions.get('window');

export default function TownUserReg({ navigation, toggleSidebar }) {
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [password, setPassword] = useState('');
    const [townId, setTownId] = useState('');
    const [nameError, setNameError] = useState('');
    const [contactError, setContactError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [townIdError, setTownIdError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [towns, setTowns] = useState([]);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState([]);
    const [items, setItems] = useState([]);

    useEffect(() => {
        axios.get('http://192.168.200.23:8000/api/towns/')
            .then(response => {
                const townsData = response.data.map(town => ({
                    label: `${town.town_id} - ${town.town_name}`,
                    value: town.town_id
                }));
                setItems(townsData);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    const validate = () => {
        let isValid = true;
        const nameRegex = /^[A-Za-z\s]{2,}$/;
        const contactRegex = /^\d{10}$/;

        if (!name) {
            setNameError('Name is required.');
            isValid = false;
        } else if (!nameRegex.test(name)) {
            setNameError('Name must be at least 2 characters long and contain only alphabets.');
            isValid = false;
        } else {
            setNameError('');
        }

        if (!contact) {
            setContactError('Contact is required.');
            isValid = false;
        } else if (!contactRegex.test(contact)) {
            setContactError('Contact must be exactly 10 digits long and contain only numbers.');
            isValid = false;
        } else {
            setContactError('');
        }

        if (!password) {
            setPasswordError('Password is required.');
            isValid = false;
        } else if (password.length < 5) {
            setPasswordError('Password must be at least 5 characters long.');
            isValid = false;
        } else {
            setPasswordError('');
        }

        if (!value) {
            setTownIdError('Town is required.');
            isValid = false;
        } else {
            setTownIdError('');
        }

        return isValid;
    };

    const handleSignUp = async () => {
        if (validate()) {
            setLoading(true);
            try {
                const response = await axios.post('http://192.168.200.23:8000/api/town_user_register/', {
                    town_user_name: name,
                    town_user_contact_number: contact,
                    town_user_password: password,
                    town_ids: value,
                });
                Alert.alert('Success', 'Signup successful', [{ text: 'OK', onPress: () => navigation.navigate('Dashboard'), }]);
            } catch (error) {
                console.error('Signup failed', error);
                Alert.alert('Error', 'Signup failed. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    const hasErrors = () => {
        return nameError || contactError || passwordError || townIdError;
    };

    return (
        <HeaderFooterLayout showFooter={true}>
            <View style={{ height: height * 0.3, width: width }}>
                <LinearGradient
                    colors={['#3C4CAC', '#F04393']}
                    locations={[0.1, 1]}
                    style={styles.container}
                >
                    <View style={styles.nav}>
                        <Pressable onPress={handleGoBack} style={styles.iconLeft}>
                            <Octicons name="chevron-left" size={24} color="white" />
                        </Pressable>

                        <Text style={styles.text}>Registration</Text>

                        <View style={styles.iconRight} />
                    </View>

                </LinearGradient>
            </View>

            <View style={[styles.formContainer, { height: hasErrors() ? height * 0.7 : height * 0.6 }]}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Town User</Text>
                </View>

                <View style={{ paddingVertical: 20 }}>
                    <TextInput style={styles.input} placeholder="Enter Username : "
                        placeholderTextColor="grey"
                        value={name} onChangeText={setName}
                    />
                    {nameError ? <Text style={styles.errorText}>*{nameError}</Text> : null}

                    <TextInput style={styles.input} placeholder="Enter Contact No : "
                        placeholderTextColor="grey" value={contact}
                        onChangeText={setContact} keyboardType="phone-pad"
                    />
                    {contactError ? <Text style={styles.errorText}>*{contactError}</Text> : null}

                    <View style={[styles.input, styles.passwordContainer]}>
                        <TextInput style={[styles.passwordInput, { flex: 1 }]}
                            placeholder="Password : " placeholderTextColor="grey"
                            secureTextEntry={!isPasswordVisible} value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                            <Ionicons name={isPasswordVisible ? 'eye' : 'eye-off'} size={24} color="#000" />
                        </TouchableOpacity>
                    </View>
                    {passwordError ? <Text style={styles.errorText}>*{passwordError}</Text> : null}

                    {/* <DropDownPicker
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setItems}
                        multiple={true}
                        min={0}
                        placeholder="Select Town :"
                        placeholderStyle={{ color: 'grey' }}
                        containerStyle={styles.dropdownContainer}
                        style={styles.dropdown}
                        listItemContainerStyle={styles.dropdownContaint}
                        zIndex={9999}
                    /> */}

                    <DropDownPicker
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setItems}
                        multiple={true}
                        min={0}
                        placeholder="Select Town :"
                        placeholderStyle={{ color: 'grey' }}
                        containerStyle={styles.dropdownContainer}
                        style={styles.dropdown}
                        selectedItemContainerStyle={styles.selectedItem}
                        listItemContainerStyle={styles.dropdownContaint}
                        zIndex={9999}
                        showArrow={true}
                    />



                    {townIdError ? <Text style={styles.errorText}>*{townIdError}</Text> : null}
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? 'Signing Up...' : 'Register'}</Text>
                </TouchableOpacity>
            </View>
        </HeaderFooterLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    nav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 30,
    },
    text: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    iconLeft: {
        flex: 1,
        alignItems: 'flex-start',
    },
    iconRight: {
        flex: 1,
        alignItems: 'flex-end',
    },
    header: {
        width: '100%',
        alignItems: 'center',
        borderBottomWidth: 1,
        justifyContent: 'center',
    },
    headerText: {
        color: 'black',
        fontSize: 20,
        fontWeight: '700',
        marginVertical: 10,
    },
    formContainer: {
        width: '90%',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'white',
        paddingVertical: 20,
        paddingHorizontal: 10,
        margin: 10,
        borderRadius: 15,
        top: -width * 0.3,
        elevation: 5,
    },
    input: {
        marginBottom: 15,
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        color: '#000',
        borderWidth: 0.5,
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: '#E54394',
        alignSelf: 'center',
        paddingVertical: 10,
        paddingHorizontal: 50,
        zIndex: 1000,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        marginBottom: height * 0.03,
        marginTop: -10
    },
    dropdownContainer: {
        width: '100%',
        marginBottom: 10,
    },
    dropdown: {
        backgroundColor: '#ffffff',
        borderRadius: 5,
        borderWidth: 0.5,
        paddingHorizontal: 20,
    },
    dropdownContaint: {
        backgroundColor: '#ffffff',
        borderRadius: 5,
        paddingHorizontal: 20,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    passwordInput: {
        height: '100%',
        color: '#000',
        borderRadius: 5,
    },
    eyeIcon: {
        marginTop: 5,
    },
});

