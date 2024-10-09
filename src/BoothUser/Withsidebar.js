// src/Sidebar.js
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Sidebar from './Sidebar';

export default function withSidebar(WrappedComponent) {
  return function WithSidebar(props) {
    const [isSidebarVisible, setSidebarVisible] = useState(false);

    const toggleSidebar = () => {
      setSidebarVisible(!isSidebarVisible);
    };

    return (
      <View style={styles.container}>
        <WrappedComponent {...props} toggleSidebar={toggleSidebar} />
        {isSidebarVisible && (
          <Sidebar navigation={props.navigation} onClose={toggleSidebar} />
        )}
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

