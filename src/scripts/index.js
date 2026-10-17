(function() {
  function $(id) {
    return document.getElementById(id);
  }

  var card = $('card'),
      openB = $('open'),
      closeB = $('close'),
      timer = null;
  openB.addEventListener('click', function () {
    card.setAttribute('class', 'open-half');
    openB.setAttribute('aria-expanded', 'true');
    if (timer) clearTimeout(timer);
    timer = setTimeout(function () {
      card.setAttribute('class', 'open-fully');
      timer = null;
      closeB.focus();
    }, 1000);
  });

  closeB.addEventListener('click', function () {
    card.setAttribute('class', 'close-half');
    openB.setAttribute('aria-expanded', 'false');
    if (timer) clearTimeout(timer);
    timer = setTimeout(function () {
      card.setAttribute('class', '');
      timer = null;
      openB.focus();
    }, 1000);
  });

}());
