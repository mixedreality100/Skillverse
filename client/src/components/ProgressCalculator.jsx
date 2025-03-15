import { useState, useEffect } from "react";

const ProgressCalculator = ({ userId, courseId }) => {
  const [progress, setProgress] = useState({ completed: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!userId || !courseId) {
        console.error("Missing userId or courseId:", { userId, courseId });
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/module-completion/${userId}/${courseId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch progress: ${response.status}`);
        }
        
        const data = await response.json();
        setProgress(data);
      } catch (err) {
        console.error("Error fetching progress:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [userId, courseId]);

  if (loading) {
    return <div className="h-2 bg-gray-200 rounded-full"><div className="h-2 bg-blue-500 rounded-full w-0"></div></div>;
  }

  if (error) {
    return <div className="text-sm text-red-500">Error loading progress</div>;
  }

  const progressPercentage = progress.total > 0 
    ? Math.round((progress.completed / progress.total) * 100) 
    : 0;

  return (
    <div>
      <div className="h-2 bg-gray-200 rounded-full">
        <div 
          className="h-2 bg-blue-500 rounded-full transition-all duration-500" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <div className="text-sm text-right mt-1">
        {progress.completed}/{progress.total}
      </div>
    </div>
  );
};

export default ProgressCalculator;