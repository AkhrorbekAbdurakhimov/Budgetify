import database from './connection.mjs';

class Transactions {
  static async beginTransaction() {
    await database.query(`BEGIN;`);
  }
  
  static async commitTransaction() {
    await database.query(`COMMIT;`);
  }
  
  static async rollbackTransaction() {
    await database.query(`ROLLBACK;`);
  }
  
  static async getTransactions(accountId, type, order) {
    const sql = `
      SELECT 
        t.id, 
        t.title,
        t.description, 
        t.type,
        t.amount, 
        cu.title AS currency,
        to_char(t.date, 'DD.MM.YYYY') as date, 
        (
          SELECT 
            jsonb_agg(
              json_build_object(
                'id', id,
                'title', title
              )
            )
          FROM
            categories
          WHERE id = ANY (t.category_ids)
        ) AS categories
      FROM 
        transactions t
      JOIN
        accounts a ON a.id = t.account_id
      JOIN 
        currencies cu ON cu.id = a.currency_id   
      WHERE
        t.account_id = $1 ${type ? ` AND t.type = $2::transactions_type` : ''}
      ORDER BY 
        t.date ${order};
    `;
    
    const result = await database.query(sql, type ? [accountId, type] : [accountId]);
    return result.rows || [];
  }
  
  static async getTransaction(id) {
    const sql = `
      SELECT
        t.id,
        t.title,
        t.description, 
        t.type,
        t.amount, 
        t.account_id AS "accountId",
        cu.title AS currency,
        to_char(t.date, 'DD.MM.YYYY') as date, 
        (
          SELECT 
            jsonb_agg(
              json_build_object(
                'id', id,
                'title', title
              )
            )
          FROM
            categories
          WHERE id = ANY (t.category_ids)
        ) AS categories
      FROM 
        transactions t
      JOIN
        accounts a ON a.id = t.account_id
      JOIN
        currencies cu ON cu.id = a.currency_id
      WHERE 
        t.id = $1
      ORDER BY 
        date desc;
    `;
    
    const result = await database.query(sql, [id]);
    return result.rows || [];
  }
  
  static async addTransaction({ title, description = null, accountId, type, categoryIds, amount, date }) {
    const sql = `
      INSERT INTO transactions (
        title,
        description,
        account_id,
        type,
        category_ids,
        amount,
        date
      ) VALUES (
        $1, $2, $3, $4, '{${categoryIds.join(",")}}', $5, $6
      );
    `;
    
    await database.query(sql, [title, description, accountId, type, amount, date]);
  }
  
  static async updateTransaction(id, amount, accountId) {
    const sql = `
      UPDATE 
        transactions 
      SET
        account_id = $2,
        amount = $3
      WHERE 
        id = $1
    `
    await database.query(sql, [id, accountId, amount]);
  }
  
  static async updateTransactionDetails(id, title = null, description = null, categoryId = null, date = null) {
    const sql = `
      UPDATE 
        transactions 
      SET
        title = COALESCE($2, title),
        description = COALESCE($3, description),
        category_id = COALESCE($4, category_id),
        date = COALESCE($5, date)
      WHERE 
        id = $1
    `
    await database.query(sql, [id, title, description, categoryId, date]);
  }
  
  static async deleteTransaction(id) {
    const sql = `
      DELETE FROM transactions WHERE id = $1;
    `;
    await database.query(sql, [id]);
    
  }
  
  static async deleteTransactionsByAccountId(accountId) {
    const sql = `
      DELETE FROM transactions WHERE account_id = $1;
    `;
    await database.query(sql, [accountId]);
  }
  
  static async isCategoryExist(categortId) {
    const sql = `
      SELECT id FROM transactions WHERE $1 = ANY (category_ids);
    `;
    
    const result = await database.query(sql, [categortId]);
    return result.rows || [];
  }
}

export default Transactions;