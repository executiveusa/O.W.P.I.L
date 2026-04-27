import type { AgentSkill, SkillExecutionContext } from '../../types'
import { z } from 'zod'

// Anime knowledge database embedded in the skill
const ANIME_QUOTES = {
  motivation: [
    { quote: "Believe in yourself. Not in the you who believes in me. Not the me who believes in you. Believe in the you who believes in yourself.", anime: "Gurren Lagann", character: "Kamina" },
    { quote: "If you don't take risks, you can't create a future.", anime: "One Piece", character: "Monkey D. Luffy" },
    { quote: "The world isn't perfect. But it's there for us, doing the best it can... that's what makes it so damn beautiful.", anime: "Fullmetal Alchemist", character: "Roy Mustang" },
    { quote: "Whatever you lose, you'll find it again. But what you throw away you'll never get back.", anime: "Fullmetal Alchemist: Brotherhood", character: "Kimimaro" },
    { quote: "A lesson without pain is meaningless. That's because no one can gain without sacrificing something.", anime: "Fullmetal Alchemist: Brotherhood", character: "Edward Elric" },
    { quote: "Power comes in response to a need, not a desire. You have to create that need.", anime: "Dragon Ball Z", character: "Goku" },
    { quote: "Being weak is nothing to be ashamed of. Staying weak is.", anime: "Fullmetal Alchemist: Brotherhood", character: "Fuhrer King Bradley" },
    { quote: "If you don't like your destiny, don't accept it. Instead, have the courage to change it the way you want it to be.", anime: "Naruto", character: "Naruto Uzumaki" },
  ],
  purpose: [
    { quote: "A person grows up when they're able to overcome hardships. Protection is important, but there are some things that a person must learn on their own.", anime: "Fairy Tail", character: "Erza Scarlet" },
    { quote: "I am not alone. I can hear them... I can hear everyone's voices... I can sense everyone's feelings... I am not alone... everyone's feelings... they support me... they are what give me the will to stand and fight!", anime: "Fairy Tail", character: "Natsu Dragneel" },
    { quote: "We are all like fireworks: We climb, we shine and always go our separate ways and become further apart. But even when that time comes, let's not disappear like a firework and continue to shine... forever.", anime: "Bleach", character: "Toshiro Hitsugaya" },
    { quote: "Even if I die, you keep living okay? Live to see the end of this world, and to see why it was born. Live to see why a weak girl like me ended up here... and the reason you and I met.", anime: "Attack on Titan", character: "Carla Yeager" },
  ],
  perseverance: [
    { quote: "People's lives don't end when they die, it ends when they lose faith.", anime: "Naruto", character: "Itachi Uchiha" },
    { quote: "Hard work is worthless for those that don't believe in themselves.", anime: "Naruto", character: "Naruto Uzumaki" },
    { quote: "Fear is not evil. It tells you what your weakness is. And once you know your weakness, you can become stronger as well as kinder.", anime: "Fairy Tail", character: "Gildarts Clive" },
    { quote: "Giving up kills people. When people reject giving up... they finally win the right to transcend humanity.", anime: "Gurren Lagann", character: "Simon" },
  ],
}

const ANIME_RECOMMENDATIONS = {
  action: [
    { title: "Attack on Titan", genres: ["Action", "Drama", "Fantasy"], description: "Humanity fights for survival against giant humanoid Titans.", rating: 9.0 },
    { title: "Demon Slayer", genres: ["Action", "Supernatural"], description: "A boy becomes a demon slayer to save his sister and avenge his family.", rating: 8.7 },
    { title: "Jujutsu Kaisen", genres: ["Action", "Supernatural", "School"], description: "A student joins a secret organization of Jujutsu Sorcerers.", rating: 8.6 },
    { title: "My Hero Academia", genres: ["Action", "School", "Superhero"], description: "A quirkless boy dreams of becoming the greatest hero.", rating: 8.4 },
  ],
  romance: [
    { title: "Your Name", genres: ["Romance", "Drama", "Supernatural"], description: "Two strangers discover they are linked in a bizarre way.", rating: 9.0 },
    { title: "Toradora!", genres: ["Romance", "Comedy", "School"], description: "Two unlikely students help each other pursue their crushes.", rating: 8.2 },
    { title: "Fruits Basket", genres: ["Romance", "Drama", "Supernatural"], description: "A girl discovers a family cursed by the Chinese zodiac.", rating: 8.6 },
  ],
  philosophical: [
    { title: "Neon Genesis Evangelion", genres: ["Mecha", "Psychological", "Drama"], description: "Teenagers pilot giant mechs to save humanity while battling inner demons.", rating: 8.5 },
    { title: "Steins;Gate", genres: ["Sci-Fi", "Thriller", "Drama"], description: "A scientist discovers time travel with devastating consequences.", rating: 9.1 },
    { title: "Monster", genres: ["Psychological", "Thriller", "Drama"], description: "A doctor hunts a former patient who became a serial killer.", rating: 8.9 },
    { title: "Death Note", genres: ["Psychological", "Supernatural", "Thriller"], description: "A student finds a notebook that kills anyone whose name is written in it.", rating: 9.0 },
  ],
  adventure: [
    { title: "One Piece", genres: ["Adventure", "Action", "Comedy"], description: "A pirate crew searches for the ultimate treasure.", rating: 8.7 },
    { title: "Hunter x Hunter", genres: ["Adventure", "Action", "Fantasy"], description: "A boy becomes a Hunter to find his missing father.", rating: 9.1 },
    { title: "Made in Abyss", genres: ["Adventure", "Fantasy", "Drama"], description: "A girl descends into a mysterious chasm to find her mother.", rating: 8.7 },
  ],
  healing: [
    { title: "A Silent Voice", genres: ["Drama", "Romance"], description: "A former bully seeks redemption by befriending the deaf girl he tormented.", rating: 8.9 },
    { title: "Violet Evergarden", genres: ["Drama", "Fantasy", "Slice of Life"], description: "A former soldier learns to understand emotions through writing letters.", rating: 8.6 },
    { title: "March Comes in Like a Lion", genres: ["Drama", "Slice of Life", "Sports"], description: "A professional shogi player battles depression with help from a kind family.", rating: 8.5 },
  ],
}

export const animeSkills: AgentSkill[] = [
  {
    id: 'anime_quote',
    name: 'Get Anime Quote',
    description: 'Get an inspirational anime quote based on a theme (motivation, purpose, perseverance)',
    category: 'system',
    schema: {
      theme: z.enum(['motivation', 'purpose', 'perseverance', 'random']).describe('The theme of the quote'),
    },
    execute: async (args) => {
      const theme = args.theme as keyof typeof ANIME_QUOTES | 'random'
      
      if (theme === 'random') {
        const themes = Object.keys(ANIME_QUOTES) as (keyof typeof ANIME_QUOTES)[]
        const randomTheme = themes[Math.floor(Math.random() * themes.length)]
        const quotes = ANIME_QUOTES[randomTheme]
        return quotes[Math.floor(Math.random() * quotes.length)]
      }
      
      const quotes = ANIME_QUOTES[theme]
      return quotes[Math.floor(Math.random() * quotes.length)]
    },
  },
  
  {
    id: 'anime_recommend',
    name: 'Recommend Anime',
    description: 'Get anime recommendations based on genre/mood',
    category: 'system',
    schema: {
      genre: z.enum(['action', 'romance', 'philosophical', 'adventure', 'healing']).describe('The genre or mood'),
      count: z.number().min(1).max(5).optional().describe('Number of recommendations (1-5)'),
    },
    execute: async (args) => {
      const genre = args.genre as keyof typeof ANIME_RECOMMENDATIONS
      const count = (args.count as number) || 3
      
      const recommendations = ANIME_RECOMMENDATIONS[genre]
      const shuffled = [...recommendations].sort(() => Math.random() - 0.5)
      return shuffled.slice(0, count)
    },
  },
  
  {
    id: 'anime_search',
    name: 'Search Anime Database',
    description: 'Search for anime information using external APIs',
    category: 'web',
    schema: {
      query: z.string().describe('The anime title or keyword to search'),
    },
    execute: async (args, context?: SkillExecutionContext) => {
      const query = args.query as string
      
      try {
        // Use Jikan API (MyAnimeList unofficial API)
        const response = await fetch(
          `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=5`
        )
        
        if (!response.ok) {
          throw new Error('Failed to search anime database')
        }
        
        const data = await response.json()
        
        return data.data?.map((anime: any) => ({
          title: anime.title,
          titleJapanese: anime.title_japanese,
          synopsis: anime.synopsis?.slice(0, 300) + '...',
          score: anime.score,
          episodes: anime.episodes,
          status: anime.status,
          genres: anime.genres?.map((g: any) => g.name),
          year: anime.year,
          imageUrl: anime.images?.jpg?.image_url,
        })) || []
      } catch (error) {
        return { error: 'Failed to search anime database', query }
      }
    },
  },
  
  {
    id: 'anime_character_analysis',
    name: 'Analyze Character Archetype',
    description: 'Analyze a character or person based on anime archetypes',
    category: 'system',
    schema: {
      traits: z.array(z.string()).describe('List of personality traits to analyze'),
    },
    execute: async (args) => {
      const traits = args.traits as string[]
      
      const archetypes = [
        { name: 'Shonen Protagonist', traits: ['determined', 'optimistic', 'loyal', 'never gives up'], anime: ['Naruto', 'Luffy', 'Goku'] },
        { name: 'Kuudere', traits: ['calm', 'stoic', 'intelligent', 'reserved'], anime: ['Rei Ayanami', 'Homura Akemi', 'Sesshomaru'] },
        { name: 'Tsundere', traits: ['passionate', 'caring underneath', 'initially hostile', 'protective'], anime: ['Taiga Aisaka', 'Asuka Langley', 'Vegeta'] },
        { name: 'Mentor Figure', traits: ['wise', 'experienced', 'patient', 'guides others'], anime: ['Jiraiya', 'All Might', 'Kakashi'] },
        { name: 'Anti-Hero', traits: ['morally gray', 'independent', 'complex', 'effective'], anime: ['Lelouch', 'Light Yagami', 'Itachi'] },
        { name: 'Genki Girl/Boy', traits: ['energetic', 'cheerful', 'enthusiastic', 'uplifting'], anime: ['Mako Mankanshoku', 'Zenitsu', 'Denki'] },
      ]
      
      // Score each archetype based on matching traits
      const scores = archetypes.map(archetype => {
        const matchCount = traits.filter(trait => 
          archetype.traits.some(at => 
            trait.toLowerCase().includes(at.toLowerCase()) || 
            at.toLowerCase().includes(trait.toLowerCase())
          )
        ).length
        return { ...archetype, score: matchCount / archetype.traits.length }
      })
      
      // Return top 3 matches
      return scores.sort((a, b) => b.score - a.score).slice(0, 3)
    },
  },
  
  {
    id: 'daily_anime_inspiration',
    name: 'Daily Anime Inspiration',
    description: 'Generate a daily inspiration message combining anime wisdom with life advice',
    category: 'system',
    schema: {},
    execute: async () => {
      const themes = Object.keys(ANIME_QUOTES) as (keyof typeof ANIME_QUOTES)[]
      const randomTheme = themes[Math.floor(Math.random() * themes.length)]
      const quotes = ANIME_QUOTES[randomTheme]
      const quote = quotes[Math.floor(Math.random() * quotes.length)]
      
      const affirmations = [
        "Remember, every protagonist started as nobody.",
        "Your journey is unique. Don't compare your Chapter 1 to someone else's Chapter 20.",
        "Even the strongest heroes had moments of doubt. What matters is that they kept going.",
        "Today is another chance to level up.",
        "You have the power to rewrite your story.",
      ]
      
      return {
        quote,
        affirmation: affirmations[Math.floor(Math.random() * affirmations.length)],
        theme: randomTheme,
        date: new Date().toISOString().split('T')[0],
      }
    },
  },
]
