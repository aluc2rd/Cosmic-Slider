// Конфигурация космического слайдера
const COSMIC_CONFIG = {
	//URL изображений туманностей, каждый элемент массива объект
	images: [
		{
			url: 'https://avatars.mds.yandex.net/get-mpic/10141272/2a0000018c29d73ae2bcfdd20a230381131b/orig',
			title: 'Туманность Ориона',
			description: 'Облако межзвездного газа в созвездии Ориона',
		},
		{
			url: 'https://i.ytimg.com/vi/jLwWbUwjpIE/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGH8gTigeMA8=&rs=AOn4CLDt1KL4_INW7lYScL5rNU-gjHj33Q',
			title: 'Туманность Улитка',
			description: 'Планетарная туманность в созвездии Водолея',
		},
	],
	//Объект с настройками
	slider: {
		autoplay: true, //Автоматическое переключение
		autoplayDelay: 5000, //5 секундная задержка переключения
		transitionDuration: 800, //Длительность анимации перехода
	},
	//Пользовательский интерфейс и тексты для отображения
	ui: {
		title: 'Cosmic Explorer',
		subtitle: 'Путешествие по туманностям Вселенной',
		prevButton: 'Назад',
		nextButton: 'Вперед',
	},
};
