function updateClock(){
    const currentTime = new Date();
    const hours  = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    const seconds = currentTime.getSeconds().toString().padStart(2, '0');

    const timeString = `${hours}:${minutes}:${seconds}`;
    document.getElementById('clock').textContent = timeString;
}
//change page
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');

navItems.forEach(function(item) {
  item.addEventListener('click', function() {
    navItems.forEach(n => n.classList.remove('active'));
    item.classList.add('active');

    pages.forEach(function(page) {
      page.style.display = 'none';
    });

    const target = item.dataset.page;
    document.getElementById(target).style.display = 'block';
  });
});

updateClock();
setInterval(updateClock, 1000);