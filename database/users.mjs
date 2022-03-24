import database from './connection.mjs';

class Users {
  static async login ({ email, password }) {
    const sql = `
      SELECT
        id,
        email,
        first_name, 
        last_name,
        to_char(date_of_birth, 'DD.MM.YYYY') as date_of_birth,
        country
      FROM
        users
      WHERE
        email = $1 AND password = md5(md5(md5($2)));
    `
    
    const result = await database.query(sql, [ email, password ]);
    return result.rows || []
  }
}

export default Users;