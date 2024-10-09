
// import React, { useCallback } from 'react';
// import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useFocusEffect } from '@react-navigation/native';
// import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';


// const { width, height } = Dimensions.get('window');

// export default function Entry({ navigation }) {
//   const opacity = useSharedValue(0);
//   const translateY = useSharedValue(-100);

//   useFocusEffect(
//     useCallback(() => {
//       opacity.value = withTiming(1, { duration: 2500 });
//       translateY.value = withSpring(0, { damping: 5, stiffness: 200 });

//       return () => {
//         opacity.value = 0;
//         translateY.value = -100;
//       };
//     }, [])
//   );

//   const animatedButtonStyle = useAnimatedStyle(() => {
//     return {
//       opacity: opacity.value,
//     };
//   });

//   const animatedImageStyle = useAnimatedStyle(() => {
//     return {
//       transform: [{ translateY: translateY.value }],
//     };
//   });

//   return (
//     <LinearGradient
//       colors={['#FF9933', '#FFFFFF', '#138808']}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 0, y: 1 }}
//       style={styles.container}
//     >
//       <View style={styles.content}>
//         <Animated.Image source={require('../assets/d.png')} style={[styles.logo, animatedImageStyle]} />
//         <Text style={styles.title}>Welcome to Tekhno चुनाव</Text>
//         <Text style={styles.subtitle}>Your gateway to get Vote Prediction</Text>
//       </View>
//       <Animated.View style={[styles.startButtonContainer, animatedButtonStyle]}>
//         <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate('Profileselection')}>
//           <Text style={styles.startButtonText}>Start</Text>
//         </TouchableOpacity>
//       </Animated.View>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     width,
//     height,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   content: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   logo: {
//     width: 200,
//     height: 200,
//     marginBottom: 20,
//   },
//   title: {
//     color: 'black',
//     fontSize: 28,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   subtitle: {
//     color: 'black',
//     fontSize: 18,
//     textAlign: 'center',
//     marginHorizontal: 20,
//   },
//   startButtonContainer: {
//     marginBottom: 50,
//   },
//   startButton: {
//     backgroundColor: '#9cb8ff',
//     paddingVertical: 15,
//     paddingHorizontal: 40,
//     borderRadius: 30,
//     borderColor:'black'
//   },
//   startButtonText: {
//     color: 'black',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });  


import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ImageBackground, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { height, width } = Dimensions.get('window');

export default function Welcome({ navigation }) {

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Profileselection'); 
    }, 3000); 

    return () => clearTimeout(timer); 
  }, [navigation]);

  return (
    <LinearGradient
      colors={['#3C4CAC', '#F04393']}
      locations={[0.65, 1]}
      style={styles.container}
    >
      <View style={styles.photoContainer}>
        <ImageBackground
          source={require('../assets/Cover.png')}
          style={[styles.profileImage, { opacity: 0.2 }]}  
          imageStyle={{ borderBottomLeftRadius: 370, borderBottomRightRadius: 370 }}
        />
      </View>
      
      <View style={styles.logoContainer}>
        <Image 
          source={require('../assets/tekhnoblue.png')} 
          style={styles.logo} 
          resizeMode="contain" 
        />
      </View>

      <View style={styles.smallCircleContainer}>
        <Image source={require('../assets/Votee.png')} style={styles.smallCircleImage} />
      </View>

      <Text style={styles.text}>Your gateway to get Vote Prediction</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  photoContainer: {
    width: width * 1.5,
    height: height * 0.65,
    borderBottomLeftRadius: 370,
    borderBottomRightRadius: 370,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    top: 0,
    left: -width * 0.25,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  logoContainer: {
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: (width * 0.3) / 2,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: height * 0.3 - (width * 0.25), 
    left: width * 0.5 - (width * 0.25),
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  smallCircleContainer: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: (width * 0.25) / 2,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    top: height * 0.65 - (width * 0.125),
    left: width * 0.5 - (width * 0.125),
    borderWidth: 5,
    borderColor: '#FFFFFF',
  },
  smallCircleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  text: {
    fontSize: 24,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: height * 0.45,
  },
});
