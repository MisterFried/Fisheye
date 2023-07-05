import { MediaType } from "../interfaces/interfaces";

// * Like event Handler
export function likeEventHandler(mediaList: Array<MediaType>) {
	const mediaLikeButtons: Array<HTMLSpanElement> = Array.from(
		document.querySelectorAll(".photographer-media__legend-likes")
	);

	mediaLikeButtons.forEach(mediaLikeButton => {
		mediaLikeButton.addEventListener("click", event => {
			const target = event.currentTarget as HTMLSpanElement;

			// * DOM element corresponding to the clicked media (image or video)
			const mediaElement = target.parentElement?.parentElement?.firstElementChild?.firstElementChild;

			if (mediaElement) {
				let clickedMediaIndex = 0;
				if (mediaElement instanceof HTMLImageElement) {
					/* .slice are used because the images displayed on the photographer page aren't the
					 originals but rather resized version with "_resized" in filename */
					const resizedImageName = mediaElement.src.split("/").pop();
					const clickedImageName = resizedImageName?.slice(0, -13);
					clickedMediaIndex = mediaList.findIndex(media => media.image?.slice(0, -5) === clickedImageName);
				}
				if (mediaElement instanceof HTMLVideoElement) {
					const videoSourceElement = mediaElement.firstChild as HTMLSourceElement;
					const clickedVideoSource = videoSourceElement.src.split("/").pop();
					clickedMediaIndex = mediaList.findIndex(media => media.video === clickedVideoSource);
				}
				likeMedia(clickedMediaIndex);
			} else console.error("Error : Couldn't find the media associated to the like button");

			// * Likes or Unlikes the media
			function likeMedia(index: number) {
				if (!mediaList[index].isLiked) {
					mediaList[index].likes += 1;
					mediaList[index].isLiked = true;
					mediaLikeButton.innerHTML = `${mediaList[index].likes} <i class="fa-solid fa-heart" aria-label="likes" ></i>`;
				} else {
					mediaList[index].likes -= 1;
					mediaList[index].isLiked = false;
					mediaLikeButton.innerHTML = `${mediaList[index].likes} <i class="fa-regular fa-heart" aria-label="likes" ></i>`;
				}
				updatePhotographerInfoBarLikes(mediaList);
			}
		});
	});
}

// * Update the number of likes in the photogrpahers' infobar
export function updatePhotographerInfoBarLikes(mediaList: Array<MediaType>) {
	const infoBarLikes = document.querySelector(".photographer-info-bar__likes") as HTMLSpanElement;
	let totalLikes = 0;
	mediaList.forEach(media => (totalLikes += media.likes));
	infoBarLikes.innerHTML = `${totalLikes} <i class = "fa-solid fa-heart" aria-label="likes"></i>`;
}
