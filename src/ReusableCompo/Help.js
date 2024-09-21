import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function Help({ navigation }) {
  return (
    <LinearGradient
      colors={['#FF9933', '#FFFFFF', '#138808']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={32} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Help</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.text}>
          If you're experiencing any issues or have questions about using the Election Portal App, here are some ways to get help:
        </Text>
        <Text style={styles.subTitle}>Contact Support</Text>
        <Text style={styles.text}>
          For immediate assistance, please contact our support team at support@electionportal.com. Our dedicated team is available to help you with any questions or concerns you may have.
        </Text>
        <Text style={styles.subTitle}>FAQs</Text>
        <Text style={styles.text}>
          Check out our Frequently Asked Questions (FAQs) section for answers to common queries and troubleshooting tips. You can access the FAQs from the app's settings menu.
        </Text>
        <Text style={styles.subTitle}>Feedback</Text>
        <Text style={styles.text}>
          We value your feedback! If you have suggestions for improvements or feature requests, please send them to feedback@electionportal.com. Your input helps us make the app better for everyone.
        </Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
    backgroundColor: 'black',
    paddingVertical: 20,
    paddingTop: 30
  },
  menuButton: {
    position: 'absolute',
    left: 20,
    paddingTop: 10,
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
  text: {
    fontSize: 18,
    textAlign: 'justify',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
});
