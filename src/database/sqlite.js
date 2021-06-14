import db from './database';

export const insertQuery = (params = [], data = [], tblName) =>
  new Promise((resolve, reject) => {
    const keys = Object.keys(data[0]);
    let query = `INSERT INTO ${tblName} (${keys.join(', ')}) VALUES`;
    for (let i = 0; i < data.length; ++i) {
      const values = Object.values(data[i]);
      query = query + `(${values.map(el => `'${el}'`).join(', ')})`;
      if (i != data.length - 1) {
        query = query + ',';
      }
    }
    const deleteQuery = `DELETE FROM ${tblName}`;
    query = query + ';';

    db.transaction(trans => {
      trans.executeSql(
        deleteQuery,
        [],
        (trans, results) => {
          trans.executeSql(
            query,
            params,
            (trans, results) => {
              resolve(results);
            },
            error => {
              reject(error);
            },
          );
        },
        error => {
          reject(error);
        },
      );
    });
  });

export const selectQuery = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.transaction(trans => {
      trans.executeSql(
        sql,
        params,
        (trans, results) => {
          resolve(results);
        },
        error => {
          reject(error);
        },
      );
    });
  });

export const deleteAllQuery = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.transaction(trans => {
      trans.executeSql(
        sql,
        params,
        (trans, results) => {
          resolve(results);
        },
        error => {
          reject(error);
        },
      );
    });
  });

export const deleteWithIdsQuery = (params = [], tblName, field = 'id') =>
  new Promise((resolve, reject) => {
    db.transaction(trans => {
      let placeholder = Array(params.length).fill('?').join(',');
      let sql = `DELETE FROM ${tblName} WHERE ${field} IN (${placeholder})`;
      console.log(sql);

      trans.executeSql(
        sql,
        params,
        (trans, results) => {
          resolve(results);
        },
        error => {
          reject(error);
        },
      );
    });
  });
