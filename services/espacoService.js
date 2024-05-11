const { client } = require("./dbService.js");

// Adicionar Espaço
async function addSpace(spaceName, capacity) {
    try {
        // Verificar se o nome do espaço já existe
        const existingSpaceQuery = 'SELECT * FROM espacos WHERE nome_do_espaco = $1';
        const existingSpaceResult = await client.query(existingSpaceQuery, [spaceName]);
        if (existingSpaceResult.rows.length > 0) {
            console.error('Já existe um espaço com esse nome.');
            return; // Retorna sem adicionar o espaço se o nome já existir
        }

        const query = `
            INSERT INTO espacos (nome_do_espaco, capacidade)
            VALUES ($1, $2)
        `;
        const values = [spaceName, capacity];
        await client.query(query, values);

        console.log('Espaço adicionado com sucesso!');
    } catch (error) {
        console.error('Erro ao adicionar o espaço:', error);
        throw error;
    }
}

// Consultar todos os espaços
async function getAllSpaces() {
    try {
        const query = 'SELECT * FROM espacos';
        const result = await client.query(query);

        return result.rows; // Retorna todos os espaços encontrados
    } catch (error) {
        console.error('Erro ao obter todos os espaços:', error);
        throw error;
    }
}

// Consultar Espaço por ID
async function getSpaceById(spaceId) {
    try {
        const query = 'SELECT * FROM espacos WHERE id = $1';
        const values = [spaceId];
        const result = await client.query(query, values);

        return result.rows[0]; // Retorna o espaço encontrado ou undefined se não houver nenhum espaço com o ID especificado
    } catch (error) {
        console.error('Erro ao obter espaço por ID:', error);
        throw error;
    }
}

// Editar Espaço
async function updateSpace(spaceId, spaceName, capacity) {
    try {
        const query = `
            UPDATE espacos
            SET nome_do_espaco = $1, capacidade = $2
            WHERE id = $3
        `;
        const values = [spaceName, capacity, spaceId];
        await client.query(query, values);

        console.log('Espaço atualizado com sucesso!');
    } catch (error) {
        console.error('Erro ao atualizar o espaço:', error);
        throw error;
    }
}

// Deletar Espaço
async function deleteSpace(spaceId) {
    try {
        const query = 'DELETE FROM espacos WHERE id = $1';
        const values = [spaceId];
        await client.query(query, values);

        console.log('Espaço deletado com sucesso!');
    } catch (error) {
        console.error('Erro ao deletar o espaço:', error);
        throw error;
    }
}

module.exports = { addSpace, getAllSpaces, getSpaceById, updateSpace, deleteSpace };