import SQLite from 'react-native-sqlite-storage';

// SQLite.enablePromise(false);

const db = SQLite.openDatabase(
  {
    name: 'phongxa.sqlite3',
    createFromLocation: 1,
    location: 'default',
  },
  () => {
    console.log('Open Database Successful');
  },
  error => {
    console.log('ERROR: ' + error);
  },
);

export default db;
