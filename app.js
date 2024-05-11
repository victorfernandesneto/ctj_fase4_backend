const { connectDatabase, disconnectDatabase, client } = require("./services/dbService.js");
const express = require('express');
const { createServer } = require('http');
const {
    insertReservation,
    getAllReservations,
    getReservationById,
    getReservationsBySpaceId,
    updateReservationTime,
    cancelReservation
} = require('./services/reservaService.js')
const {
    addSpace,
    getSpaceById,
    updateSpace,
    deleteSpace,
    getAllSpaces
} = require('./services/espacoService.js');

const app = express();
const server = createServer(app);

app.use(express.json());

const PORT = process.env.PORT || 3000;

server.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    try {
        // Conectar ao banco de dados uma vez no início da execução do servidor
        await connectDatabase();
        console.log('Connected to the database');
    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1); // Encerra o processo em caso de erro de conexão com o banco de dados
    }
});

server.on('close', async () => {
    try {
        // Fechar a conexão com o banco de dados quando o servidor é encerrado
        await disconnectDatabase();
        console.log('Disconnected from the database');
    } catch (error) {
        console.error('Error disconnecting from the database:', error);
    }
});

// Rotas para Espaços
app.post('/spaces', async (req, res) => {
    try {
        const { space_name, capacity } = req.body;
        await addSpace(space_name, capacity);
        res.status(201).send('Space added successfully');
    } catch (error) {
        console.error('Error adding space:', error);
        res.status(500).send('Error adding space');
    }
});

app.get('/spaces', async (req, res) => {
    try {
        const spaces = await getAllSpaces();
        res.json(spaces);
    } catch (error) {
        console.error('Error getting all spaces:', error);
        res.status(500).send('Error getting all spaces');
    }
});

app.get('/spaces/:id', async (req, res) => {
    try {
        const spaceId = req.params.id;
        const space = await getSpaceById(spaceId);
        if (!space) {
            res.status(404).send('Space not found');
            return;
        }
        res.json(space);
    } catch (error) {
        console.error('Error getting space by ID:', error);
        res.status(500).send('Error getting space by ID');
    }
});

app.put('/spaces/:id', async (req, res) => {
    try {
        const spaceId = req.params.id;
        const { spaceName, capacity } = req.body;
        await updateSpace(spaceId, spaceName, capacity);
        res.send('Space updated successfully');
    } catch (error) {
        console.error('Error updating space:', error);
        res.status(500).send('Error updating space');
    }
});

app.delete('/spaces/:id', async (req, res) => {
    try {
        const spaceId = req.params.id;
        await deleteSpace(spaceId);
        res.send('Space deleted successfully');
    } catch (error) {
        console.error('Error deleting space:', error);
        res.status(500).send('Error deleting space');
    }
});

// Rotas para Reservas
app.post('/reservations', async (req, res) => {
    try {
        const newReservation = req.body;
        await insertReservation(newReservation);
        res.status(201).send('Reservation added successfully');
    } catch (error) {
        console.error('Error adding reservation:', error);
        res.status(500).send('Error adding reservation');
    }
});

app.get('/reservations', async (req, res) => {
    try {
        const reservations = await getAllReservations();
        res.json(reservations);
    } catch (error) {
        console.error('Error getting all reservations:', error);
        res.status(500).send('Error getting all reservations');
    }
});

app.get('/reservations/:id', async (req, res) => {
    try {
        const reservationId = req.params.id;
        const reservation = await getReservationById(reservationId);
        if (!reservation) {
            res.status(404).send('Reservation not found');
            return;
        }
        res.json(reservation);
    } catch (error) {
        console.error('Error getting reservation by ID:', error);
        res.status(500).send('Error getting reservation by ID');
    }
});

app.put('/reservations/:id', async (req, res) => {
    try {
        const reservationId = req.params.id;
        const { newStartTime, newEndTime } = req.body;
        await updateReservationTime(reservationId, newStartTime, newEndTime);
        res.send('Reservation time updated successfully');
    } catch (error) {
        console.error('Error updating reservation time:', error);
        res.status(500).send('Error updating reservation time');
    }
});

app.delete('/reservations/:id', async (req, res) => {
    try {
        const reservationId = req.params.id;
        await cancelReservation(reservationId);
        res.send('Reservation canceled successfully');
    } catch (error) {
        console.error('Error canceling reservation:', error);
        res.status(500).send('Error canceling reservation');
    }
});

app.get('/reservations/space/:spaceId', async (req, res) => {
    try {
        const spaceId = req.params.spaceId;
        const reservations = await getReservationsBySpaceId(spaceId);
        res.json(reservations);
    } catch (error) {
        console.error('Error getting reservations by space ID:', error);
        res.status(500).send('Error getting reservations by space ID');
    }
});