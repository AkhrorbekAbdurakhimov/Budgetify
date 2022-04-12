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
  
  static async getTransactions(accountId) {
    const sql = `
      SELECT 
        t.id, 
        t.title,
        t.description, 
        t.type,
        t.amount, 
        cu.title AS currency,
        to_char(t.date, 'DD.MM.YYYY') as date, 
        c.title as categoryName
      FROM 
        transactions t
      JOIN
        accounts a ON a.id = t.account_id
      JOIN 
        currencies cu ON cu.id = a.currency_id
      JOIN 
        categories c ON c.id = t.category_id     
      WHERE
        t.account_id = $1   
      ORDER BY 
        date desc;
    `;
    
    const result = await database.query(sql, [accountId]);
    return result.rows || [];
  }
  
  static async getTransaction(id) {
    const sql = `
      SELECT
        t.title,
        t.description, 
        t.type,
        t.amount, 
        cu.title AS currency,
        to_char(t.date, 'DD.MM.YYYY') as date, 
        c.title as categoryName
      FROM 
        transactions t
      JOIN 
        categories c ON c.id = t.category_id
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
  
  static async addTransaction({ title, description = null, accountId, type, categoryId, amount, date = null }) {
    const sql = `
      INSERT INTO transactions (
        title,
        description,
        account_id,
        type,
        category_id,
        amount,
        date
      ) VALUES (
        $1, $2, $3, $4, $5, $6, ${date ? `'${date}'` : 'NOW()::DATE'}
      );
    `;
    
    await database.query(sql, [title, description, accountId, type, categoryId, amount]);
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
  
  static async isCategoryExist(categortId) {
    const sql = `
      SELECT id FROM transactions WHERE category_id = $1;
    `;
    
    const result = await database.query(sql, [categortId]);
    return result.rows || [];
  }
}

export default Transactions;