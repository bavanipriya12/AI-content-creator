export const sampleCreators = [
  {
    id: "creator-1", name: "Mira Kapoor", handle: "@miramakesworlds", role: "AI Filmmaker",
    location: "Mumbai, India", bio: "Building cinematic worlds and campaign films with generative video workflows.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop",
    cover: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop",
    specialization: "AI Filmmaking", contentTypes: ["Video", "Campaign Film"], skills: ["Cinematic storytelling", "Motion design", "Prompt engineering"],
    tools: ["Runway", "Kling", "Midjourney"], workflow: "Concept frames → image generation → video passes → edit and sound design.",
    verifiedTools: true, verifiedWork: true, rate: 850, rating: 4.9, projects: 28,
    portfolio: [
      { title: "After Hours", category: "Campaign Film", image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=900&auto=format&fit=crop", tools: ["Runway", "Kling"], workflow: "Storyboard, image-to-video, editorial finish", format: "16:9", commercialUse: true },
      { title: "Future Nature", category: "Brand Film", image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=900&auto=format&fit=crop", tools: ["Midjourney", "Runway"], workflow: "Look development and motion tests", format: "9:16", commercialUse: true }
    ]
  },
  {
    id: "creator-2", name: "Arjun Rao", handle: "@arjun.generates", role: "Generative Artist",
    location: "Bengaluru, India", bio: "Surreal product worlds, bold textures and art direction for ambitious brands.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&auto=format&fit=crop",
    cover: "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=1200&auto=format&fit=crop",
    specialization: "Generative Art", contentTypes: ["Images", "Product Ads"], skills: ["Art direction", "Product visualization", "Compositing"],
    tools: ["Midjourney", "Photoshop", "Blender"], workflow: "Reference research → prompt exploration → compositing → final retouch.",
    verifiedTools: true, verifiedWork: false, rate: 500, rating: 4.8, projects: 19,
    portfolio: [
      { title: "Chrome Bloom", category: "Product Visual", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&auto=format&fit=crop", tools: ["Midjourney", "Photoshop"], workflow: "Generative concept with compositing", format: "1:1", commercialUse: true },
      { title: "Objects of Tomorrow", category: "Art Direction", image: "https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?w=900&auto=format&fit=crop", tools: ["Blender", "Midjourney"], workflow: "3D blockout and AI texture exploration", format: "4:5", commercialUse: false }
    ]
  },
  {
    id: "creator-3", name: "Zoya Fernandes", handle: "@zoya.motionlab", role: "AI Animator",
    location: "Hyderabad, India", bio: "Playful motion systems, animated identities and short-form social storytelling.",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=240&auto=format&fit=crop",
    cover: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=1200&auto=format&fit=crop",
    specialization: "AI Animation", contentTypes: ["Animation", "Social Video"], skills: ["2D animation", "Character design", "Motion graphics"],
    tools: ["Runway", "After Effects", "Pika"], workflow: "Styleframes → character consistency tests → motion generation → compositing.",
    verifiedTools: false, verifiedWork: true, rate: 650, rating: 5.0, projects: 14,
    portfolio: [
      { title: "Little Big Energy", category: "Social Animation", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=900&auto=format&fit=crop", tools: ["Pika", "After Effects"], workflow: "Character studies and motion graphics", format: "9:16", commercialUse: true },
      { title: "Neon Playground", category: "Motion Design", image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=900&auto=format&fit=crop", tools: ["Runway", "After Effects"], workflow: "Generated backgrounds with composited type", format: "16:9", commercialUse: true }
    ]
  },
  {
    id: "creator-4", name: "Dev Malhotra", handle: "@dev.synthetic", role: "AI Creative Director",
    location: "Delhi, India", bio: "Campaign concepts that blend experimental image making with practical brand systems.",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=240&auto=format&fit=crop",
    cover: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=1200&auto=format&fit=crop",
    specialization: "Creative Direction", contentTypes: ["Campaign Film", "Images", "Product Ads"], skills: ["Creative strategy", "Visual storytelling", "Prompt engineering"],
    tools: ["Midjourney", "Stable Diffusion", "ComfyUI"], workflow: "Brief interpretation → visual territories → repeatable node workflow → art direction.",
    verifiedTools: true, verifiedWork: true, rate: 1000, rating: 4.9, projects: 35,
    portfolio: [
      { title: "A Different Reality", category: "Campaign Concept", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&auto=format&fit=crop", tools: ["Stable Diffusion", "ComfyUI"], workflow: "Custom node graph and controlled iterations", format: "16:9", commercialUse: true },
      { title: "Soft Machines", category: "Brand Visuals", image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=900&auto=format&fit=crop", tools: ["Midjourney", "ComfyUI"], workflow: "Art direction, generation and finishing", format: "4:5", commercialUse: true }
    ]
  },
  {
    id: "creator-5", name: "Ishita Sen", handle: "@ishita.frames", role: "AI Product Visualizer",
    location: "Pune, India", bio: "Premium product imagery and campaign-ready visual systems for digital-first brands.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240&auto=format&fit=crop",
    cover: "https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?w=1200&auto=format&fit=crop",
    specialization: "Product Visualization", contentTypes: ["Images", "Product Ads"], skills: ["Product rendering", "Lighting", "Compositing"],
    tools: ["Blender", "Midjourney", "Photoshop"], workflow: "Product reference lock → lighting tests → generated environment → final composite.",
    verifiedTools: true, verifiedWork: false, rate: 700, rating: 4.7, projects: 22,
    portfolio: [
      { title: "Form Study", category: "Product Campaign", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&auto=format&fit=crop", tools: ["Blender", "Photoshop"], workflow: "3D product base and AI environment", format: "1:1", commercialUse: true }
    ]
  },
  {
    id: "creator-6", name: "Kabir Mehta", handle: "@kabir.worldbuild", role: "AI World Builder",
    location: "Chennai, India", bio: "Immersive environments and speculative worlds for games, trailers and brand stories.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop",
    cover: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&auto=format&fit=crop",
    specialization: "World Building", contentTypes: ["Video", "Images", "Campaign Film"], skills: ["Environment design", "World building", "Cinematic lighting"],
    tools: ["Unreal Engine", "Stable Diffusion", "Kling"], workflow: "World bible → environment blockout → generated variations → camera and motion tests.",
    verifiedTools: false, verifiedWork: false, rate: 600, rating: 4.8, projects: 11,
    portfolio: [
      { title: "The Quiet Planet", category: "Environment Study", image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=900&auto=format&fit=crop", tools: ["Unreal Engine", "Stable Diffusion"], workflow: "Environment design and atmospheric studies", format: "16:9", commercialUse: false }
    ]
  }
];
