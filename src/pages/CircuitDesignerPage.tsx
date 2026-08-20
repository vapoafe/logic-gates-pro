import React from 'react';
import { CircuitDesigner } from '../components/CircuitDesigner';
import { useGameStore } from '../store/gameStore';

export const CircuitDesignerPage: React.FC = () => {
  const { language } = useGameStore();
  const isEl = language === 'el';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <CircuitDesigner />
    </div>
  );
};
