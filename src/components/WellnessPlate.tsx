import { Card } from '@/components/ui/card';

interface WellnessPlateProps {
  mealTime: string;
  macros: {
    carbs: number;
    protein: number;
    fats: number;
  };
  tastes: string[];
  properties: string[];
  tasir?: string;
  foodItems: Array<{ name: string; quantity: string; calories: number }>;
}

const tasteIcons: { [key: string]: string } = {
  'Sweet': '🍯',
  'Sour': '🍋',
  'Salty': '🧂',
  'Pungent': '🌶️',
  'Bitter': '🌿',
  'Astringent': '🍵',
};

const tasteColors: { [key: string]: string } = {
  'Sweet': 'bg-secondary/80 text-secondary-foreground',
  'Sour': 'bg-yellow-400/80 text-yellow-900',
  'Salty': 'bg-blue-400/80 text-blue-900',
  'Pungent': 'bg-red-400/80 text-red-900',
  'Bitter': 'bg-green-400/80 text-green-900',
  'Astringent': 'bg-purple-400/80 text-purple-900',
};

export const WellnessPlate = ({ mealTime, macros, tastes, properties, tasir, foodItems }: WellnessPlateProps) => {
  const totalCalories = foodItems.reduce((sum, item) => sum + item.calories, 0);
  
  // Calculate angles for conic gradient
  const carbsAngle = (macros.carbs / 100) * 360;
  const proteinAngle = carbsAngle + (macros.protein / 100) * 360;
  
  const conicGradient = `conic-gradient(
    from 0deg,
    hsl(var(--chart-1)) 0deg ${carbsAngle}deg,
    hsl(var(--chart-2)) ${carbsAngle}deg ${proteinAngle}deg,
    hsl(var(--chart-3)) ${proteinAngle}deg 360deg
  )`;
  
  return (
    <Card className="p-6 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] transition-shadow">
      <h3 className="text-xl font-semibold mb-4 text-foreground">{mealTime}</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Wellness Plate Visualization */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            {/* The Plate */}
            <div 
              className="w-48 h-48 rounded-full shadow-lg relative"
              style={{ background: conicGradient }}
            >
              {/* Plate Rim */}
              <div className="absolute inset-0 rounded-full border-8 border-card"></div>
              
              {/* Center Label */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-card/95 backdrop-blur-sm rounded-full w-20 h-20 flex items-center justify-center shadow-md">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="text-lg font-bold text-foreground">{totalCalories}</p>
                    <p className="text-xs text-muted-foreground">cal</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Rasa (Tastes) around the rim */}
            <div className="absolute -inset-4 flex items-center justify-center">
              <div className="relative w-full h-full">
                {tastes.map((taste, idx) => {
                  const angle = (idx / tastes.length) * 360;
                  const radius = 120;
                  const x = Math.cos((angle - 90) * Math.PI / 180) * radius;
                  const y = Math.sin((angle - 90) * Math.PI / 180) * radius;
                  
                  return (
                    <div
                      key={idx}
                      className={`absolute px-2 py-1 rounded-full text-xs font-semibold shadow-sm ${tasteColors[taste] || 'bg-muted text-muted-foreground'}`}
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
                      }}
                    >
                      {tasteIcons[taste] || ''} {taste}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Macronutrient Legend */}
          <div className="mt-16 space-y-2 w-full">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-[hsl(var(--chart-1))]"></div>
              <span className="text-sm text-foreground">Carbs: {macros.carbs}%</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-[hsl(var(--chart-2))]"></div>
              <span className="text-sm text-foreground">Protein: {macros.protein}%</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-[hsl(var(--chart-3))]"></div>
              <span className="text-sm text-foreground">Fats: {macros.fats}%</span>
            </div>
          </div>
        </div>
        
        {/* Meal Details */}
        <div className="space-y-4">
          {/* Tasir (Potency) */}
          {tasir && (
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-2">Tasir (Potency)</p>
              <div className="flex items-center gap-2">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  tasir === 'Hot' 
                    ? 'bg-destructive/10 text-destructive' 
                    : 'bg-primary/10 text-primary'
                }`}>
                  {tasir === 'Hot' ? '🔥' : '❄️'} {tasir}
                </span>
              </div>
            </div>
          )}
          
          {/* Guna (Properties) */}
          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-2">Guna (Properties)</p>
            <div className="flex flex-wrap gap-2">
              {properties.map((prop, idx) => (
                <span key={idx} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full font-medium">
                  {prop}
                </span>
              ))}
            </div>
          </div>
          
          {/* Food Items */}
          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-2">Food Items</p>
            <div className="space-y-2">
              {foodItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.quantity}</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-card text-foreground rounded">
                    {item.calories} cal
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
