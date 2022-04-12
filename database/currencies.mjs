import database from './connection.mjs';

class Currencies {
  static async getCurrencies(countryId) {
    const sql = `
      SELECT 
        id, 
        title,
        CASE
          WHEN country_id = $1 THEN TRUE
          ELSE FALSE
        END AS "isDefault"
      FROM 
        currencies;
    `;
    
    const result = await database.query(sql, [countryId]);
    return result.rows || [];
  }
  
  static async getCurrency(currencyId, countryId) {
    const sql = `
      SELECT 
        id, 
        title,
        CASE
          WHEN country_id = $2 THEN TRUE
          ELSE FALSE
        END AS "isDefault"
      FROM 
        currencies
      WHERE id = $1;
    `;
    
    const result = await database.query(sql, [currencyId, countryId]);
    return result.rows || [];
  }
}

export default Currencies;