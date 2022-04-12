import database from './connection.mjs';

class Users {
  static async login ({ email, password }) {
    const sql = `
      SELECT
        u.id,
        u.email,
        u.first_name AS "firstName", 
        u.last_name AS "lastName",
        to_char(u.date_of_birth, 'DD.MM.YYYY') AS "dateOfBirth",
        con.title AS country,
        c.title AS currency
      FROM
        users u
      JOIN 
        currencies c ON c.country_id = u.country_id
      JOIN
        countries con ON con.id = u.country_id
      WHERE
        u.email = $1 AND u.password = md5(md5(md5($2)));
    `
    
    const result = await database.query(sql, [ email, password ]);
    return result.rows || []
  }
}

export default Users;