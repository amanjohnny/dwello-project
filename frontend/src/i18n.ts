import type { Language } from './store';

export const translations = {
  ru: {
    // Navigation
    home: 'Главная',
    search: 'Поиск',
    createListing: 'Создать объявление',
    matches: 'Совпадения',
    profile: 'Профиль',
    
    // Auth
    register: 'Регистрация',
    login: 'Вход',
    name: 'Имя',
    email: 'Email',
    password: 'Пароль',
    confirmPassword: 'Подтвердите пароль',
    phone: 'Телефон',
    city: 'Город',
    bio: 'О себе',
    createAccount: 'Создать аккаунт',
    alreadyHaveAccount: 'Уже есть аккаунт?',
    dontHaveAccount: 'Нет аккаунта?',
    signIn: 'Войти',
    signUp: 'Регистрация',
    
    // Home
    findRoommate: 'Найти соседа',
    latestListings: 'Последние объявления',
    allListings: 'Все объявления',
    noListings: 'Объявлений не найдено',
    
    // Search
    searchPlaceholder: 'Поиск по названию...',
    filters: 'Фильтры',
    price: 'Цена',
    housingType: 'Тип жилья',
    apartment: 'Квартира',
    room: 'Комната',
    roommate: 'Сосед',
    capacity: 'Вместимость',
    tags: 'Теги',
    studentFriendly: 'Для студентов',
    quiet: 'Тихий',
    social: 'Общительный',
    noSmoking: 'Без курения',
    petsAllowed: 'Можно с питомцами',
    apply: 'Применить',
    clear: 'Очистить',
    
    // Listing
    availableSpots: 'Свободных мест',
    contact: 'Связаться',
    imInterested: 'Мне интересно',
    owner: 'Владелец',
    posted: 'Опубликовано',
    
    // Profile
    myListings: 'Мои объявления',
    myInterests: 'Мои отклики',
    settings: 'Настройки',
    editProfile: 'Редактировать',
    save: 'Сохранить',
    cancel: 'Отмена',
    delete: 'Удалить',
    view: 'Просмотр',
    
    // Settings
    accountSettings: 'Настройки аккаунта',
    interfaceLanguage: 'Язык интерфейса',
    notifications: 'Уведомления',
    notificationsDesc: 'Получать уведомления о новых откликах',
    emailSubscription: 'Email рассылка',
    emailSubscriptionDesc: 'Получать новости и обновления',
    logout: 'Выйти из аккаунта',
    
    // Common
    from: 'от',
    perMonth: '/мес',
    spots: 'мест',
    selectCity: 'Выберите город',
    confirm: 'Подтвердить',
    back: 'Назад',
  },
  kk: {
    // Navigation - short and direct
    home: 'Басты',
    search: 'Іздеу',
    createListing: 'Жарнама',
    matches: 'Сәйкес',
    profile: 'Профиль',
    
    // Auth
    register: 'Тіркелу',
    login: 'Кіру',
    name: 'Аты',
    email: 'Email',
    password: 'Құпия',
    confirmPassword: 'Құпия қайта',
    phone: 'Телефон',
    city: 'Қала',
    bio: 'Туралы',
    createAccount: 'Аккаунт жасау',
    alreadyHaveAccount: 'Аккаунт бар ма?',
    dontHaveAccount: 'Аккаунт жоқ па?',
    signIn: 'Кіру',
    signUp: 'Тіркелу',
    
    // Home
    findRoommate: 'Көрші табу',
    latestListings: 'Соңғы жарнамалар',
    allListings: 'Барлық жарнамалар',
    noListings: 'Жарнама жоқ',
    
    // Search
    searchPlaceholder: 'Іздеу...',
    filters: 'Сүзгі',
    price: 'Баға',
    housingType: 'Үй түрі',
    apartment: 'Пəтер',
    room: 'Бөлме',
    roommate: 'Көрші',
    capacity: 'Сыйым',
    tags: 'Тегтер',
    studentFriendly: 'Студент',
    quiet: 'Тыныш',
    social: 'Қоғам',
    noSmoking: 'Шылым жоқ',
    petsAllowed: 'Үй жануары',
    apply: 'Қолдану',
    clear: 'Тазалау',
    
    // Listing
    availableSpots: 'Бос орын',
    contact: 'Байланыс',
    imInterested: 'Қызықты',
    owner: 'Ие',
    posted: 'Жарияланды',
    
    // Profile - short forms, no pronouns
    myListings: 'Жарнамаларым',
    myInterests: 'Қызығушылық',
    settings: 'Баптау',
    editProfile: 'Өзгерту',
    save: 'Сақтау',
    cancel: 'Болдырмау',
    delete: 'Жою',
    view: 'Көру',
    
    // Settings
    accountSettings: 'Аккаунт баптауы',
    interfaceLanguage: 'Тіл',
    notifications: 'Хабар',
    notificationsDesc: 'Жауап келсе хабар',
    emailSubscription: 'Email',
    emailSubscriptionDesc: 'Жаңалық алу',
    logout: 'Шығу',
    
    // Common
    from: 'бастап',
    perMonth: '/ай',
    spots: 'орын',
    selectCity: 'Қала таңда',
    confirm: 'Растау',
    back: 'Артқа',
  }
};

export const t = (key: keyof typeof translations.ru, language: Language): string => {
  return translations[language][key] || translations.ru[key] || key;
};
