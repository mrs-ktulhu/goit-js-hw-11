import './css/styles.css';

import { Notify } from 'notiflix';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import pixabayImages from './pixabayImages';

const searchForm = document.querySelector('#search-form');
const loadMoreBtn = document.querySelector('.load-more');
const galleryContainer = document.querySelector('.gallery');
const endCollection = document.querySelector('.end-collection');

searchForm.addEventListener('submit', onSubmitForm);

loadMoreBtn.addEventListener('click', onLoadMoreClick);

let page = 1;
let currentHits = 0;
let valueSearchQuery = '';

let gallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionsDelay: 250,
  captionPosition: 'bottom',
  animationSpeed: 250,
});
async function onSubmitForm(event) {
    event.preventDefault();
    currentHits = 0;
    clearElements();
    page = 1;
  
    valueSearchQuery = event.currentTarget.searchQuery.value.trim();
    if (valueSearchQuery === '') {
      return;
    }
  
    event.currentTarget.reset();
  
    const totalHits = await GetUsers(valueSearchQuery);
    if (totalHits) {
      successNotify(totalHits);
    }
  }
  
  async function GetUsers(valueSearchQuery) {
    try {
      const { hits, totalHits } = await pixabayImages(valueSearchQuery, page);
      if (!hits.length) {
        throwError();
      } else {
        renderGallery(hits);
        currentHits += hits.length;
        console.log('currentHits', currentHits);
        loadMoreBtnActive(totalHits);
        return totalHits;
      }
    } catch (error) {
      failureNotify(error);
    }
  }
  
  async function GetUsersBtn(valueSearchQuery) {
    try {
      const { hits, totalHits } = await pixabayImages(valueSearchQuery, page);
      if (!hits.length) {
        throwError();
      } else {
        renderGallery(hits);
        slowlyScroll();
        currentHits += hits.length;
        console.log('currentHits', currentHits);
        loadMoreBtnActive(totalHits);
        return totalHits;
      }
    } catch (error) {
      failureNotify(error);
    }
  }
  
  function loadMoreBtnActive(totalHits) {
    if (currentHits < totalHits) {
      loadMoreBtn.classList.remove('is-hidden');
      endCollectionHidden();
    } else {
      endCollection.classList.remove('is-hidden');
      loadMoreBtnHidden();
    }
  }
  function failureNotify(error) {
    Notify.failure(`${error}`);
  }
  function successNotify(totalHits) {
    Notify.success(`Hooray! We  found ${totalHits}  images.`);
    console.log(`Hooray! We  found ${totalHits}  images.`);
}
  function onLoadMoreClick(e) {
    page += 1;
    GetUsersBtn(valueSearchQuery);
    SimpleLightbox = new SimpleLightbox('.gallery a').refresh();
    loadMoreBtnHidden();
  }  

  function throwError() {
    throw new Error(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  function loadMoreBtnHidden() {
    loadMoreBtn.classList.add('is-hidden');
  }
  function endCollectionHidden() {
    endCollection.classList.add('is-hidden');
  }
  
  function renderGallery(users) {
    const gallaryMarkup = users
      .map(
        ({
          webformatURL,
          fullHDURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => `<a href="${fullHDURL}" class="gallery__item"
          ><div class="photo-card">
              <img src="${webformatURL}" alt="${tags}" loading="lazy" />
              <div class="info">
                <p class="info-item">
                  <b>Likes</b>${likes}</p>
                <p class="info-item">
                  <b>Views</b>${views}</p>
                <p class="info-item">
                  <b>Comments</b>${comments}</p>
                <p class="info-item">
                  <b>Downloads</b>${downloads}</p>
              </div>
            </div>      
        </a>`
      )
      .join('');
  
    galleryContainer.insertAdjacentHTML('beforeend', gallaryMarkup);
  
    gallery.refresh();
  }
  
  function slowlyScroll() {
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();
  
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
  function clearElements() {
    galleryContainer.innerHTML = '';
    loadMoreBtnHidden();
    endCollectionHidden();
}
 
  