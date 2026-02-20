
/*--------------------TESTIMONIALS--------------------------------------------------------*

  /*grabs all testimonials items*/
  const carousel = document.querySelector('.carousel');
  const track = document.querySelector('.carousel-track');
  const nextBtn = document.querySelector('.next');
  const prevBtn = document.querySelector('.prev');
  const dotsContainer = document.querySelector('.carousel-dots');

  /*cards converted to an array to use array methods (like slice)*/
  let cards = Array.from(document.querySelectorAll('.card'));

  let index = 0; /*keeps track of which card is currently on the left*/
  let autoplayInterval; /*stores setInterval for autoplay*/
  const AUTOPLAY_DELAY = 6000; /*auto-slide time (6seconds)*/

  /* mobile */
  function getCardsPerView() {
    return window.innerWidth <= 900 ? 1 : 3; 
    /*window.innerWidth checks width of the browser window
    if the window is 900 pixels or less, one card is shown
    else 3 cards are shown*/
  }

  /* infinite loop */
  function setupClones() { /*creating clones to create seamless infinite loop*/
    const cardsPerView = getCardsPerView(); 
    /*sees how many cards are visible, if we are on mobile or not
    determines how many clones we need*/

    const firstClones = cards.slice(0, cardsPerView).map(card => card.cloneNode(true)); 
    /*cloneNode(true) copies the element and its child elements (stars, quote, author)*/
    /*takes the first cardsPerView cards, clones them and will add them to the end*/

    const lastClones = cards.slice(-cardsPerView).map(card => card.cloneNode(true));
    /*takes the last cardsPerView cards, clones them and will add them to the front*/

    lastClones.forEach(clone => track.insertBefore(clone, track.firstChild));
    firstClones.forEach(clone => track.appendChild(clone));

    /*re-selects all card elements and covert the NodeList into an array,
    so now cards include the original and the cloned cards*/
    cards = Array.from(document.querySelectorAll('.card'));

    /*setting starting index so that it skips the cloned cards*/
    index = cardsPerView;

    updateCarousel(false);
  }

  /*ensures seamless carousel loops*/
  /*after a slide animation ends (transitionend) it checks if we are on a cloned card
  if yes: goes to an original cards*/
  track.addEventListener('transitionend', () => {
    const cardsPerView = getCardsPerView();
    const totalCards = cards.length;
    if (index >= totalCards - cardsPerView) {
      index = cardsPerView;
      updateCarousel(false);
    }
    if (index < cardsPerView) {
      index = totalCards - (cardsPerView * 2);
      updateCarousel(false);
    }
  });

  /* update card position */
  function updateCarousel(animate = true) {
    const cardWidth = cards[0].offsetWidth;
    track.style.transition = animate ? 'transform 0.5s ease' : 'none';
    track.style.transform = `translateX(-${index * cardWidth}px)`; /*calculates how far it slides*/
    updateDots();
  }

  /* controls index */
  function nextSlide() {
    index++;
    updateCarousel();
  }

  function prevSlide() {
    index--;
    updateCarousel();
  }

  /*dots*/
  function createDots() {
    const realCardCount = 5;
    dotsContainer.innerHTML = '';
    for (let i = 0; i < realCardCount; i++) {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      dot.addEventListener('click', () => {
        index = i + getCardsPerView();
        updateCarousel();
        restartAutoplay();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() { /*highlights the active dot based on the index*/
    const dots = document.querySelectorAll('.dot');
    const cardsPerView = getCardsPerView();
    let realIndex = (index - cardsPerView) % dots.length;
    if (realIndex < 0) realIndex += dots.length;
    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[realIndex]) dots[realIndex].classList.add('active');
  }

  /*autoplay*/
  function startAutoplay() {
    autoplayInterval = setInterval(() => {
      nextSlide();
    }, AUTOPLAY_DELAY);
  }
  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }
  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  /* Pause on hover */
  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);

  /* Pause on arrow click and restart autoplay*/
  nextBtn.addEventListener('click', () => {
    nextSlide();
    restartAutoplay();
  });
  prevBtn.addEventListener('click', () => {
    prevSlide();
    restartAutoplay();
  });

  /*when resizing the window it reloads the page to recalculate the cards per view and clones*/
  window.addEventListener('resize', () => location.reload());

  /*initialization*/
  setupClones();
  createDots();
  startAutoplay();

/*-----------------------------------------------------------------------------------------*/