var progressImage = document.getElementById("loading-image");
window.scrollTo(0, 300);
// Used for visual effects on mouse movement.
document.body.addEventListener("mousemove", updateMouseCoordinates);

var mouseX = 0;
var mouseY = 0;
function updateMouseCoordinates(event) {
  var x = event.clientX;
  var y = event.clientY;
  updateBackgroundPosition(mouseX - x, mouseY - y);
  mouseX = x;
  mouseY = y;
}
function updateBackgroundPosition(offsetX, offsetY) {
  var newX = 50 - offsetX;
  var newY = 50 - offsetY;
  if (newX > 52) newX = 52;
  else if (newX < 48) newX = 48;

  if (newY > 54) newY = 54;
  else if (newY < 46) newY = 46;
  var position = newX + "% " + newY + "%";
  document.getElementById("sf-background-fog").style.backgroundPosition =
    position;
}
var driftX = 0;
var driftY = 0;
var driftDirection = "right";
setInterval(function () {
  if (driftDirection == "right") {
    driftX += 0.1;
    driftY += 0.13;

    if (driftX >= 2 || driftY >= 2) driftDirection = "left";
  } else if (driftDirection == "left") {
    driftX -= 0.1;
    driftY -= 0.13;

    if (driftX <= -2 || driftY <= -2) driftDirection = "right";
  }
  updateBackgroundPosition(driftX, driftY);
}, 150);
function redirect() {
  window.location = "Tetris.html";
}

var activeModal = "";
function openSFModal(id) {
  activeModal = id;
  let recordTab = document.getElementById("record");
  let record = localStorage.getItem("records");
  if (record) {
    recordTab.innerHTML = `${record}`;
  } else {
    console.log(recordTab);
    recordTab.innerText = "There are no scores registered yet";
  }
  document.getElementById("main-modal").classList.add("active");

  document.getElementById(activeModal).classList.add("active");
}
function closeSFModal() {
  document.getElementById("main-modal").classList.remove("active");
  document.getElementById(activeModal).classList.remove("active");
}
function closeSettings() {
  let difficulty = document.querySelector("#left-red").value;
  let time = document.querySelector("#time").value;
  localStorage.setItem("difficulty", difficulty);
  localStorage.setItem("time", time);
  localStorage.setItem("operation", document.getElementById("operation").value);
  document.getElementById("main-modal").classList.remove("active");
  document.getElementById(activeModal).classList.remove("active");
}

var imageUrl = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/2940219/";
