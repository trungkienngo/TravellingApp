import AsyncStorage from "@react-native-async-storage/async-storage";
const USERS = "travel_demo_users", SESSION = "travel_demo_session";
export async function getUsers() { return JSON.parse(await AsyncStorage.getItem(USERS) || "[]"); }
export async function registerUser(email,password) {
  email=email.trim().toLowerCase(); const users=await getUsers();
  if(users.some(u=>u.email===email)) throw new Error("Email đã được đăng ký");
  const user={id:`user_${Date.now()}`,email,password}; users.push(user);
  await AsyncStorage.setItem(USERS,JSON.stringify(users)); return {id:user.id,email};
}
export async function loginUser(email,password) {
  const user=(await getUsers()).find(u=>u.email===email.trim().toLowerCase() && u.password===password);
  if(!user) throw new Error("Email hoặc mật khẩu không đúng");
  const session={id:user.id,email:user.email}; await AsyncStorage.setItem(SESSION,JSON.stringify(session)); return session;
}
export async function getCurrentUser(){return JSON.parse(await AsyncStorage.getItem(SESSION)||"null");}
export async function logoutUser(){await AsyncStorage.removeItem(SESSION);}
export async function changePassword(password){const user=await getCurrentUser();if(!user)throw new Error("Chưa đăng nhập");const users=await getUsers();const found=users.find(u=>u.id===user.id);if(!found)throw new Error("Không tìm thấy tài khoản");found.password=password;await AsyncStorage.setItem(USERS,JSON.stringify(users));}
