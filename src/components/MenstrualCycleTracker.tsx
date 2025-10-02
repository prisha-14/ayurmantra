import { Card } from '@/components/ui/card';

interface MenstrualCycleTrackerProps {
  currentDay: number;
  cycleLength: number;
}

const getMenstrualPhase = (currentDay: number, cycleLength: number) => {
  const phasePercentage = (currentDay / cycleLength) * 100;
  
  if (currentDay >= 1 && currentDay <= 5) {
    return { phase: 'Menstrual', color: 'bg-destructive', textColor: 'text-destructive' };
  } else if (currentDay >= 6 && currentDay <= 13) {
    return { phase: 'Follicular', color: 'bg-primary', textColor: 'text-primary' };
  } else if (currentDay >= 14 && currentDay <= 16) {
    return { phase: 'Ovulatory', color: 'bg-secondary', textColor: 'text-secondary' };
  } else {
    return { phase: 'Luteal', color: 'bg-accent', textColor: 'text-accent' };
  }
};

export const MenstrualCycleTracker = ({ currentDay, cycleLength }: MenstrualCycleTrackerProps) => {
  const { phase, color, textColor } = getMenstrualPhase(currentDay, cycleLength);
  const progressPercentage = (currentDay / cycleLength) * 100;
  
  return (
    <Card className="p-6 shadow-[var(--shadow-soft)]">
      <h2 className="text-xl font-semibold mb-4 text-foreground">Menstrual Cycle Tracking</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Current Phase</p>
            <span className={`inline-flex items-center px-3 py-1 mt-1 rounded-full text-sm font-semibold ${color} text-white`}>
              {phase}
            </span>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Cycle Day</p>
            <p className="text-2xl font-bold text-foreground">
              {currentDay} <span className="text-lg text-muted-foreground">/ {cycleLength}</span>
            </p>
          </div>
        </div>
        
        <div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div 
              className={`h-3 rounded-full transition-all ${color}`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Day 1</span>
            <span>Day {cycleLength}</span>
          </div>
        </div>
        
        <div className="pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Dietary Focus for {phase} Phase:</p>
          <p className="text-sm text-foreground">
            {phase === 'Menstrual' && 'Focus on iron-rich foods, warming spices, and easy-to-digest meals.'}
            {phase === 'Follicular' && 'Emphasize fresh vegetables, lean proteins, and fermented foods.'}
            {phase === 'Ovulatory' && 'Include antioxidant-rich foods, fiber, and cooling herbs.'}
            {phase === 'Luteal' && 'Prioritize complex carbs, B vitamins, and magnesium-rich foods.'}
          </p>
        </div>
      </div>
    </Card>
  );
};
