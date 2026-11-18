import React from "react";
import { View, Text, TouchableOpacity, Linking, StyleSheet } from "react-native";

export default function MapScreen({ route, navigation }) {
  const { latitude, longitude } = route?.params || {};
  const lat = Number(latitude), lon = Number(longitude);
  const valid = Number.isFinite(lat) && Number.isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180;
  const url = valid ? `https://www.google.com/maps/search/?api=1&query=${lat},${lon}` : null;
  return <View style={styles.container}>
    <Text style={styles.title}>Vị trí địa điểm</Text>
    <Text style={styles.note}>{valid ? `${lat}, ${lon}` : 'Chưa có tọa độ hợp lệ'}</Text>
    {url && <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(url)}><Text style={styles.buttonText}>Xem trên Google Maps</Text></TouchableOpacity>}
    <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>Quay lại</Text></TouchableOpacity>
  </View>;
}
const styles = StyleSheet.create({container:{flex:1,justifyContent:'center',alignItems:'center',padding:24,backgroundColor:'#fff'},title:{fontSize:22,fontWeight:'bold',marginBottom:16},note:{marginBottom:18},button:{backgroundColor:'#0676ba',padding:14,borderRadius:8},buttonText:{color:'#fff'},back:{marginTop:24,color:'#0676ba'}});
