const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(
    path.join(__dirname, "pub_ticket.db"),
    (err) => {

        if (err) {

            console.log(err);

        } else {

            console.log("SQLite Connected");

            db.run(`
                CREATE TABLE IF NOT EXISTS tickets(

                    id INTEGER PRIMARY KEY AUTOINCREMENT,

                    ticketId TEXT UNIQUE,

                    name TEXT,

                    phone TEXT,

                    ticketCount INTEGER,

                    used INTEGER DEFAULT 0,

                    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP

                )
            `);

        }

    }
);

function createTicket(name, phone, ticketCount, callback){

    db.run(

        `INSERT INTO tickets(name,phone,ticketCount)
         VALUES(?,?,?)`,

        [name,phone,ticketCount],

        callback

    );

}

function updateTicketId(id,ticketId,callback){

    db.run(

        `UPDATE tickets
         SET ticketId=?
         WHERE id=?`,

        [ticketId,id],

        callback

    );

}

function getAllTickets(callback){

    db.all(

        `SELECT *
         FROM tickets
         ORDER BY id DESC`,

        [],

        callback

    );

}

function getTicket(ticketId,callback){

    db.get(

        `SELECT *
         FROM tickets
         WHERE ticketId=?`,

        [ticketId],

        callback

    );

}

function markTicketUsed(ticketId,callback){

    db.run(

        `UPDATE tickets
         SET used=1
         WHERE ticketId=?`,

        [ticketId],

        callback

    );

}

module.exports={

    createTicket,

    updateTicketId,

    getAllTickets,

    getTicket,

    markTicketUsed

};