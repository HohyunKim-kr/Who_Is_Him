const cards = document.querySelectorAll(".stack-card");
let draggedCard = null;
let offsetX = 0;
let offsetY = 0;
let filledCount = 0;
const totalStacks = 5; // 총 스택 개수

cards.forEach((card) => {
    card.addEventListener("mousedown", startDrag);
    card.addEventListener("touchstart", startDrag);
});

document.addEventListener("mousemove", drag);
document.addEventListener("mouseup", drop);
document.addEventListener("touchmove", drag, { passive: false });
document.addEventListener("touchend", drop);

function startDrag(e) {
    draggedCard = e.target;
    draggedCard.classList.add("dragging");
    draggedCard.style.zIndex = 1000;

    const clientX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes("touch") ? e.touches[0].clientY : e.clientY;

    const rect = draggedCard.getBoundingClientRect();
    const containerRect = document.querySelector(".container").getBoundingClientRect();

    offsetX = clientX - rect.left;
    offsetY = clientY - rect.top;

    draggedCard.style.left = `${rect.left - containerRect.left}px`;
    draggedCard.style.top = `${rect.top - containerRect.top}px`;
}

function drag(e) {
    if (draggedCard) {
        e.preventDefault();

        const clientX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes("touch") ? e.touches[0].clientY : e.clientY;

        const containerRect = document.querySelector(".container").getBoundingClientRect();

        draggedCard.style.left = `${clientX - offsetX - containerRect.left}px`;
        draggedCard.style.top = `${clientY - offsetY - containerRect.top}px`;
    }
}

function drop(e) {
    if (draggedCard) {
        draggedCard.classList.remove("dragging");
        const beaker = document.querySelector(".beaker");
        const beakerRect = beaker.getBoundingClientRect();
        const cardRect = draggedCard.getBoundingClientRect();

        // 비커 영역 안에 들어왔는지 체크
        if (
            cardRect.left >= beakerRect.left - 20 &&
            cardRect.right <= beakerRect.right + 20 &&
            cardRect.top >= beakerRect.top - 20 &&
            cardRect.bottom <= beakerRect.bottom + 20
        ) {
            draggedCard.style.display = "none"; // 카드 숨기기
            filledCount++;
            updateWaterLevel();
        }

        draggedCard.style.zIndex = 0;
        draggedCard = null;
    }
}

function updateWaterLevel() {
    const water = document.getElementById("water");
    const percentage = (filledCount / totalStacks) * 100; // 비커 채워지는 비율
    water.style.height = `${percentage}%`;

    if (filledCount === totalStacks) {
        document.querySelector(".next-button").classList.add("show"); // 비커가 꽉 차면 버튼 표시
    }
}