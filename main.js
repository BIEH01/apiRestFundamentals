const API_URL = "https://api.thecatapi.com/v1";

const api = axios.create({
	baseURL: API_URL,
});
api.defaults.headers.common["X_API_KEY"] = "string";

// Promise
// fetch(API_URL)
//   .then((res) => res.json())
//   .then((data) => {
//     const img = document.querySelector("img");
//     img.src = data[0].url;
//   });

const spanMessage = getElementById("message");

async function loadRandomCats() {
	const res = await fetch(`${API_URL}/images/search?limit=2`);
	const data = await res.json();

	if (res.status !== 200) {
		spanMessage.innerText = `Hubo un error ${res.status} ${data.message}`;
	} else {
		const img1 = document.getElementById("img1");
		const img2 = document.getElementById("img2");
		const btn1 = document.getElementById("btn1");
		const btn2 = document.getElementById("btn2");

		img1.src = data[0].url;
		img2.src = data[1].url;
		btn1.onclick = () => saveFavoriteCat(data[0].id);
		btn2.onclick = () => saveFavoriteCat(data[1].id);
	}
}

async function loadFavoritesCats() {
	const res = await fetch(`${API_URL}/favorites`, {
		method: "GET",
		headers: {
			"X_API_KEY": "string",
		},
	});
	const data = await res.json();

	if (res.status !== 200) {
		spanMessage.innerText = `Hubo un error ${res.status} ${data.message}`;
	} else {
		const section = document.getElementById("favoriteCats");
		section.innerHTML = "";
		const h2 = document.createElement("h2");
		const h2Txt = document.createTextNode("Gatos favoritos");
		h2.appendChild(h2Txt);
		section.appendChild(h2);

		data.forEach((cat) => {
			const articule = document.createElement("article");
			const img = document.createElement("img");
			const btn = document.createElement("button");
			const btnTxt = document.createTextNode("Remove from favorite");

			img.src = cat.image.url;
			img.width = 150;
			btn.appendChild(btnTxt);
			btn.onclick = () => deleteFavoriteCat(cat.id);
			articule.appendChild(img);
			articule.appendChild(btn);
			section.appendChild(articule);
		});
	}
}

async function saveFavoriteCat(id) {
	const { data, status } = await api.post("favorites", {
		image_id: id,
	});
	// const res = await fetch(`${API_URL}/favorites`, {
	// 	method: "POST",
	// 	headers: {
	// 		"X_API_KEY": "string",
	// 		"Content-Type": "application/json",
	// 	},
	// 	body: JSON.stringify({
	// 		image_id: id,
	// 	}),
	// });
	// const data = await res.json();

	if (status !== 200) {
		spanMessage.innerText = `Hubo un error ${status} ${data.message}`;
	} else {
		spanMessage.innerText = "A cat has been added to favorites";
		loadFavoritesCats();
	}
}

async function deleteFavoriteCat(id) {
	const res = await fetch(`${API_URL}/favorites/${id}`, {
		method: "DELETE",
		headers: {
			"X_API_KEY": "string",
		},
	});
	const data = await res.json();
	if (res.status !== 200) {
		spanMessage.innerText = `Hubo un error ${res.status} ${data.message}`;
	} else {
		spanMessage.innerText = "A cat has been removed from favorites";
		loadFavoritesCats();
	}
}

async function uploadCatPhoto() {
	const form = document.getElementById("uploadForm");
	const formData = new FormData(form);

	const res = await fetch(`${API_URL}/images/upload`, {
		method: "POST",
		headers: {
			"X_API_KEY": "string",
		},
		body: formData,
	});
}

uploadCatPhoto();
loadRandomCats();
loadFavoritesCats();
