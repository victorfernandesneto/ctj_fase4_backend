// reservaService.js
const { client } = require("./dbService.js");

// Função para verificar se a duração da reserva está dentro do intervalo desejado (entre 1 e 8 horas)
function checkReservationDuration(newReservation) {
  const inicio = new Date(newReservation.inicio_da_reserva);
  const fim = new Date(newReservation.fim_da_reserva);

  const duracaoEmMilissegundos = fim - inicio;

  // Converter a duração para horas (fim - inicio devolve em milissegundos)
  const duracaoEmHoras = duracaoEmMilissegundos / (1000 * 60 * 60);

  if (duracaoEmHoras >= 1 && duracaoEmHoras <= 8) {
    return true;
  } else {
    return false;
  }
}


// Função para verificar se há sobreposição de reservas
async function checkReservationOverlap(newReservation) {
  try {
    const query = `
            SELECT * FROM reservas
            WHERE id_espaco = $1
            AND ((inicio_da_reserva <= $2 AND fim_da_reserva >= $4)
            OR (inicio_da_reserva <= $3 AND fim_da_reserva >= $5))
        `;

    const values = [
      newReservation.id_espaco,
      newReservation.inicio_da_reserva,
      newReservation.inicio_da_reserva,
      newReservation.fim_da_reserva,
      newReservation.fim_da_reserva,
    ];
    const result = await client.query(query, values);

    if (result.rows.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Erro ao verificar sobreposição de reservas:', error);
    return true; // Em caso de erro, por segurança, consideramos que há sobreposição
  }
}

// Função para inserir uma nova reserva
async function insertReservation(newReservation) {
  try {
    const duration = await checkReservationDuration(newReservation); // Devolve se a reserva tem duração desejada
    if (!duration) {
      console.log('Não é possível cadastrar a reserva devido à duração da reserva.')
      return;
    }

    const overlap = await checkReservationOverlap(newReservation);
    if (overlap) {
      console.log('Não é possível cadastrar a reserva devido à sobreposição de horários.');
      return;
    }

    // Se não houver excesso de duração e nem sobreposição, inserir a reserva
    const query = `
        INSERT INTO reservas (inicio_da_reserva, fim_da_reserva, id_espaco) VALUES ($1, $2, $3)
      `;
    const values = [newReservation.inicio_da_reserva, newReservation.fim_da_reserva, newReservation.id_espaco];
    await client.query(query, values);

    console.log('Reserva cadastrada com sucesso!');
  } catch (error) {
    console.error('Erro ao cadastrar a reserva:', error);
  }
}

// Função que devolve todas as ocorrências do banco de dados
async function getAllReservations() {
  try {
    const query = 'SELECT * FROM reservas';
    const result = await client.query(query);

    return result.rows;
  } catch (error) {
    console.error('Erro ao obter todas as reservas:', error);
    throw error;
  }
}

// Função que devolve uma ocorrência baseado no ID da reserva
async function getReservationById(reservationId) {
  try {
      const query = 'SELECT * FROM reservas WHERE id = $1';
      const values = [reservationId];
      const result = await client.query(query, values);

      return result.rows[0];
  } catch (error) {
      console.error('Erro ao obter reserva por ID:', error);
      throw error;
  }
}

// Função que devolve todas as ocorrências do banco de dados baseado no ID do espaço
async function getReservationsBySpaceId(spaceId) {
  try {
      const query = 'SELECT * FROM reservas WHERE id_espaco = $1';
      const values = [spaceId];
      const result = await client.query(query, values);

      return result.rows;
  } catch (error) {
      console.error('Erro ao obter reservas por ID do espaço:', error);
      throw error;
  }
}

// Função que atualiza um registro no banco de dados
async function updateReservationTime(reservationId, newTime) {
  try {
      // Verificar se o novo horário atende às regras de negócio
      const newReservation = {
          inicio_da_reserva: newTime.inicio_da_reserva,
          fim_da_reserva: newTime.fim_da_reserva,
      };
      const durationValid = checkReservationDuration(newReservation);
      if (!durationValid) {
          throw new Error('A duração da reserva deve ser entre 1 e 8 horas.');
      }

      const overlapValid = await checkReservationOverlap(newReservation);
      if (overlapValid) {
          throw new Error('O novo horário da reserva está sobreposto com outras reservas.');
      }

      const query = `
          UPDATE reservas
          SET inicio_da_reserva = $1, fim_da_reserva = $2
          WHERE id = $3
      `;
      const values = [newTime.inicio_da_reserva, newTime.fim_da_reserva, reservationId];
      await client.query(query, values);

      console.log('Reserva atualizada com sucesso!');
  } catch (error) {
      console.error('Erro ao atualizar a reserva:', error);
      throw error;
  }
}

// Função pra deletar um registro do banco de dados
async function cancelReservation(reservationId) {
  try {
      const query = `
          DELETE FROM reservas
          WHERE id = $1
      `;
      const values = [reservationId];
      await client.query(query, values);

      console.log('Reserva cancelada com sucesso!');
  } catch (error) {
      console.error('Erro ao cancelar a reserva:', error);
      throw error;
  }
}

module.exports = { insertReservation, getAllReservations, getReservationById, getReservationsBySpaceId, updateReservationTime, cancelReservation };