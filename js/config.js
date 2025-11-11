// Основная конфигурация космического слайдера
// Содержит все настройки, изображения и тексты интерфейса
const COSMIC_CONFIG = {
	// Массив с информацией о каждом слайде
	// Каждый объект содержит: URL изображения, заголовок и описание
	images: [
		{
			url: 'https://i.pinimg.com/originals/3a/2b/c7/3a2bc78cb3ff5d913e8616354f21eac3.jpg',
			title: 'Туманность Ориона',
			description: 'Облако межзвездного газа в созвездии Ориона',
		},
		{
			url: 'https://i.ytimg.com/vi/Pbpb5Xx34j0/maxresdefault.jpg',
			title: 'Туманность Улитка',
			description: 'Планетарная туманность в созвездии Водолея',
		},
		{
			url: 'https://cdn.shazoo.ru/745142_4MRghr0_nebula2.jpg',
			title: 'Туманность Конская Голова',
			description: 'Туманность в созвездии Ориона',
		},
		{
			url: 'https://cs5.pikabu.ru/post_img/big/2015/11/20/5/1448006034_1097824289.jpg',
			title: 'Туманность Кошачий Глаз',
			description: 'Планетарная туманность в созвездии Дракона',
		},
		{
			url: 'https://i.pinimg.com/originals/a4/d5/39/a4d5391db2e83745b5788ee09f539459.jpg',
			title: 'Туманность Песочные Часы',
			description: 'ТУманность в созвездии Тельца',
		},
		{
			url: 'https://i.pinimg.com/originals/ee/cd/4a/eecd4a793addcadc4fe7525bb20ac200.jpg',
			title: 'Крабовидная туманность',
			description: 'Газообразная туманность в созвездии Тельца',
		},
		{
			url: 'https://naked-science.ru/wp-content/uploads/2022/12/image-586.png',
			title: 'Шлем Тора',
			description: 'Эмиссионная туманность в созвездии Большого Пса вокруг звезды Вольфа — Райе',
		},
		{
			url: 'https://avatars.mds.yandex.net/i?id=52dd9746a1600b8cb2a14779922267a1_l-4033773-images-thumbs&n=13',
			title: 'Туманность Черепаха',
			description: 'Планетарная туманность, расположенная в созвездии Геркулеса',
		},
		{
			url: 'https://avatars.mds.yandex.net/i?id=15a2b3c87ae0cc084e6360aa63f802ba_l-12753003-images-thumbs&n=13',
			title: 'Призрак Юпитера',
			description: 'Планетарная туманность, расположенная в созвездии Гидры',
		},
		{
			url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Ngc2392.jpg/1200px-Ngc2392.jpg',
			title: 'Эскимосская туманность, также известная как Туманность Клоун-Фейс',
			description: 'Биполярная двухслойная планетарная туманность',
		},
		{
			url: 'https://i.pinimg.com/originals/7a/61/f5/7a61f52e6f71ec0f39da3577bfcaf270.jpg',
			title: 'Туманность Медузы',
			description: 'Планетарная туманность в созвездии Близнецов',
		},
		// {
		// 	url: '',
		// 	title: '',
		// 	description: '',
		// },
		// {
		// 	url: '',
		// 	title: '',
		// 	description: '',
		// },
	],
	// Настройки поведения слайдера
	slider: {
		// Включить автоматическое переключение слайдов
		autoplay: true,
		// Задержка между слайдами в миллисекундах (5 секунд)
		autoplayDelay: 5000,
		// Продолжительность анимации перехода в миллисекундах
		transitionDuration: 800,
	},
	// Тексты и надписи пользовательского интерфейса
	ui: {
		// Основной заголовок приложения
		title: 'Cosmic Slider',
		// Подзаголовок с описанием
		subtitle: 'Путешествие по туманностям Вселенной',
		prevButton: 'Назад',
		nextButton: 'Вперед',
	},
};
