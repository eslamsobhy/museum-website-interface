export const categories = [
  "All Objects",
  "Architectural",
  "Ceremonial",
  "Decorative",
  "Musical",
  "Playful",
  "Useable",
  "Wearable",
] as const;

export type Category = (typeof categories)[number];

export type ViewMode = "list" | "grid";

export interface Exhibition {
  id: string;
  title: string;
  category: Exclude<Category, "All Objects">;
  image: string;
}

export const exhibitions: Exhibition[] = [
  {
    id: "1",
    title: "The Alhambra Vase",
    category: "Decorative",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&fit=crop",
  },
  {
    id: "2",
    title: "Djembe Drum of the Mandinka",
    category: "Musical",
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&fit=crop",
  },
  {
    id: "3",
    title: "Gothic Revival Doorway",
    category: "Architectural",
    image: "https://images.unsplash.com/photo-1569587112025-0d460e81a126?w=800&fit=crop",
  },
  {
    id: "4",
    title: "Noh Theatre Mask",
    category: "Ceremonial",
    image: "https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=800&fit=crop",
  },
  {
    id: "5",
    title: "Victorian Automaton Bear",
    category: "Playful",
    image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&fit=crop",
  },
  {
    id: "6",
    title: "Edo Period Kimono",
    category: "Wearable",
    image: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=800&fit=crop",
  },
  {
    id: "7",
    title: "Ottoman Brass Ewer",
    category: "Useable",
    image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&fit=crop",
  },
  {
    id: "8",
    title: "Romanesque Column Capital",
    category: "Architectural",
    image: "https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=800&fit=crop",
  },
  {
    id: "9",
    title: "Javanese Gamelan Gong",
    category: "Musical",
    image: "https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=800&fit=crop",
  },
  {
    id: "10",
    title: "Aztec Feathered Headdress",
    category: "Ceremonial",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&fit=crop",
  },
  {
    id: "11",
    title: "Ming Dynasty Porcelain Bowl",
    category: "Useable",
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&fit=crop",
  },
  {
    id: "12",
    title: "Art Nouveau Brooch",
    category: "Wearable",
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&fit=crop",
  },
  {
    id: "13",
    title: "Venetian Murano Glass Chandelier",
    category: "Decorative",
    image: "https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?w=800&fit=crop",
  },
  {
    id: "14",
    title: "Tin Zoetrope",
    category: "Playful",
    image: "https://images.unsplash.com/photo-1560421683-6856ea585c78?w=800&fit=crop",
  },
  {
    id: "15",
    title: "Mughal Jali Screen",
    category: "Architectural",
    image: "https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=800&fit=crop",
  },
  {
    id: "16",
    title: "West African Kente Cloth",
    category: "Wearable",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&fit=crop",
  },
];
