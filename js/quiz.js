function checkAnswer(age) {
  if (age === 28) {
    document.getElementById("nextButton").classList.add("show"); // 정답이면 버튼 표시
    // 선택 버튼 비활성화 (선택 후 더 누르지 못하게)
    const buttons = document.querySelectorAll(".button-container button");
    buttons.forEach((button) => (button.disabled = true));
  } else {
    document.getElementById("message").classList.add("show"); // 오답이면 메시지 표시
    setTimeout(() => {
      document.getElementById("message").classList.remove("show");
    }, 2000); // 2초 후 메시지 사라짐
  }
};
