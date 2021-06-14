import AsyncStorage from '@react-native-community/async-storage';

class Store {
  __token = '';
  __refresh_token = '';
  __username = '';
  //Token
  async getToken() {
    return this.__token || (await AsyncStorage.getItem('green_star_token'));
  }

  async setToken(token) {
    this.__token = token;
    await AsyncStorage.setItem('green_star_token', token);
  }

  async removeToken() {
    this.__token = '';
    await AsyncStorage.removeItem('green_star_token');
  }
  //Username
  async getUsername() {
    return (
      this.__username || (await AsyncStorage.getItem('green_star_username'))
    );
  }

  async setUsername(username) {
    this.__username = username;
    await AsyncStorage.setItem('green_star_username', username);
  }

  async removeUsername() {
    this.__username = '';
    await AsyncStorage.removeItem('green_star_username');
  }
  //Refresh token
  async getRefreshToken() {
    return (
      this.__refresh_token ||
      (await AsyncStorage.getItem('green_star_refresh_token'))
    );
  }

  async setRefreshToken(token) {
    this.__refresh_token = token;
    await AsyncStorage.setItem('green_star_refresh_token', token);
  }

  async removeRefreshToken() {
    this.__refresh_token = '';
    await AsyncStorage.removeItem('green_star_refresh_token');
  }

  async getVal(key) {
    return await AsyncStorage.getItem(key);
  }
  async setVal(key, value) {
    return await AsyncStorage.setItem(key, value);
  }
}

const AppStorage = new Store();

export default AppStorage;
