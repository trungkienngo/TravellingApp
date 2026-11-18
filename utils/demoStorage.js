import AsyncStorage from "@react-native-async-storage/async-storage";
import {getCurrentUser} from "./authStorage";
const key=async type=>{const user=await getCurrentUser();if(!user)throw new Error("Vui lòng đăng nhập");return `travel_${type}_${user.id}`;};
export async function getFavorites(){return JSON.parse(await AsyncStorage.getItem(await key("favorites"))||"[]");}
export async function toggleFavorite(item){const k=await key("favorites");const all=await getFavorites();const found=all.some(f=>f.placeId===item.placeId);const next=found?all.filter(f=>f.placeId!==item.placeId):[...all,item];await AsyncStorage.setItem(k,JSON.stringify(next));return !found;}
export async function getBookings(){return JSON.parse(await AsyncStorage.getItem(await key("bookings"))||"[]");}
export async function saveBooking(item){const k=await key("bookings");const all=await getBookings();if(!all.some(b=>b.payID===item.payID)){all.push(item);await AsyncStorage.setItem(k,JSON.stringify(all));}}
export async function getReviews(id){return JSON.parse(await AsyncStorage.getItem(`travel_reviews_${id}`)||"[]");}
export async function addReview(id,review){const k=`travel_reviews_${id}`;await AsyncStorage.setItem(k,JSON.stringify([...(await getReviews(id)),review]));}
export const deleteBooking = async (payID) => {
  const k = await key("bookings");
  const updatedBookings = (await getBookings()).filter(
    (booking) => String(booking.payID) !== String(payID)
  );
  await AsyncStorage.setItem(k, JSON.stringify(updatedBookings));
  return updatedBookings;
};