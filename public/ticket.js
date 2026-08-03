const ticketId = window.location.pathname.split("/").pop();

async function verifyTicket() {

    try {

        const response = await fetch(`/api/tickets/${ticketId}`);

        const data = await response.json();

        // Invalid Ticket
        if (!data.success && !data.used) {

            document.getElementById("ticketHeading").innerHTML =
                "❌ INVALID TICKET";

            document.getElementById("ticketHeading").style.color = "red";

            return;

        }

        // Already Used
        if (data.used === true) {

            document.getElementById("ticketHeading").innerHTML =
                "❌ TICKET ALREADY USED";

            document.getElementById("ticketHeading").style.color = "red";

            document.getElementById("name").innerHTML =
                data.ticket.name;

            document.getElementById("phone").innerHTML =
                data.ticket.phone;

            document.getElementById("count").innerHTML =
                data.ticket.ticketCount;

            document.getElementById("ticketId").innerHTML =
                data.ticket.ticketId;

            return;

        }

        // Valid Ticket (First Scan)

        document.getElementById("ticketHeading").innerHTML =
            "✅ VALID TICKET";

        document.getElementById("ticketHeading").style.color =
            "limegreen";

        document.getElementById("name").innerHTML =
            data.ticket.name;

        document.getElementById("phone").innerHTML =
            data.ticket.phone;

        document.getElementById("count").innerHTML =
            data.ticket.ticketCount;

        document.getElementById("ticketId").innerHTML =
            data.ticket.ticketId;

    }

    catch (err) {

        console.log(err);

        document.getElementById("ticketHeading").innerHTML =
            "❌ SERVER ERROR";

        document.getElementById("ticketHeading").style.color =
            "red";

    }

}

verifyTicket();