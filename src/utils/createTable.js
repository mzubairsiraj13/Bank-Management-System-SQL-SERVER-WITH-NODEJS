import sql from 'mssql';

const createTable = async (tableName, tableQuery) => {
    try {
        const newTable = await sql.query(
            `IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = '${tableName}' AND type = 'U')
         ${tableQuery}
        `,
        );
        console.log(`${tableName} is ensured to be present in database!`);
        return newTable;
    } catch (error) {
        console.log(`Error occured while creating table ${tableName, error}`);
    }
};
 



export default createTable;