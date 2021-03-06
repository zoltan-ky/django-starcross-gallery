// Load images on demand as user scrolls down the page

var pagination_size = 40;
var scroll_cursor = 0;

function init_infinite_scroll() {
    load_images_from_cursor(scroll_cursor);
}

function check_infinite_scroll(event) {
    // Based on https://benjaminhorn.io/code/how-to-implement-infinite-scroll/
    // Modified to handle a scrollable element nested within fixed elements by
    // referring to event.target
    // Fetch variables
    let scrollTop = event.target.scrollTop;
    let windowHeight = event.target.clientHeight;
    let bodyHeight = event.target.scrollHeight - windowHeight;
    let scrollPercentage = (scrollTop / bodyHeight);

    // if the scroll is more than 90% from the top, load more content.
    if (scrollPercentage > 0.7) {
        load_images_from_cursor(scroll_cursor);
    }
}

function load_images_from_cursor(cursor) {
    // Find the images in the thumbnail container
    var images = document.querySelectorAll('.image');
    var thumbnails = document.querySelectorAll('.thumbnail');
    // Ignore pages with no images
    if (images == []) {
        return;
    }
    // Change the source of the next page of images
    for (var i=scroll_cursor; i < scroll_cursor + pagination_size && i < images.length; i++) {
        var src = images[i].getAttribute('data-src');
        images[i].setAttribute('src', src);
        // Re-justify once the data has loaded
        images[i].addEventListener('load', justify_images);
        // Show the image as they load hidden (can start loading)
        thumbnails[i].style.display = 'block';
    }
    if (i >= images.length) {
        // All images have been set to load
        scroll_cursor += i;
        window.removeEventListener('scroll',check_infinite_scroll);
    } else {
        scroll_cursor += pagination_size;
    }
}

window.addEventListener('load',init_infinite_scroll);
window.addEventListener('scroll',check_infinite_scroll,{ capture: true });
