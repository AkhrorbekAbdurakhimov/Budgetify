import database from './connection.mjs';

class Statistics {
  static async getStatisitcs(accountId) {
    const sql = `
      SELECT 
        to_char(date, 'YYYY Month') AS title,
        SUM(amount) FILTER (WHERE type = 'income') AS income,
        SUM(amount) FILTER (WHERE type = 'expense') AS expense
      FROM
        transactions t
      JOIN
        accounts a ON a.id = t.account_id
      WHERE 
        t.account_id = $1
      GROUP BY 
        to_char(date, 'YYYY Month')
    `
    const result = await database.query(sql, [accountId]);
    return result.rows || [];
  }
}

export default Statistics;