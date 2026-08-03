const express = require("express");
const QRCode = require("qrcode");

const router = express.Router();

const {
    createTicket,
    updateTicketId,
    getAllTickets,
    getTicket,
    markTicketUsed
} = require("../database");

/*
-------------------------------------------------
BASE URL
-------------------------------------------------
*/

const BASE_URL =
    process.env.BASE_URL || "https://pub-ticket-system-1.onrender.com";

function generateTicketId(id) {
    return "PUB" + String(id).padStart(6, "0");
}

/* ===========================
   CREATE TICKET
=========================== */

router.post("/", (req, res) => {

    const { name, phone, ticketCount } = req.body;

    if (!name || !phone || !ticketCount) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    createTicket(name, phone, ticketCount, function (err) {

        if (err) {
            return res.status(500).json(err);
        }

        const id = this.lastID;
        const ticketId = generateTicketId(id);

        updateTicketId(id, ticketId, async function (err) {

            if (err) {
                return res.status(500).json(err);
            }

            try {

                const ticketUrl = `${BASE_URL}/ticket/${ticketId}`;

                const qr = await QRCode.toDataURL(ticketUrl);

                res.json({
                    success: true,
                    ticketId,
                    qr,
                    ticketUrl
                });

            } catch (error) {

                res.status(500).json({
                    success: false,
                    message: "Failed to generate QR Code",
                    error: error.message
                });

            }

        });

    });

});

/* ===========================
   GET ALL TICKETS
=========================== */

router.get("/", (req, res) => {

    getAllTickets((err, rows) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(rows);

    });

});

/* ===========================
   VERIFY TICKET
=========================== */

router.get("/:ticketId", (req, res) => {

    getTicket(req.params.ticketId, (err, ticket) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (!ticket) {

            return res.status(404).json({
                success: false,
                used: false,
                message: "INVALID TICKET"
            });

        }

        if (ticket.used == 1) {

            return res.json({
                success: false,
                used: true,
                ticket
            });

        }

        markTicketUsed(ticket.ticketId, function (err) {

            if (err) {
                return res.status(500).json(err);
            }

            ticket.used = 1;

            res.json({
                success: true,
                used: false,
                ticket
            });

        });

    });

});

module.exports = router;