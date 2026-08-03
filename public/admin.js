const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const ticketCountInput = document.getElementById("ticketCount");

const generateBtn = document.getElementById("generateBtn");

const qr = document.getElementById("qr");
const ticketId = document.getElementById("ticketId");
const downloadQR = document.getElementById("downloadQR");

generateBtn.onclick = async () => {

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const ticketCount = ticketCountInput.value;

    if (!name || !phone || !ticketCount) {
        alert("Please fill all fields");
        return;
    }

    try {

        const response = await fetch("/api/tickets", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                phone,
                ticketCount
            })
        });

        const data = await response.json();

        if (!data.success) {
            alert(data.message);
            return;
        }

        ticketId.innerHTML = data.ticketId;

        qr.innerHTML = `

<div class="ticket-preview" id="ticketCard">

    <div class="ticket-header">

        <h2>🍺 THE BUNKER PUB & KITCHEN</h2>

        <h3>PUB ENTRY PASS</h3>

        <p>📍 Sahakar Nagar, Bengaluru</p>

        <p>🗓 Saturday • 08 August</p>

        <p>🕛 12:00 PM - 4:00 PM</p>

    </div>

    <hr>

    <div class="ticket-details">

        <p><strong>👤 Name :</strong> ${name}</p>

        <p><strong>📱 Phone :</strong> ${phone}</p>

        <p><strong>🎟 Tickets :</strong> ${ticketCount}</p>

        <p><strong>🆔 Ticket ID :</strong> ${data.ticketId}</p>

    </div>

    <div class="ticket-qr">

        <img src="${data.qr}" alt="QR Code">

    </div>

    <div class="ticket-footer">

        🍻 THE BUNKER PUB & KITCHEN

        <br><br>

        <strong>ONE TIME ENTRY PASS</strong>

        <br>

        Scan this QR at the entrance only.

    </div>

</div>

`;

        // Download the COMPLETE entry pass
        downloadQR.onclick = async (e) => {

            e.preventDefault();

            const ticket = document.getElementById("ticketCard");

            const canvas = await html2canvas(ticket, {
                scale: 3,
                useCORS: true,
                backgroundColor: "#ffffff"
            });

            const image = canvas.toDataURL("image/png");

            const link = document.createElement("a");
            link.href = image;
            link.download = `${data.ticketId}.png`;
            link.click();

        };

        // Clear inputs
        nameInput.value = "";
        phoneInput.value = "";
        ticketCountInput.value = "";

    } catch (err) {

        console.error(err);
        alert("Something went wrong while generating the ticket.");

    }

};