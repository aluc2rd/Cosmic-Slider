//Инкапсуляция всей логики в одном месте
class CosmicSlider {
	constructor() {
		//Ссылка на глобальную конфигурацию (все методы класса имеют доступ к настройкам)
		this.config = COSMIC_CONFIG;
		this.slider = document.getElementById('slider');
		this.indicatorsContainer = document.getElementById('indicatorsContainer');
		this.btnPrev = document.getElementById('btnPrev');
		this.btnNext = document.getElementById('btnNext');
		this.loadingScreen = document.getElementById('loadingScreen');
		this.slideTitle = document.getElementById('slideTitle');
		this.slideDescription = document.getElementById('slideDescription');

		//Экземпляр класса загрузки
		this.imageLoader = new ImageLoader();
		//Инициализации состояний
		this.slides = [];
		this.indicators = [];
		this.currentIndex = 0;
		this.isAnimating = false;
		this.autoplayTimer = null;
		//Весь последующий код выполняет в init
		this.init();
	}

	async init() {
		//Обновление текста интерфейса
		this.updateUIText();
		this.showLoading();
		//Предзагрузка изображений с ожиданием
		const success = await this.imageLoader.preloadAll(this.config.images);

		if (success) {
			this.createSlides();
			this.createIndicators();
			this.setEventListeners();
			this.showSlide(0);
			this.hideLoading();

			if (this.config.autoplay) {
				this.startAutoplay();
			}
		} else {
			this.showError();
		}
	}

	updateUIText() {
		document.getElementById('appTitle').textContent = this.config.ui.title;
		document.getElementById('appSubtitle').textContent = this.config.ui.subtitle;
		this.btnPrev.querySelector('span').textContent = this.config.ui.prevButton;
		this.btnNext.querySelector('span').textContent = this.config.ui.nextButton;
	}
	createSlides() {
		//Подготовка и очистка
		this.slider.innerHTML = '';
		this.slides = [];

		this.config.images.forEach((imageConfig, index) => {
			//Создание DOM элемента
			const slide = document.createElement('div');
			slide.className = 'slide';
			slide.dataset.index = index;

			const img = this.imageLoader.getImage(imageConfig.url);
			slide.style.backgroundImage = `url('${imageConfig.src}')`;

			//Добавление информации о слайде в дата атрибуты
			slide.dataset.title = imageConfig.title;
			slide.dataset.description = imageConfig.description;

			// Установка начального состояния
			if (index !== 0) {
				slide.classList.add('hidden');
			} else {
				slide.classList.add('active');
			}
			// Добавление в DOM и массив
			this.slider.appendChild(slide);
			this.slides.push(slide);
		});
	}
	createIndicators() {
		this.indicatorsContainer.innerHTML = '';
		this.indicators = [];

		this.config.images.forEach((_, index) => {
			//Индикаторы-кнопки
			const indicator = document.createElement('button');
			indicator.className = 'indicator';
			//Назвначение для скринридеров и нумерация с 1
			indicator.setAttribute('aria-label', `Перейти к слайду ${index + 1}`);

			if (index === 0) {
				indicator.classList.add('active');
			}

			//Стрелочная функция для обращения к глобальному контексту this (CosmicSlider)
			indicator.addEventListener('click', () => {
				this.showSlide(index);
			});

			this.indicatorsContainer.appendChild(indicator);
			this.indicators.push(indicator);
		});
	}
	setEventListeners() {
		this.btnPrev.addEventListener('click', () => {
			this.showPreviousSlide();
		});

		this.btnNext.addEventListener('click', () => {
			this.showNextSlide();
		});

		//Обработчики клавиатуры
		document.addEventListener('keydown', (event) => {
			if (event.key === 'ArrowLeft') this.showPreviousSlide();
			if (event.key === 'ArrowRight') this.showNextSlide();
			if (event.key === 'Escape') this.pauseAutoplay();
		});

		//Пауза при наведении
		this.slider.addEventListener('mouseenter', () => {
			this.pauseAutoplay();
		});
		//Курсор вышел за пределы элемента
		this.slider.addEventListener('mouseleave', () => {
			if (this.config.autoplay) {
				this.startAutoplay();
			}
		});
	}
	showLoading() {
		this.loadingScreen.style.display = 'flex';
	}
	hideLoading() {
		//Полное скрытие элемента из потока
		this.loadingScreen.style.display = 'none';
	}
	showError() {
		// Перезагрузка при клике по кнопке
		this.loadingScreen.innerHTML = `
			<div class="error-content">
				<h2>Ошибка загрузки</h2>
				<p>Не удалось загрузить изображения. Пожалуйста, проверьте подключение к интернету.</p>
				
        <button onclick="location.reload()">Попробовать снова</button>
			</div>
		`;
	}
	showPreviousSlide() {
		// Защита от спама анимациями при помощи проверки флага
		if (this.isAnimating) return;

		//Закольцовывание слайдов
		let newIndex = this.currentIndex - 1;
		if (newIndex < 0) newIndex = this.slides.length - 1;
		this.showSlide(newIndex);
	}
	showNextSlide() {
		if (this.isAnimating) return;

		let newIndex = this.currentIndex + 1;
		if (newIndex >= this.slides.length) newIndex = 0;
		this.showSlide(newIndex);
	}
	showSlide(index) {
		if (this.isAnimating || this.currentIndex === index) return;

		//Установка флага анимации
		this.isAnimating = true;

		//Скрытие текущего слайда
		this.slides[this.currentIndex].classList.remove('active');
		this.slides[this.currentIndex].classList.add('hidden');

		//Обновление индикаторов
		this.indicators[this.currentIndex].classList.remove('active');
		this.indicators[index].classList.add('active');

		//Новый слайд
		this.slides[index].classList.remove('hidden');

		//Ожидание следующего кадра анимации
		requestAnimationFrame(() => {
			this.slides[index].classList.add('active');

			//Обновление информации о слайде
			this.updateSlideInfo(index);
			//Сохранение новой позиции
			this.currentIndex = index;
			//Разрешение на новые анимации
			this.isAnimating = false;
		});
	}
	updateSlideInfo(index) {
		const slide = this.slides[index];
		//Изъятие данных из дата атрибутов
		this.slideTitle.textContent = slide.dataset.title;
		//Вставка в DOM элементы
		this.slideDescription.textContent = slide.dataset.description;
	}
	startAutoplay() {
		//Ссылка на таймер
		this.autoplayTimer = setInterval(() => {
			this.showNextSlide();
		}, this.config.slider.autoplayDelay);
	}
	pauseAutoplay() {
		if (this.autoplayTimer) {
			//Остановка таймера
			clearInterval(this.autoplayTimer);
			//Очистка ссылки
			this.autoplayTimer = null;
		}
	}
}
//Инициализация при полной готовности DOM
document.addEventListener('DOMContentLoaded', () => {
	new CosmicSlider();
});
