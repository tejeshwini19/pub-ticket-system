const scanner = new Html5Qrcode("reader");

let scanning = false;

async function showTicket(data) {

    document.getElementById("ticketCard").style.display = "block";

    const status = document.getElementById("status");

    if (!data.success && !data.used) {

        status.innerHTML = "❌ INVALID TICKET";
        status.style.color = "#ff3b30";

        document.getElementById("name").innerHTML = "-";
        document.getElementById("phone").innerHTML = "-";
        document.getElementById("count").innerHTML = "-";
        document.getElementById("ticketId").innerHTML = "-";

        return;
    }

    document.getElementById("name").innerHTML =
        data.ticket.name;

    document.getElementById("phone").innerHTML =
        data.ticket.phone;

    document.getElementById("count").innerHTML =
        data.ticket.ticketCount;

    document.getElementById("ticketId").innerHTML =
        data.ticket.ticketId;

    if (data.used) {

        status.innerHTML = "❌ TICKET ALREADY USED";
        status.style.color = "#ff3b30";

    } else {

        status.innerHTML = "✅ ENTRY APPROVED";
        status.style.color = "#00ff88";

    }

}

async function verifyTicket(ticketId) {

    try {

        const response = await fetch(`/api/tickets/${ticketId}`);

        const data = await response.json();

        await showTicket(data);

    }

    catch (error) {

        console.log(error);

    }

    setTimeout(async () => {

        document.getElementById("ticketCard").style.display = "none";

        startScanner();

    }, 2500);

}

function startScanner() {

    scanning = false;

    scanner.start(

        {
            facingMode: "environment"
        },

        {
            fps: 10,

            qrbox: {
                width: 250,
                height: 250
            }

        },

        async (decodedText) => {

            if (scanning) return;

            scanning = true;

            await scanner.stop();

            await verifyTicket(decodedText.trim());

        },

        (errorMessage) => {
            // Ignore scan failures while searching
        }

    ).catch((error) => {

        console.log(error);

    });

}

startScanner();