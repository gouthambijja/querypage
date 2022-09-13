const user = document.querySelector("#user");
const isAvailableClass = document.querySelector(".isavailable");
const isnotAvailableClass = document.querySelector(".isnotavailable");
const password = document.querySelector("#password");
user.addEventListener("input", async () => {
  if (user.value !== "") {
    const isAvailable = await fetch(
      `/studentpage/signin/?username=${user.value}`
    );
    const fisAvailable = await isAvailable.json();
    if (fisAvailable == 1) {
      isnotAvailableClass.style.display = "none";
      isAvailableClass.style.display = "inline";
    } else {
      isAvailableClass.style.display = "none";
      isnotAvailableClass.style.display = "inline";
    }
  } else {
    isAvailableClass.style.display = "none";
    isnotAvailableClass.style.display = "none";
  }
});
user.addEventListener("blur", async () => {
  isAvailableClass.style.display = "none";
  isnotAvailableClass.style.display = "none";
  if (user.value !== "") {
    const isAvailable = await fetch(
      `/studentpage/signin/?username=${user.value}`
    );
    const fisAvailable = await isAvailable.json();
    if (fisAvailable != 1) user.value = "";
  }
});
