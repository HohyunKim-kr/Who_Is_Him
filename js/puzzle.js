const pieces = document.querySelectorAll(".puzzle-piece");
let draggedPiece = null;
let offsetX = 0;
let offsetY = 0;

pieces.forEach((piece) => {
    piece.addEventListener("mousedown", startDrag);
    piece.addEventListener("touchstart", startDrag);
});

document.addEventListener("mousemove", drag);
document.addEventListener("mouseup", drop);
document.addEventListener("touchmove", drag, { passive: false });
document.addEventListener("touchend", drop);

function startDrag(e) {
    draggedPiece = e.target;
    draggedPiece.classList.add("dragging");
    draggedPiece.style.zIndex = 1000;

    const clientX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes("touch") ? e.touches[0].clientY : e.clientY;

    const rect = draggedPiece.getBoundingClientRect();
    const containerRect = document.querySelector(".container").getBoundingClientRect();

    offsetX = clientX - rect.left;
    offsetY = clientY - rect.top;

    draggedPiece.style.left = `${rect.left - containerRect.left}px`;
    draggedPiece.style.top = `${rect.top - containerRect.top}px`;
}

function drag(e) {
    if (draggedPiece) {
        e.preventDefault();

        const clientX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes("touch") ? e.touches[0].clientY : e.clientY;

        const containerRect = document.querySelector(".container").getBoundingClientRect();

        draggedPiece.style.left = `${clientX - offsetX - containerRect.left}px`;
        draggedPiece.style.top = `${clientY - offsetY - containerRect.top}px`;
    }
}

function drop(e) {
    if (draggedPiece) {
        draggedPiece.classList.remove("dragging");
        const dropZones = document.querySelectorAll(".drop-zone");
        let snapped = false;

        dropZones.forEach((zone) => {
            const zoneRect = zone.getBoundingClientRect();
            const pieceRect = draggedPiece.getBoundingClientRect();

            if (
                pieceRect.left >= zoneRect.left - 20 &&
                pieceRect.right <= zoneRect.right + 20 &&
                pieceRect.top >= zoneRect.top - 20 &&
                pieceRect.bottom <= zoneRect.bottom + 20 &&
                zone.dataset.letter === draggedPiece.dataset.letter
            ) {
                draggedPiece.style.left = `${zone.offsetLeft}px`;
                draggedPiece.style.top = `${zone.offsetTop}px`;
                draggedPiece.style.cursor = "default";
                draggedPiece.removeEventListener("mousedown", startDrag);
                draggedPiece.removeEventListener("touchstart", startDrag);
                snapped = true;
            }
        });



        draggedPiece.style.zIndex = 0;
        draggedPiece = null;

        checkCompletion();
    }
}

function checkCompletion() {
    const pieces = document.querySelectorAll(".puzzle-piece");
    const allSnapped = Array.from(pieces).every(
        (piece) => piece.style.cursor === "default"
    );
    if (allSnapped) {
        document.querySelector(".success").classList.add("show");
        document.querySelector(".next-button").classList.add("show");
        triggerConfetti();
    }
}

function triggerConfetti() {
    const celebration = document.getElementById("celebration");
    const colors = ["#ffcc00", "#ff9900", "#d4a017", "#ffecd2", "#fcb69f"];

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement("div");
        confetti.classList.add("confetti");
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = `${Math.random() * 2}s`;
        celebration.appendChild(confetti);

        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

pieces.forEach((piece) => {
    piece.dataset.originalX = piece.style.left;
    piece.dataset.originalY = piece.style.top;
});