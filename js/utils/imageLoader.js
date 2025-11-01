//Утилита загрузки изображений
class ImageLoader {
	constructor() {
		this.loadedImages = new Map();
	}

	//Загрузка одного изображения
	loadImage(url) {
		return new Promise((resolve, reject) => {
			//Проверка кэша
			if (this.loadedImages.has(url)) {
				resolve(this.loadedImages.get(url)); //Функция успешного завершения
				return;
			}
			//Создание HTML элемента <img>
			const img = new Image();
			//Обработчик успешной загрузки
			img.onload = () => {
				this.loadedImages.set(url, img);
				resolve(img);
			};
			//Обработчик ошибки загрузки
			img.onerror = () => {
				reject(new Error(`Failed to load image: ${url}`));
			};
			img.src = url;
		});
	}
	//Предзагрузка всех изображений
	async preloadAll(imageUrls) {
		//Массив промисов
		const loadPromises = imageUrls.map((config) => this.loadImage(config.url));
		try {
			//Ожидание завершения всех промисов в массиве с приостановкой await
			await Promise.all(loadPromises);
			console.log('Все изображения загружены');
			return true;
		} catch (error) {
			console.error('Ошибка при загрузке изображений:', error);
			return false;
		}
	}
	//Получение изображения из кэша
	getImage(url) {
		return this.loadedImages.get(url);
	}
}
