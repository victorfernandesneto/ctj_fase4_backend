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

const options = require('./swagger.js');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

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
/** @swagger
* /spaces:
*   post:
*     summary: Creates a new space
*     description: Creates a new space by providing name and capacity in the request body.
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - space_name
*               - capacity
*             properties:
*               space_name:
*                 type: string
*                 description: The name of the space.
*               capacity:
*                 type: integer
*                 description: The capacity of the space (number of people).   
*     responses:
*       201:
*         description: Space added successfully.
*       500:
*         description: Error adding space.
*/
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

/** @swagger
* /spaces:
*   get:
*     summary: Retrieves all spaces
*     description: Retrieves a list of all registered spaces.   
*     responses:
*       200:
*         description: List of spaces retrieved successfully.
*       500:
*         description: Error retrieving list of spaces.
*/
app.get('/spaces', async (req, res) => {
    try {
        const spaces = await getAllSpaces();
        res.json(spaces);
    } catch (error) {
        console.error('Error getting all spaces:', error);
        res.status(500).send('Error getting all spaces');
    }
});

/** @swagger
* /spaces/:id:
*   get:
*     summary: Retrieves a specific space
*     description: Retrieves a specific space by its unique identifier.
*     parameters:
*       - in: path
*         name: id
*         required: true
*         type: string
*         description: The unique identifier of the space.
*     responses:
*       200:
*         description: Space retrieved successfully.
*       404:
*         description: Space not found.
*       500:
*         description: Error retrieving space by ID.
*/
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

/** @swagger
* /spaces/:id:
*   put:
*     summary: Updates an existing space
*     description: Updates an existing space by its unique identifier, providing new name and capacity in the request body.
*     parameters:
*       - in: path
*         name: id
*         required: true
*         type: string
*         description: The unique identifier of the space.
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - spaceName (optional)
*               - capacity (optional)
*             properties:
*               spaceName:
*                 type: string
*                 description: The new name of the space (optional).
*               capacity:
*                 type: integer
*                 description: The new capacity of the space (optional).   
*     responses:
*       200:
*         description: Space updated successfully.
*       500:
*         description: Error updating space.
*/
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

/** @swagger
* /spaces/:id:
*   delete:
*     summary: Deletes an existing space
*     description: Deletes an existing space by its unique identifier.
*     parameters:
*       - in: path
*         name: id
*         required: true
*         type: string
*         description: The unique identifier of the space.
*     responses:
*       200:
*         description: Space deleted successfully.
*/
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
/** @swagger
* /reservations:
*   post:
*     summary: Creates a new reservation
*     description: Creates a new reservation by providing reservation details in the request body.
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             # Add specific reservation properties here based on your implementation (e.g., spaceId, startTime, endTime)
*             # Example:
*             # required:
*             #   - spaceId
*             #   - startTime
*             #   - endTime
*             # properties:
*             #   spaceId:
*             #     type: string
*             #     description: The ID of the space to be reserved.
*             #   startTime:
*             #     type: string
*             #     description: The start time of the reservation (format depends on your implementation).
*             #   endTime:
*             #     type: string
*             #     description: The end time of the reservation (format depends on your implementation).   
*     responses:
*       201:
*         description: Reservation added successfully.
*       500:
*         description: Error adding reservation.
*/
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

/** @swagger
* /reservations:
*   get:
*     summary: Retrieves all reservations
*     description: Retrieves a list of all reservations.   
*     responses:
*       200:
*         description: List of reservations retrieved successfully.
*       500:
*         description: Error retrieving list of reservations.
*/
app.get('/reservations', async (req, res) => {
    try {
        const reservations = await getAllReservations();
        res.json(reservations);
    } catch (error) {
        console.error('Error getting all reservations:', error);
        res.status(500).send('Error getting all reservations');
    }
});

/** @swagger
* /reservations/:id:
*   get:
*     summary: Retrieves a specific reservation
*     description: Retrieves a specific reservation by its unique identifier.
*     parameters:
*       - in: path
*         name: id
*         required: true
*         type: string
*         description: The unique identifier of the reservation.
*     responses:
*       200:
*         description: Reservation retrieved successfully.
*       404:
*         description: Reservation not found.
*       500:
*         description: Error retrieving reservation by ID.
*/
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

/** @swagger
* /reservations/:id:
*   put:
*     summary: Updates an existing reservation time
*     description: Updates an existing reservation by its unique identifier, providing new start and end times in the request body.
*     parameters:
*       - in: path
*         name: id
*         required: true
*         type: string
*         description: The unique identifier of the reservation.
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - newStartTime (optional)
*               - newEndTime (optional)
*             properties:
*               newStartTime:
*                 type: string
*                 description: The new start time of the reservation (format depends on your implementation).
*               newEndTime:
*                 type: string
*                 description: The new end time of the reservation (format depends on your implementation).   
*     responses:
*       200:
*         description: Reservation time updated successfully.
*       500:
*         description: Error updating reservation time.
*/
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

/** @swagger
* /reservations/:id:
*   delete:
*     summary: Deletes an existing reservation
*     description: Deletes an existing reservation by its unique identifier.
*     parameters:
*       - in: path
*         name: id
*         required: true
*         type: string
*         description: The unique identifier of the reservation.
*     responses:
*       200:
*         description: Reservation canceled successfully.
*       500:
*         description: Error canceling reservation.
*/
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

/** @swagger
* /reservations/space/:spaceId:
*   get:
*     summary: Retrieves reservations for a specific space
*     description: Retrieves a list of reservations for a space identified by its unique identifier.
*     parameters:
*       - in: path
*         name: spaceId
*         required: true
*         type: string
*         description: The unique identifier of the space.
*     responses:
*       200:
*         description: List of reservations for the space retrieved successfully.
*       500:
*         description: Error retrieving reservations by space ID.
*/
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

const specs = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));