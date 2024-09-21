import { Entypo, FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';

import { LinearGradient } from 'expo-linear-gradient';
import { Linking } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const AboutUs = () => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <LinearGradient
            colors={['#FF9933', '#FFFFFF', '#138808']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.container}
        >
            <View style={styles.header}>
                <Text style={styles.headerText}>About Us</Text>
            </View>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.text}>
                    • In the dynamic world of politics, efficiency and organization are key to successful campaign management.
                    Our Election Portal App is designed with the specific needs of political parties in mind, providing a robust tool
                    for karyakartas to manage voter information and polling booth activities seamlessly.
                </Text>

                <Text style={styles.subTitle}>Our Mission</Text>
                <Text style={styles.text}>
                    • At Election Portal, our mission is to empower political parties and their karyakartas with cutting-edge technology
                    that simplifies the voting process, ensures accurate record-keeping, and enhances overall election management. We believe
                    that by streamlining these processes, we can contribute to fairer and more transparent elections, fostering a stronger
                    democratic process.
                </Text>

                <Text style={styles.subTitle}>What We Offer</Text>
                <Text style={styles.text}>
                    • The Election Portal App is a comprehensive solution that allows karyakartas to efficiently manage voter data during elections.
                    Here’s how we make it happen:
                </Text>
                <Text style={styles.listItem}>• Real-time Voter Management: Karyakartas can easily mark and update records of each voter who casts their vote at polling booths. This ensures up-to-date and accurate voter lists.</Text>
                <Text style={styles.listItem}>• Seamless Coordination: The app facilitates better communication and coordination among karyakartas and party leaders, ensuring everyone is on the same page.</Text>
                <Text style={styles.listItem}>• Data Security: We prioritize the security of voter information, employing advanced encryption methods to protect data from unauthorized access.</Text>
                <Text style={styles.listItem}>• User-friendly Interface: The app is designed to be intuitive and easy to navigate, so karyakartas can focus on their tasks without being bogged down by technical complexities.</Text>
                <Text style={styles.listItem}>• Exit Polls: After voting is done, we provide fast and nearly accurate exit polls. This feature helps political parties gauge public opinion and predict election outcomes quickly and effectively.</Text>

                <Text style={styles.subTitle}>Our Vision</Text>
                <Text style={styles.text}>
                    • We envision a future where technology plays a pivotal role in enhancing the electoral process. By providing a platform that
                    integrates modern tech solutions with traditional political workflows, we aim to make elections more efficient, transparent, and accessible.
                    Our goal is to support political parties in their efforts to engage with voters, understand their needs, and ensure that every vote is counted accurately.
                </Text>

                <Text style={styles.subTitle}>Why Choose Election Portal App?</Text>
                <Text style={styles.listItem}>• Tailored for Political Parties: Unlike generic management tools, our app is specifically designed for the unique requirements of political campaign management.</Text>
                <Text style={styles.listItem}>• Reliable and Scalable: Whether it's a local election or a national campaign, our app scales to meet the demands of your operations.</Text>
                <Text style={styles.listItem}>• Dedicated Support: Our team is committed to providing exceptional support to ensure that your experience with the Election Portal App is smooth and trouble-free.</Text>

                <Text style={styles.subTitle}>Join Us</Text>
                <Text style={styles.text}>
                    • We invite political parties and their dedicated karyakartas to join us in revolutionizing the way elections are managed. Together,
                    we can make a significant impact on the democratic process, ensuring that it remains robust and true to its principles.
                </Text>
                <Text style={styles.text}>• Thank you for choosing the Election Portal App. Let’s work together for a brighter and more transparent electoral future.</Text>

                <Text style={styles.subTitle}>Gallery</Text>
                <View style={styles.imageContainer}>
                    <Image source={require('../../assets/booth1.jpeg')} style={styles.image} />
                    <Image source={require('../../assets/booth2.jpeg')} style={styles.image} />
                    <Image source={require('../../assets/booth3.jpeg')} style={styles.image} />
                    <Image source={require('../../assets/booth4.jpeg')} style={styles.image} />
                </View>
            </ScrollView>
            <View style={styles.footer}>
                <View style={styles.footerLeft}>
                    <TouchableOpacity onPress={() => Linking.openURL('https://www.instagram.com/tekhnologia_innovations/?igsh=MWE4Y21yeW80MW0yMg%3D%3D')}>
                        <Entypo name="instagram" size={32} color="#fff" style={styles.icon} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => Linking.openURL('https://www.linkedin.com/company/tekhnologia-innovations-india-private-limited/')}>
                        <FontAwesome name="linkedin" size={32} color="#fff" style={styles.icon} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => Linking.openURL('https://www.tekhnologiaindia.com/')}>
                        <MaterialIcons name="public" size={32} color="#fff" style={styles.icon} />
                    </TouchableOpacity>

                </View>
            </View>
        </LinearGradient>
    )
}

export default AboutUs
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 40,
        paddingBottom: 20,
        backgroundColor: 'black',
        width: '100%',
        position: 'relative',
    },
    menuButton: {
        position: 'absolute',
        left: 20,
    },
    headerText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    content: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    text: {
        fontSize: 18,
        textAlign: 'justify',
        marginBottom: 10,
    },
    listItem: {
        fontSize: 16,
        textAlign: 'justify',
        marginBottom: 5,
        marginLeft: 10,
    },
    imageContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    image: {
        width: 300,
        height: 200,
        borderRadius: 20,
        marginHorizontal: 5,
        margin: 20,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: 'black',
    },
    footerLeft: {
        flexDirection: 'row',
    },
    icon: {
        marginHorizontal: 10,
    },
    helpButton: {
        alignItems: 'flex-end',
    },
    helpText: {
        color: '#fff',
        fontSize: 18,
    },
});