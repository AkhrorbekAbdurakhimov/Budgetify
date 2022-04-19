import database from './connection.mjs';

class Categories {
  static async getCategories(type = null) {
    const sql = `
      SELECT 
        * 
      FROM 
        categories
      ${type ? `WHERE type = '${type}'` : ''};
    `;
    const result = await database.query(sql);
    return result.rows || [];
  }
  
  static async addCategory({ title, type }) {
    const sql = `
      INSERT INTO categories (
        title, 
        type
      ) VALUES (
        $1, $2
      )
    `
    
    const result = await database.query(sql, [title, type]);
    return result.rows || [];
  }
  
  static async updateCategory({ id, title }) {
    const sql = `
      UPDATE 
        categories
      SET 
        title = $2
      WHERE 
        id = $1;
    `
    
    await database.query(sql, [id, title]);
  }
  
  static async deleteCategory(id) {
    const sql = `
      DELETE FROM categories WHERE id = $1;
    `;
    
    await database.query(sql, [id]);
  }
}

export default Categories;