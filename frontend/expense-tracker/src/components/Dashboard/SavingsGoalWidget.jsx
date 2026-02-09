import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const SavingsGoalWidget = () => {
  const [goals, setGoals] = useState(() => {
    return JSON.parse(localStorage.getItem('savingsGoals')) || [];
  });

  const [newGoal, setNewGoal] = useState({ name: '', target: '' });
  const [activeInput, setActiveInput] = useState(null); // Track which goal is being edited

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('savingsGoals', JSON.stringify(goals));
  }, [goals]);

  const addGoal = () => {
    if (newGoal.name && newGoal.target) {
      setGoals([...goals, {
        name: newGoal.name,
        target: Number(newGoal.target),
        saved: 0
      }]);
      setNewGoal({ name: '', target: '' });
      toast.success('Goal added!');
    }
  };

  const handleSave = (index, amount) => {
    if (!amount) return;
    
    const updatedGoals = [...goals];
    updatedGoals[index].saved += Number(amount);
    setGoals(updatedGoals);
    setActiveInput(null); // Hide input after saving
    toast.success(`$${amount} saved for ${goals[index].name}`);
  };

  const deleteGoal = (index) => {
    setGoals(goals.filter((_, i) => i !== index));
    toast.success('Goal deleted');
  };

  return (
    <div className="bg-white rounded-lg p-4">
      <h3 className="font-bold text-lg mb-4">Savings Goals</h3>
      
      {/* Goals List */}
      <div className="space-y-4 mb-6">
        {goals.map((goal, index) => (
          <div key={index} className="border-b pb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium">{goal.name}</span>
              <button 
                onClick={() => deleteGoal(index)}
                className="text-red-400 hover:text-red-600"
              >
                ✕
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">
              Saved: <span className="text-green-600">${goal.saved}</span> / ${goal.target}
            </p>
            
            {/* Only show input when clicked */}
            {activeInput === index ? (
              <input
                type="number"
                placeholder="$ Enter amount"
                className="w-full p-2 border rounded mb-2"
                autoFocus
                onBlur={(e) => handleSave(index, e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave(index, e.target.value)}
              />
            ) : (
              <button
                onClick={() => setActiveInput(index)}
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                + Add to savings
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add New Goal */}
      <div className="space-y-2">
        <h4 className="font-medium">Add New Goal</h4>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Goal name"
            className="flex-1 p-2 border rounded"
            value={newGoal.name}
            onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
          />
          <input
            type="number"
            placeholder="$ Target"
            className="w-24 p-2 border rounded"
            value={newGoal.target}
            onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
          />
          <button 
            onClick={addGoal}
            className="bg-blue-500 text-white px-3 rounded"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};
export default SavingsGoalWidget;