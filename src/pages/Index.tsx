import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { MenstrualCycleTracker } from '@/components/MenstrualCycleTracker';
import { WellnessPlate } from '@/components/WellnessPlate';

// ============== MOCK DATA ==============

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  prakriti: string;
  healthGoals: string[];
  allergies: string[];
  mealFrequency: number;
  waterIntake: number;
  dietCharts: DietChart[];
  feedback: string;
  menstrualCycle?: {
    currentDay: number;
    cycleLength: number;
  };
}

interface DietChart {
  id: string;
  createdDate: string;
  meals: Meal[];
}

interface Meal {
  time: string;
  items: FoodItem[];
  macros: {
    carbs: number;
    protein: number;
    fats: number;
  };
  tastes: string[];
  properties: string[];
  tasir?: string;
}

interface FoodItem {
  name: string;
  quantity: string;
  calories: number;
  rasa: string[];
  properties: string[];
}

interface FoodDatabase {
  id: string;
  name: string;
  category: string;
  calories: number;
  rasa: string[];
  properties: string[];
  allergies: string[];
  region: string;
}

interface MythBuster {
  id: string;
  combination: string;
  foods: string[];
  issue: string;
  alternatives: string[];
}

const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    age: 32,
    gender: 'Female',
    prakriti: 'Vata-Pitta',
    healthGoals: ['Weight Management', 'Better Digestion'],
    allergies: ['Dairy'],
    mealFrequency: 4,
    waterIntake: 8,
    menstrualCycle: {
      currentDay: 5,
      cycleLength: 28
    },
    dietCharts: [
      {
        id: 'dc1',
        createdDate: '2025-09-15',
        meals: [
          {
            time: 'Breakfast (7:00 AM)',
            macros: { carbs: 60, protein: 25, fats: 15 },
            tastes: ['Sweet', 'Astringent', 'Bitter', 'Pungent'],
            properties: ['Warm', 'Light', 'Easy to digest'],
            tasir: 'Hot',
            items: [
              {
                name: 'Oats Porridge with Almonds',
                quantity: '1 bowl',
                calories: 250,
                rasa: ['Sweet', 'Astringent'],
                properties: ['Easy to digest', 'Warm', 'Grounding']
              },
              {
                name: 'Herbal Tea (Tulsi)',
                quantity: '1 cup',
                calories: 5,
                rasa: ['Bitter', 'Pungent'],
                properties: ['Hot', 'Light', 'Detoxifying']
              }
            ]
          },
          {
            time: 'Mid-Morning (10:30 AM)',
            macros: { carbs: 85, protein: 5, fats: 10 },
            tastes: ['Sweet'],
            properties: ['Cooling', 'Light', 'Easy to digest'],
            tasir: 'Cold',
            items: [
              {
                name: 'Fresh Fruit (Papaya)',
                quantity: '1 medium',
                calories: 120,
                rasa: ['Sweet'],
                properties: ['Easy to digest', 'Cooling', 'Light']
              }
            ]
          },
          {
            time: 'Lunch (1:00 PM)',
            macros: { carbs: 55, protein: 30, fats: 15 },
            tastes: ['Sweet', 'Astringent', 'Bitter'],
            properties: ['Warm', 'Nourishing', 'Balancing'],
            tasir: 'Hot',
            items: [
              {
                name: 'Brown Rice with Moong Dal',
                quantity: '1.5 cups',
                calories: 320,
                rasa: ['Sweet', 'Astringent'],
                properties: ['Warm', 'Nourishing', 'Balancing']
              },
              {
                name: 'Spinach Sabzi',
                quantity: '1 cup',
                calories: 80,
                rasa: ['Bitter', 'Astringent'],
                properties: ['Warm', 'Light', 'Purifying']
              }
            ]
          },
          {
            time: 'Evening Snack (4:30 PM)',
            macros: { carbs: 20, protein: 20, fats: 60 },
            tastes: ['Sweet'],
            properties: ['Warm', 'Heavy', 'Nourishing'],
            tasir: 'Hot',
            items: [
              {
                name: 'Mixed Nuts',
                quantity: '1 handful',
                calories: 180,
                rasa: ['Sweet'],
                properties: ['Warm', 'Heavy', 'Nourishing']
              }
            ]
          },
          {
            time: 'Dinner (7:30 PM)',
            macros: { carbs: 50, protein: 25, fats: 25 },
            tastes: ['Sweet', 'Salty', 'Astringent'],
            properties: ['Easy to digest', 'Warm', 'Cooling', 'Soothing'],
            tasir: 'Hot',
            items: [
              {
                name: 'Vegetable Khichdi',
                quantity: '1 bowl',
                calories: 240,
                rasa: ['Sweet', 'Salty'],
                properties: ['Easy to digest', 'Warm', 'Soothing']
              },
              {
                name: 'Cucumber Raita',
                quantity: '1 small bowl',
                calories: 60,
                rasa: ['Sweet', 'Astringent'],
                properties: ['Cooling', 'Light', 'Hydrating']
              }
            ]
          }
        ]
      }
    ],
    feedback: 'Feeling more energetic, digestion has improved significantly.'
  },
  {
    id: '2',
    name: 'Rajesh Kumar',
    age: 45,
    gender: 'Male',
    prakriti: 'Kapha-Pitta',
    healthGoals: ['Blood Sugar Control', 'Heart Health'],
    allergies: ['Peanuts'],
    mealFrequency: 3,
    waterIntake: 10,
    dietCharts: [],
    feedback: ''
  },
  {
    id: '3',
    name: 'Anita Desai',
    age: 28,
    gender: 'Female',
    prakriti: 'Pitta',
    healthGoals: ['Stress Management', 'Better Sleep'],
    allergies: [],
    mealFrequency: 3,
    waterIntake: 7,
    menstrualCycle: {
      currentDay: 18,
      cycleLength: 30
    },
    dietCharts: [],
    feedback: ''
  }
];

const mockFoodDatabase: FoodDatabase[] = [
  {
    id: 'f1',
    name: 'Moong Dal',
    category: 'Lentils',
    calories: 105,
    rasa: ['Sweet', 'Astringent'],
    properties: ['Easy to digest', 'Cooling', 'Light'],
    allergies: [],
    region: 'All India'
  },
  {
    id: 'f2',
    name: 'Ghee',
    category: 'Fats',
    calories: 112,
    rasa: ['Sweet'],
    properties: ['Warm', 'Heavy', 'Nourishing'],
    allergies: ['Dairy'],
    region: 'All India'
  },
  {
    id: 'f3',
    name: 'Turmeric',
    category: 'Spices',
    calories: 24,
    rasa: ['Bitter', 'Pungent'],
    properties: ['Hot', 'Light', 'Anti-inflammatory'],
    allergies: [],
    region: 'All India'
  },
  {
    id: 'f4',
    name: 'Basmati Rice',
    category: 'Grains',
    calories: 130,
    rasa: ['Sweet'],
    properties: ['Cooling', 'Easy to digest', 'Light'],
    allergies: [],
    region: 'North India'
  },
  {
    id: 'f5',
    name: 'Coconut',
    category: 'Fruits',
    calories: 354,
    rasa: ['Sweet'],
    properties: ['Cooling', 'Heavy', 'Nourishing'],
    allergies: ['Tree Nuts'],
    region: 'South India'
  }
];

const mockMythBusters: MythBuster[] = [
  {
    id: 'm1',
    combination: 'Milk + Fish',
    foods: ['Milk', 'Fish'],
    issue: 'This combination creates toxins in the body and disturbs the gut microbiome. It can lead to skin issues and digestive problems.',
    alternatives: ['Have fish with lemon and vegetables', 'Consume milk separately, preferably warm with spices']
  },
  {
    id: 'm2',
    combination: 'Honey + Heat',
    foods: ['Honey', 'Hot beverages/cooking'],
    issue: 'Heating honey above 40°C transforms it into a glue-like substance that adheres to the digestive tract, creating toxins.',
    alternatives: ['Add honey to warm (not hot) beverages', 'Consume raw honey at room temperature']
  },
  {
    id: 'm3',
    combination: 'Yogurt + Fruits',
    foods: ['Yogurt', 'Citrus fruits'],
    issue: 'The combination produces toxins and causes congestion, allergies, and digestive issues. Different fermentation processes clash.',
    alternatives: ['Have yogurt with honey and spices', 'Eat fruits separately as a snack']
  },
  {
    id: 'm4',
    combination: 'Milk + Bananas',
    foods: ['Milk', 'Bananas'],
    issue: 'Both are heavy to digest. Together they create heaviness, reduce Agni (digestive fire), and produce toxins.',
    alternatives: ['Make banana smoothie with almond milk', 'Have banana with cardamom powder']
  }
];

// ============== MAIN COMPONENT ==============

const Index = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'patients' | 'food' | 'myths' | 'handbook'>('patients');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [foodFilters, setFoodFilters] = useState({ allergy: '', region: '' });

  const filteredPatients = useMemo(() => {
    return mockPatients.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredFoods = useMemo(() => {
    return mockFoodDatabase.filter(f => {
      const allergyMatch = !foodFilters.allergy || !f.allergies.includes(foodFilters.allergy);
      const regionMatch = !foodFilters.region || f.region === foodFilters.region;
      return allergyMatch && regionMatch;
    });
  }, [foodFilters]);

  const handleGenerateDietChart = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      toast.success('Ayurvedic diet chart generated successfully!');
    }, 2000);
  };

  const handleChatSubmit = () => {
    if (!chatInput.trim()) return;
    
    const newMessages = [
      ...chatMessages,
      { role: 'user' as const, content: chatInput },
      { 
        role: 'assistant' as const, 
        content: getChatbotResponse(chatInput) 
      }
    ];
    
    setChatMessages(newMessages);
    setChatInput('');
  };

  const getChatbotResponse = (question: string): string => {
    const lowerQ = question.toLowerCase();
    
    if (lowerQ.includes('pitta') || lowerQ.includes('prakrit')) {
      return 'Pitta dosha represents fire and water elements. Pitta-dominant individuals should favor cooling, sweet, bitter, and astringent foods. Avoid excessive spicy, sour, and salty foods. Good choices include cucumber, coconut, cilantro, and sweet fruits.';
    } else if (lowerQ.includes('vata')) {
      return 'Vata dosha represents air and space elements. Vata types benefit from warm, moist, grounding foods. Favor sweet, sour, and salty tastes. Include cooked grains, root vegetables, warm milk, and healthy oils like ghee and sesame oil.';
    } else if (lowerQ.includes('kapha')) {
      return 'Kapha dosha represents earth and water elements. Kapha individuals should favor light, warm, and dry foods. Emphasize pungent, bitter, and astringent tastes. Include spices, leafy greens, legumes, and avoid heavy, oily, or cold foods.';
    } else if (lowerQ.includes('agni') || lowerQ.includes('digest')) {
      return 'Agni is the digestive fire. To strengthen Agni: eat warm, freshly cooked meals; favor digestive spices like ginger, cumin, and fennel; avoid overeating; maintain regular meal times; and consider fasting occasionally.';
    } else {
      return 'According to Ayurveda, optimal health comes from balancing the three doshas (Vata, Pitta, Kapha) through proper diet, lifestyle, and daily routines. Each individual has a unique constitution (Prakriti) that determines their ideal dietary choices.';
    }
  };

  // ============== ICONS ==============

  const DashboardIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );

  const UsersIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );

  const FoodIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );

  const BookIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );

  const ChatIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  );

  const SearchIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );

  const BackIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );

  const SparklesIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );

  // ============== RENDER VIEWS ==============

  const renderDashboard = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <UsersIcon />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Patients</p>
              <p className="text-2xl font-bold text-foreground">{mockPatients.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <FoodIcon />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Food Items</p>
              <p className="text-2xl font-bold text-foreground">{mockFoodDatabase.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <BookIcon />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Plans</p>
              <p className="text-2xl font-bold text-foreground">
                {mockPatients.filter(p => p.dietCharts.length > 0).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 shadow-[var(--shadow-soft)]">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Recent Activity</h2>
        <div className="space-y-3">
          {mockPatients.slice(0, 3).map(patient => (
            <div key={patient.id} className="flex items-center justify-between py-2 border-b border-border">
              <div>
                <p className="font-medium text-foreground">{patient.name}</p>
                <p className="text-sm text-muted-foreground">{patient.prakriti} • {patient.age} years</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSelectedPatient(patient);
                  setActiveView('patients');
                }}
              >
                View Profile
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderPatientsList = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Patients</h1>
      </div>

      <div className="relative">
        <SearchIcon />
        <Input
          placeholder="Search patients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          <SearchIcon />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.map(patient => (
          <Card 
            key={patient.id}
            className="p-6 cursor-pointer shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] transition-all hover:scale-[1.02]"
            onClick={() => setSelectedPatient(patient)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg text-foreground">{patient.name}</h3>
                <p className="text-sm text-muted-foreground">{patient.age} years • {patient.gender}</p>
              </div>
              <span className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded-full">
                {patient.prakriti}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Goals:</span>
                <span className="text-foreground">{patient.healthGoals[0]}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Diet Charts:</span>
                <span className="font-semibold text-primary">{patient.dietCharts.length}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderPatientProfile = () => {
    if (!selectedPatient) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedPatient(null)}
          >
            <BackIcon />
            <span className="ml-2">Back</span>
          </Button>
          <h1 className="text-3xl font-bold text-foreground">{selectedPatient.name}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 shadow-[var(--shadow-soft)]">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Profile Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="font-medium text-foreground">{selectedPatient.age} years</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="font-medium text-foreground">{selectedPatient.gender}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Prakriti</p>
                <p className="font-medium text-primary">{selectedPatient.prakriti}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Health Goals</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedPatient.healthGoals.map((goal, idx) => (
                    <span key={idx} className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded-full">
                      {goal}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Allergies</p>
                <p className="font-medium text-destructive">
                  {selectedPatient.allergies.length > 0 ? selectedPatient.allergies.join(', ') : 'None'}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-[var(--shadow-soft)]">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Profile Tracking</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Meal Frequency</span>
                  <span className="text-sm font-medium text-foreground">{selectedPatient.mealFrequency}/day</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${(selectedPatient.mealFrequency / 6) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Water Intake</span>
                  <span className="text-sm font-medium text-foreground">{selectedPatient.waterIntake} glasses</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${(selectedPatient.waterIntake / 12) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-[var(--shadow-soft)]">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Patient Feedback</h2>
            <p className="text-sm text-muted-foreground italic">
              {selectedPatient.feedback || 'No feedback available yet.'}
            </p>
          </Card>
        </div>

        {/* Menstrual Cycle Tracking for Female Patients */}
        {selectedPatient.gender === 'Female' && selectedPatient.menstrualCycle && (
          <MenstrualCycleTracker 
            currentDay={selectedPatient.menstrualCycle.currentDay}
            cycleLength={selectedPatient.menstrualCycle.cycleLength}
          />
        )}

        <Card className="p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Diet Charts</h2>
            <Button 
              onClick={handleGenerateDietChart}
              disabled={isGenerating}
              className="bg-primary hover:bg-primary/90"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
                  Generating...
                </>
              ) : (
                <>
                  <SparklesIcon />
                  <span className="ml-2">Generate Ayurvedic Plan</span>
                </>
              )}
            </Button>
          </div>

          {selectedPatient.dietCharts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No diet charts available. Generate one to get started!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {selectedPatient.dietCharts.map(chart => (
                <div key={chart.id}>
                  <p className="text-sm text-muted-foreground mb-4">
                    Created on {new Date(chart.createdDate).toLocaleDateString('en-IN', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  
                  <div className="space-y-6">
                    {chart.meals.map((meal, mIdx) => (
                      <WellnessPlate
                        key={mIdx}
                        mealTime={meal.time}
                              macros={meal.macros}
                              tastes={meal.tastes}
                              properties={meal.properties}
                              tasir={meal.tasir}
                              foodItems={meal.items}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    );
  };

  const renderFoodDatabase = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Food Database</h1>

      <Card className="p-4 shadow-[var(--shadow-soft)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Filter by Allergy</label>
            <select
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
              value={foodFilters.allergy}
              onChange={(e) => setFoodFilters(prev => ({ ...prev, allergy: e.target.value }))}
            >
              <option value="">All</option>
              <option value="Dairy">Exclude Dairy</option>
              <option value="Tree Nuts">Exclude Tree Nuts</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Filter by Region</label>
            <select
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
              value={foodFilters.region}
              onChange={(e) => setFoodFilters(prev => ({ ...prev, region: e.target.value }))}
            >
              <option value="">All Regions</option>
              <option value="North India">North India</option>
              <option value="South India">South India</option>
              <option value="All India">All India</option>
            </select>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFoods.map(food => (
          <Card key={food.id} className="p-4 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-foreground">{food.name}</h3>
                <p className="text-sm text-muted-foreground">{food.category}</p>
              </div>
              <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full">
                {food.calories} cal
              </span>
            </div>
            
            <div className="space-y-2">
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1">Rasa</p>
                <div className="flex flex-wrap gap-1">
                  {food.rasa.map((r, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1">Properties</p>
                <div className="flex flex-wrap gap-1">
                  {food.properties.map((p, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-accent text-accent-foreground text-xs rounded">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Region: <span className="text-foreground font-normal">{food.region}</span></p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderMythBusters = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Myth Busters - Viruddha Ahara</h1>
      <p className="text-muted-foreground">Non-complementing food combinations to avoid for optimal health</p>

      <div className="space-y-4">
        {mockMythBusters.map(myth => (
          <Card key={myth.id} className="p-6 shadow-[var(--shadow-soft)]">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-destructive/10 text-destructive rounded-lg flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2 text-foreground">{myth.combination}</h3>
                
                <div className="mb-3">
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Foods Involved:</p>
                  <div className="flex gap-2">
                    {myth.foods.map((food, idx) => (
                      <span key={idx} className="px-3 py-1 bg-destructive/10 text-destructive rounded-full text-sm">
                        {food}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Why It's Harmful:</p>
                  <p className="text-foreground">{myth.issue}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Healthy Alternatives:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {myth.alternatives.map((alt, idx) => (
                      <li key={idx} className="text-foreground">{alt}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderHandbook = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Ayurvedic Handbook</h1>
      <p className="text-muted-foreground">Ask questions about Ayurvedic principles and diet recommendations</p>

      <Card className="p-6 shadow-[var(--shadow-soft)] h-[600px] flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {chatMessages.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ChatIcon />
              <p className="mt-4">Ask me anything about Ayurveda!</p>
              <div className="mt-6 space-y-2 text-sm">
                <p className="font-semibold">Try asking:</p>
                <p>"What should I eat for Pitta dosha?"</p>
                <p>"How do I improve my digestive fire?"</p>
                <p>"What foods are good for Vata balance?"</p>
              </div>
            </div>
          ) : (
            chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-accent text-accent-foreground'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Ask about Ayurvedic diet principles..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
            className="flex-1"
          />
          <Button onClick={handleChatSubmit} disabled={!chatInput.trim()}>
            Send
          </Button>
        </div>
      </Card>
    </div>
  );

  // ============== MAIN RENDER ==============

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-sidebar text-sidebar-foreground shadow-[var(--shadow-medium)] flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-2xl font-bold">AyuMantra</h1>
          <p className="text-sm text-sidebar-foreground/70 mt-1">Ayurvedic Diet System</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => {
              setActiveView('dashboard');
              setSelectedPatient(null);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeView === 'dashboard' && !selectedPatient
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'hover:bg-sidebar-accent/50'
            }`}
          >
            <DashboardIcon />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => {
              setActiveView('patients');
              setSelectedPatient(null);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeView === 'patients' && !selectedPatient
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'hover:bg-sidebar-accent/50'
            }`}
          >
            <UsersIcon />
            <span>Patients</span>
          </button>

          <button
            onClick={() => {
              setActiveView('food');
              setSelectedPatient(null);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeView === 'food'
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'hover:bg-sidebar-accent/50'
            }`}
          >
            <FoodIcon />
            <span>Food Database</span>
          </button>

          <button
            onClick={() => {
              setActiveView('myths');
              setSelectedPatient(null);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeView === 'myths'
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'hover:bg-sidebar-accent/50'
            }`}
          >
            <BookIcon />
            <span>Myth Busters</span>
          </button>

          <button
            onClick={() => {
              setActiveView('handbook');
              setSelectedPatient(null);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeView === 'handbook'
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'hover:bg-sidebar-accent/50'
            }`}
          >
            <ChatIcon />
            <span>Handbook</span>
          </button>
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <p className="text-xs text-sidebar-foreground/60 text-center">
            © 2025 AyuMantra
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        {selectedPatient ? (
          renderPatientProfile()
        ) : activeView === 'dashboard' ? (
          renderDashboard()
        ) : activeView === 'patients' ? (
          renderPatientsList()
        ) : activeView === 'food' ? (
          renderFoodDatabase()
        ) : activeView === 'myths' ? (
          renderMythBusters()
        ) : (
          renderHandbook()
        )}
      </div>
    </div>
  );
};

export default Index;
