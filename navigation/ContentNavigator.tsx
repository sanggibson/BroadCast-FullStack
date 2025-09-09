import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CommentScreen from '@/screens/CommentScreen';
import PostDetailScreen from '@/screens/PostDetailScreen';
import LiveStreamScreen from '@/screens/LiveStreamScreen';

const ContentNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
    
    </Stack.Navigator>
  );
}

export default ContentNavigator

const styles = StyleSheet.create({})