/**
 * CENTRAL PERSONALIZATION CONFIGURATION
 * Edit the values below to customize the entire 16-page birthday experience.
 */
const BIRTHDAY_CONFIG = {
  friendName: "Srijana",
  senderName: "Your Friend",
  birthdayDate: "November 25",

  // Page 2: Welcome Screen
  welcomeHeadline: "A Magical Day Begins...",
  welcomeMessage:
    "Today isn't just another date on the calendar—it's the day the world became brighter, kinder, and infinitely more fun because you arrived in it. Take a deep breath and step into a little storybook made just for you.",

  // Page 5 & 6: Birthday & Candle Wishes
  birthdayMessages: {
    grandSubtitle: "May your year sparkle with endless joy, laughter, and magic.",
    candleWishReveal:
      "Your wish has been carried up into the stars! May every single dream you whispered tonight bloom into reality this year."
  },

  // Page 7: Cake Cutting Reveal
  cakeHiddenMessage:
    "Life is sweeter with you in it! Here's to sharing a million more slices of laughter, late-night talks, and unforgettable adventures.",

  // Page 8: Memory Gallery (Replace 'image' with local paths like 'assets/photo1.jpg' or URLs)
  memoryPhotos: [
    {
      id: 1,
      image: "", // Leave empty to render custom pastel kawaii SVG art, or add image URL/path
      svgTheme: "sunset",
      date: "Spring Memories",
      caption: "Golden hour laughs that lasted until the stars came out."
    },
    {
      id: 2,
      image: "",
      svgTheme: "coffee",
      date: "Cozy Afternoons",
      caption: "Our favorite corner table and endless stories over warm drinks."
    },
    {
      id: 3,
      image: "",
      svgTheme: "adventure",
      date: "Spontaneous Trips",
      caption: "Getting lost on purpose and finding the best memories."
    },
    {
      id: 4,
      image: "",
      svgTheme: "stargazing",
      date: "Midnight Wishes",
      caption: "Talking about our biggest dreams under a velvet sky."
    }
  ],

  // Page 10: Gift 1 (Flower Bouquet)
  gift1Message:
    "A bouquet that never fades—just like the kindness, warmth, and sunshine you bring into everyone's life every single day.",

  // Page 11: Gift 2 (Special Memory Card)
  gift2Title: "My Favorite Chapter With You",
  gift2Image: "", // Optional image URL/path; falls back to dreamy illustration
  gift2Message:
    "No matter how busy life gets or where the road takes us, knowing I have a friend like you is my favorite comfort. Thank you for always showing up with an open heart.",

  // Page 12: Gift 3 (Wax Seal Envelope)
  gift3Message:
    "A little secret promise: Whenever you doubt how amazing you are, remember that you are someone's favorite person, biggest inspiration, and cherished best friend.",

  // Page 13: Friendship Quiz (5 Questions)
  quizQuestions: [
    {
      question: "What is our ultimate comfort activity when hanging out?",
      options: [
        "Talking for hours until we lose track of time",
        "Going on an intense 10-mile mountain hike",
        "Sitting in complete silence staring at walls",
        "Filing taxes together"
      ],
      correctIndex: 0,
      funnyFeedback: "100% accurate! Five minutes turns into five hours effortlessly."
    },
    {
      question: "What happens whenever we try to take a 'serious' photo?",
      options: [
        "We look like Vogue cover models immediately",
        "Someone bursts out laughing within 2 seconds",
        "The camera mysteriously breaks",
        "We forget how to smile"
      ],
      correctIndex: 1,
      funnyFeedback: "Every single time—the bloopers are always better than the real photo!"
    },
    {
      question: "If you were a pastel aesthetic element, which one would you be?",
      options: [
        "A moody thunderstorm cloud",
        "Warm golden sunlight through cherry blossoms",
        "An expired parking ticket",
        "A fluorescent office lightbulb"
      ],
      correctIndex: 1,
      funnyFeedback: "Pure sunshine and cherry blossom energy—unmatched!"
    },
    {
      question: "What is the official rule on your birthday?",
      options: [
        "Calories and responsibilities do not exist today",
        "You have to do everyone else's chores",
        "Bedtime is strictly 7:30 PM",
        "No cake allowed"
      ],
      correctIndex: 0,
      funnyFeedback: "Laws of physics and calories are officially suspended today!"
    },
    {
      question: "How awesome is our friendship?",
      options: [
        "Pretty decent, 6/10",
        "Legendary fairytale tier (Infinity/10)",
        "Still in beta testing",
        "Needs a software update"
      ],
      correctIndex: 1,
      funnyFeedback: "Certified legendary status! Wouldn't trade it for anything."
    }
  ],

  // Page 15: Secret Unfolding Letter
  finalLetter: `Dearest {friendName},

Happy Birthday! As you read these words, I hope you feel surrounded by all the love, warmth, and magic you so effortlessly give to the people around you.

Watching you grow, chase your dreams, and light up every room you walk into is one of my greatest joys. Thank you for the laughter that heals bad days, the loyalty that never wavers, and the countless small moments that have become my favorite memories.

May this new chapter bring you gentle mornings, bold adventures, peace in your heart, and reasons to smile every single day.

Always cheering for you,
{senderName}`,

  // Page 16: Grand Finale
  finaleWish:
    "Here is to your brightest, happiest, most magical year yet. Happy Birthday, {friendName}!",

  // Audio Settings (Set optional MP3 path; built-in Web Audio Music Box plays automatically if empty)
  backgroundMusic: ""
};
