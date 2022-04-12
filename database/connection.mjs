import pkg from 'pg';
import config from './../config/index.mjs';

const { Pool } = pkg;

class Database {
  constructor() {
    this.pool = new Pool(config.pgConfig);
  }

  query(query, params) {
    return new Promise((resolve, reject) => this.pool.query(query, params, (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    }));
  }
}

const database = new Database();

export default database;