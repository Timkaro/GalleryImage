import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  loadMore,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';

hideLoader();

const form = document.querySelector('.form');
const input = form.querySelector('input');
let query = '';
let page = 1;
const perPage = 15;

form.addEventListener('submit', async event => {
  event.preventDefault();
  clearGallery();
  hideLoadMoreButton();

  page = 1;
  query = input.value.trim();

  if (!query) return;

  showLoader();

  try {
    const photos = await getImagesByQuery(query, page);
    const totalHits = photos.totalHits;
    const totalPages = Math.ceil(totalHits / perPage);

    if (!photos.hits.length) {
      clearGallery();
      hideLoadMoreButton();
      iziToast.show({
        message:
          'Sorry, there are no images matching your search query. Please try again! ',
        position: 'center',
        color: 'red',
      });
    } else {
      createGallery(photos.hits);

      if (page >= totalPages) {
        hideLoadMoreButton();
        iziToast.show({
          message: "We're sorry, but you've reached the end of search results",
          position: 'center',
          color: 'red',
        });
      } else {
        showLoadMoreButton();
      }
    }
  } catch (error) {
    clearGallery();
    iziToast.show({
      message: 'Failed to fetch images. Please try again later.',
      position: 'center',
      color: 'red',
    });
  }
  hideLoader();
  hideLoadMoreButton();
});

loadMore.addEventListener('click', async () => {
  page += 1;
  showLoader();

  try {
    const photos = await getImagesByQuery(query, page);
    const totalHits = photos.totalHits;
    const totalPages = Math.ceil(totalHits / perPage);

    createGallery(photos.hits);
    showLoadMoreButton();

    const galleryItem = document.querySelector('.gallery-item');
    const { height } = galleryItem.getBoundingClientRect();
    window.scrollBy({
      top: height * 2,
      behavior: 'smooth',
    });

    if (page >= totalPages) {
      hideLoadMoreButton();
      iziToast.show({
        message: "We're sorry, but you've reached the end of search results",
        position: 'center',
        color: 'red',
      });
    }
  } catch (error) {
    iziToast.show({
      message: 'Failed to fetch images. Please try again later.',
      position: 'center',
      color: 'red',
    });
  } finally {
    hideLoader();
  }
});
