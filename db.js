const { Pool } = require('pg');

async function connect() {

    if(global.connection) {
        return global.connection.connect();
    }

    const pool = new Pool({
        connectionString : process.env.CONNECTION_STRING,
    })
    const client = await pool.connect();
    console.log("Criou o pool de conexão");

    const res = await client.query("SELECT NOW()");
    console.log(res.rows[0]);
    client.release();

    global.connection = pool;
    return pool.connect();

}

async function listenFunc(){
    const client = await connect();
    const res = await client.query(`DO $$
DECLARE
    resultado INTEGER;
BEGIN
    SELECT id_palavra FROM REPOSITORIO WHERE ID_PALAVRA = (SELECT floor(random() * 600 + 1)) INTO resultado;
    UPDATE REPOSITORIO SET INATIVA = NOW() WHERE id_palavra = resultado;
END $$;

SELECT * FROM REPOSITORIO
ORDER BY INATIVA;

SELECT PALAVRA FROM REPOSITORIO
WHERE INATIVA = (SELECT MAX(INATIVA) FROM REPOSITORIO)`);
    return res.rows;

}

module.exports = { connect, listenFunc };