class CosmicSlider {
	constructor() {
		// Инициализация свойств класса
		this.config = COSMIC_CONFIG; // Сохраняем конфигурацию
		this.slider = document.getElementById('slider'); // Основной контейнер слайдера
		this.indicatorsContainer = document.getElementById('indicatorsContainer'); // Контейнер индикаторов
		this.btnPrev = document.getElementById('btnPrev'); // Кнопка "Назад"
		this.btnNext = document.getElementById('btnNext'); // Кнопка "Вперед"
		this.loadingScreen = document.getElementById('loadingScreen'); // Экран загрузки
		this.slideTitle = document.getElementById('slideTitle'); // Заголовок слайда
		this.slideDescription = document.getElementById('slideDescription'); // Описание слайда

		this.imageLoader = new ImageLoader(); // Создаем загрузчик изображений
		this.slides = []; // Массив DOM-элементов слайдов
		this.indicators = []; // Массив DOM-элементов индикаторов
		this.currentIndex = 0; // Текущий активный слайд
		this.isAnimating = false; // Флаг анимации (защита от concurrent анимаций)
		this.autoplayTimer = null; // Таймер автоплея
		this.touchStartX = 0; // Начальная позиция touch для свайпа
		this.touchEndX = 0; // Конечная позиция touch для свайпа

		this.init(); // Запускаем инициализацию
	}

	async init() {
		// Основная инициализация слайдера
		console.log('🚀 Инициализация CosmicSlider...');

		this.updateUITexts(); // Обновляем тексты интерфейса из конфига
		this.showLoading(); // Показываем экран загрузки

		// Предзагружаем все изображения
		const success = await this.imageLoader.preloadAll(this.config.images);

		if (success) {
			// Успешная загрузка - создаем интерфейс
			this.createSlides();
			this.createIndicators();
			this.setEventListeners();
			this.showSlide(0); // Показываем первый слайд
			this.hideLoading(); // Скрываем экран загрузки

			// Запускаем автоплей если включен в конфиге
			if (this.config.slider.autoplay) {
				this.startAutoplay();
			}

			console.log('✅ CosmicSlider успешно инициализирован');
		} else {
			// Ошибка загрузки - показываем сообщение
			this.showError();
			console.error('❌ Ошибка инициализации CosmicSlider');
		}
	}

	updateUITexts() {
		// Обновление текстов интерфейса из конфигурации
		document.getElementById('appTitle').textContent = this.config.ui.title;
		document.getElementById('appSubtitle').textContent = this.config.ui.subtitle;
		this.btnPrev.querySelector('span').textContent = this.config.ui.prevButton;
		this.btnNext.querySelector('span').textContent = this.config.ui.nextButton;
	}

	createSlides() {
		// Создание DOM-элементов слайдов
		this.slider.innerHTML = ''; // Очищаем контейнер
		this.slides = []; // Сбрасываем массив слайдов

		this.config.images.forEach((imageConfig, index) => {
			// Создаем элемент слайда
			const slide = document.createElement('div');
			slide.className = 'slide';
			slide.dataset.index = index; // Сохраняем индекс для быстрого доступа

			// Устанавливаем фоновое изображение
			slide.style.backgroundImage = `url(${imageConfig.url})`;

			// Сохраняем метаданные в data-атрибутах
			slide.dataset.title = imageConfig.title;
			slide.dataset.description = imageConfig.description;

			// Устанавливаем начальное состояние
			if (index !== 0) {
				slide.classList.add('hidden'); // Скрываем все кроме первого
			} else {
				slide.classList.add('active'); // Первый слайд активен
			}

			// Добавляем в DOM и массив
			this.slider.appendChild(slide);
			this.slides.push(slide);
		});

		console.log(`✅ Создано ${this.slides.length} слайдов`);
	}

	createIndicators() {
		// Создание индикаторов (точки)
		this.indicatorsContainer.innerHTML = ''; // Очищаем контейнер
		this.indicators = []; // Сбрасываем массив индикаторов

		this.config.images.forEach((_, index) => {
			// Создаем кнопку-индикатор
			const indicator = document.createElement('button');
			indicator.className = 'indicator';
			indicator.setAttribute('aria-label', `Перейти к слайду ${index + 1}`); // Accessibility

			// Первый индикатор активен
			if (index === 0) {
				indicator.classList.add('active');
			}

			// Обработчик клика по индикатору
			indicator.addEventListener('click', () => {
				console.log(`🎯 Клик по индикатору ${index}`);
				this.showSlide(index);
			});

			// Добавляем в DOM и массив
			this.indicatorsContainer.appendChild(indicator);
			this.indicators.push(indicator);
		});

		console.log(`✅ Создано ${this.indicators.length} индикаторов`);
	}

	setEventListeners() {
		// Настройка всех обработчиков событий

		// Обработчики кнопок навигации
		this.btnPrev.addEventListener('click', () => {
			console.log('⬅️ Клик по кнопке "Назад"');
			this.showPreviousSlide();
		});

		this.btnNext.addEventListener('click', () => {
			console.log('➡️ Клик по кнопке "Вперед"');
			this.showNextSlide();
		});

		// Управление с клавиатуры
		document.addEventListener('keydown', (e) => {
			switch (e.key) {
				case 'ArrowLeft':
					console.log('⌨️ Клавиша "Стрелка влево"');
					this.showPreviousSlide();
					break;
				case 'ArrowRight':
					console.log('⌨️ Клавиша "Стрелка вправо"');
					this.showNextSlide();
					break;
				case 'Escape':
					console.log('⌨️ Клавиша "Escape" - пауза автоплея');
					this.pauseAutoplay();
					break;
				case ' ':
					console.log('⌨️ Клавиша "Пробел" - переключение автоплея');
					e.preventDefault(); // Предотвращаем прокрутку страницы
					this.toggleAutoplay();
					break;
			}
		});

		// Touch события для мобильных устройств
		this.slider.addEventListener(
			'touchstart',
			(e) => {
				this.touchStartX = e.changedTouches[0].screenX;
			},
			{ passive: true },
		);

		this.slider.addEventListener(
			'touchend',
			(e) => {
				this.touchEndX = e.changedTouches[0].screenX;
				this.handleSwipe();
			},
			{ passive: true },
		);

		// Пауза автоплея при наведении
		this.slider.addEventListener('mouseenter', () => {
			console.log('🐭 Наведение на слайдер - пауза автоплея');
			this.pauseAutoplay();
		});

		this.slider.addEventListener('mouseleave', () => {
			if (this.config.slider.autoplay) {
				console.log('🐭 Уход с слайдера - возобновление автоплея');
				this.startAutoplay();
			}
		});

		console.log('✅ Обработчики событий установлены');
	}

	handleSwipe() {
		// Обработка свайпов на мобильных устройствах
		const swipeThreshold = 50; // Минимальное расстояние свайпа
		const swipeDistance = this.touchStartX - this.touchEndX;

		if (Math.abs(swipeDistance) > swipeThreshold) {
			if (swipeDistance > 0) {
				console.log('📱 Свайп влево - следующий слайд');
				this.showNextSlide();
			} else {
				console.log('📱 Свайп вправо - предыдущий слайд');
				this.showPreviousSlide();
			}
		}
	}

	showLoading() {
		// Показ экрана загрузки
		this.loadingScreen.style.display = 'flex';
		console.log('⏳ Показ экрана загрузки...');
	}

	hideLoading() {
		// Скрытие экрана загрузки
		this.loadingScreen.style.display = 'none';
		console.log('✅ Экран загрузки скрыт');
	}

	showError() {
		// Показ сообщения об ошибке
		this.loadingScreen.innerHTML = `
            <div class="error-content">
                <h2>🌌 Ошибка загрузки</h2>
                <p>Не удалось загрузить космические изображения. Пожалуйста, проверьте подключение к интернету.</p>
                <button onclick="location.reload()" class="retry-btn">🔄 Попробовать снова</button>
            </div>
        `;
		console.error('❌ Показано сообщение об ошибке');
	}

	showPreviousSlide() {
		// Показ предыдущего слайда
		if (this.isAnimating) {
			console.log('⏸️ Анимация в процессе - игнорируем запрос');
			return; // Защита от спама во время анимации
		}

		let newIndex = this.currentIndex - 1;
		// Циклическая навигация: если ушли ниже 0, переходим к последнему
		if (newIndex < 0) {
			newIndex = this.slides.length - 1;
		}

		console.log(`⬅️ Переход к предыдущему слайду: ${this.currentIndex} → ${newIndex}`);
		this.showSlide(newIndex);
	}

	showNextSlide() {
		// Показ следующего слайда
		if (this.isAnimating) {
			console.log('⏸️ Анимация в процессе - игнорируем запрос');
			return; // Защита от спама во время анимации
		}

		let newIndex = this.currentIndex + 1;
		// Циклическая навигация: если превысили количество, переходим к первому
		if (newIndex >= this.slides.length) {
			newIndex = 0;
		}

		console.log(`➡️ Переход к следующему слайду: ${this.currentIndex} → ${newIndex}`);
		this.showSlide(newIndex);
	}

	showSlide(index) {
		// Основной метод переключения слайдов

		// Проверяем валидность запроса
		if (this.isAnimating) {
			console.log('⏸️ Анимация в процессе - игнорируем запрос');
			return;
		}
		if (index === this.currentIndex) {
			console.log('🔁 Запрос текущего слайда - игнорируем');
			return;
		}
		if (index < 0 || index >= this.slides.length) {
			console.error(`❌ Неверный индекс слайда: ${index}`);
			return;
		}

		console.log(`🎬 Начало анимации: ${this.currentIndex} → ${index}`);
		this.isAnimating = true; // Устанавливаем флаг анимации

		const currentSlide = this.slides[this.currentIndex];
		const nextSlide = this.slides[index];

		// Скрываем текущий слайд
		currentSlide.classList.remove('active');
		currentSlide.classList.add('hidden');

		// Обновляем индикаторы
		this.indicators[this.currentIndex].classList.remove('active');
		this.indicators[index].classList.add('active');

		// Показываем новый слайд
		nextSlide.classList.remove('hidden');

		// Используем requestAnimationFrame для плавной анимации
		requestAnimationFrame(() => {
			nextSlide.classList.add('active');

			// Обновляем информацию о слайде
			this.updateSlideInfo(index);

			// Обновляем текущий индекс и снимаем флаг анимации
			this.currentIndex = index;
			this.isAnimating = false;

			console.log(`✅ Анимация завершена. Текущий слайд: ${this.currentIndex}`);
		});
	}

	updateSlideInfo(index) {
		// Обновление информации о текущем слайде
		const slide = this.slides[index];
		this.slideTitle.textContent = slide.dataset.title;
		this.slideDescription.textContent = slide.dataset.description;

		console.log(`📝 Обновлена информация слайда: "${slide.dataset.title}"`);
	}

	startAutoplay() {
		// Запуск автоматического переключения
		if (this.autoplayTimer) {
			console.log('⏸️ Автоплей уже запущен');
			return;
		}

		console.log('▶️ Запуск автоплея');
		this.autoplayTimer = setInterval(() => {
			this.showNextSlide();
		}, this.config.slider.autoplayDelay);
	}

	pauseAutoplay() {
		// Пауза автоплея
		if (this.autoplayTimer) {
			console.log('⏸️ Пауза автоплея');
			clearInterval(this.autoplayTimer);
			this.autoplayTimer = null;
		}
	}

	toggleAutoplay() {
		// Переключение автоплея (вкл/выкл)
		if (this.autoplayTimer) {
			this.pauseAutoplay();
		} else {
			this.startAutoplay();
		}
	}

	getCurrentSlideInfo() {
		// Получение информации о текущем слайде
		return {
			index: this.currentIndex,
			total: this.slides.length,
			title: this.slides[this.currentIndex].dataset.title,
			description: this.slides[this.currentIndex].dataset.description,
		};
	}
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
	console.log('📄 DOM загружен, инициализация CosmicSlider...');
	window.cosmicSlider = new CosmicSlider(); // Сохраняем в глобальной области для отладки
});
