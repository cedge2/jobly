const { BadRequestError } = require("../expressError");

/**
 * Generates a partial SQL update query based on the provided data and column mapping.
 *
 * This function is designed to dynamically create the 'SET' clause of an SQL 'UPDATE' statement,
 * allowing partial updates to a database record. It takes an object containing the data to update
 * and an optional mapping object to translate JavaScript-style camelCase properties to
 * SQL-style snake_case columns.
 *
 * For example, given an object {firstName: 'Aliya', age: 32} and a mapping {firstName: 'first_name'},
 * it would produce a query segment "SET "first_name"=$1, "age"=$2" and an array of values ['Aliya', 32].
 *
 * This makes it easier to construct SQL update queries with variable sets of fields without manually
 * writing each column and value, reducing the risk of SQL injection by using parameterized queries.
 *
 * @param {object} dataToUpdate - An object where keys represent column names (or JS property names
 *                                to be converted) and values represent the new values for these columns.
 * @param {object} [jsToSql] - An optional mapping object to convert JavaScript camelCase properties
 *                             to SQL snake_case columns. If a property doesn't have a mapping,
 *                             it's assumed that the property name is the same as the column name.
 * @throws {BadRequestError} If dataToUpdate is empty.
 * @returns {object} An object with two properties: 'setCols', a string containing the SET clause,
 *                   and 'values', an array of values corresponding to the placeholders in the SET clause.
 *
 * Usage example:
 * const updateData = {firstName: 'Aliya', age: 32};
 * const columnMapping = {firstName: 'first_name'};
 * const result = sqlForPartialUpdate(updateData, columnMapping);
 * // result.setCols would be '"first_name"=$1, "age"=$2'
 * // result.values would be ['Aliya', 32]
 */
function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // Maps JavaScript object keys to SQL column names and creates the SET clause
  // parts. If a key in dataToUpdate has a corresponding key in jsToSql,
  // the mapped value is used as the column name. Otherwise, the key itself is used.
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  // Returns the SET clause and the array of values for the SQL query
  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
