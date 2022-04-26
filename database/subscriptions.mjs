import database from './connection.mjs';

class Subscriptions {
  static async getSubscriptions(accountId) {
    const sql = `
      SELECT 
        s.id,
        s.title,
        s.categories,
        s.amount,
        s.description,
        to_char(s.initial_date + interval '1 month', 'DD.MM.YYYY') as "initialDate",
        to_char(s.last_date, 'DD.MM.YYYY') as "lastDate",
        c.title as currency
      FROM 
        subscriptions s
      JOIN accounts a ON a.id = s.account_id
      JOIN currencies c ON c.id = a.currency_id
      WHERE a.id = $1;
    `
    const result = await database.query(sql, [accountId]);
    return result.rows || [];
  }
  
  static async getSubscription (subscriptionId) {
    const sql = `
      SELECT 
        s.id,
        s.title,
        s.categories,
        s.amount,
        s.description,
        to_char(s.initial_date, 'DD.MM.YYYY') as "initialDate",
        to_char(s.last_date, 'DD.MM.YYYY') as "lastDate",
        c.title as currency
      FROM 
        subscriptions s
      JOIN accounts a ON a.id = s.account_id
      JOIN currencies c ON c.id = a.currency_id
      WHERE s.id = $1;
    `
    const result = await database.query(sql, [subscriptionId]);
    return result.rows || [];
  }
  
  static async addSubscription({ accountId, title, categories, amount, initialDate, lastDate = null, description = null }) {
    const sql = `
      INSERT INTO subscriptions (
        title,
        categories,
        amount,
        initial_date,
        account_id,
        last_date,
        description
      ) VALUES (
        $1, '{"${categories.join('", "')}"}', $2, $3, $4, $5, $6
      ) RETURNING *
    `
    
    const result = await database.query(sql, [title, amount, initialDate, accountId, lastDate, description]);
    return result.rows || [];
  }
}

export default Subscriptions;