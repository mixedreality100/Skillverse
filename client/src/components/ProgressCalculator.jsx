import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProgressCalculator = ({ userId, courseId }) => {
  const [progress, setProgress] = useState({ completed: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastCompletedModule, setLastCompletedModule] = useState(null);
  const [firstModuleId, setFirstModuleId] = useState(null);
  const [lastModuleId, setLastModuleId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgress = async () => {
      if (!userId || !courseId) {
        console.error("Missing userId or courseId:", { userId, courseId });
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const progressUrl = `http://localhost:3000/module-completion/${userId}/${courseId}`;
        const lastModuleUrl = `http://localhost:3000/last-completed-module/${userId}/${courseId}`;
        const courseModulesUrl = `http://localhost:3000/course-modules/${courseId}`;
        
        const [progressResponse, lastModuleResponse, courseModulesResponse] = await Promise.all([
          fetch(progressUrl),
          fetch(lastModuleUrl),
          fetch(courseModulesUrl)
        ]);
        
        if (!progressResponse.ok || !lastModuleResponse.ok || !courseModulesResponse.ok) {
          throw new Error(`Failed to fetch progress, last module, or course modules`);
        }
        
        const progressData = await progressResponse.json();
        const lastModuleData = await lastModuleResponse.json();
        const courseModulesData = await courseModulesResponse.json();
        
        setProgress(progressData);
        setLastCompletedModule(lastModuleData.lastCompletedModuleId);
        setFirstModuleId(courseModulesData.firstModuleId);
        setLastModuleId(courseModulesData.lastModuleId);
      } catch (err) {
        console.error("Error fetching progress:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProgress();
  }, [userId, courseId]);

  const handleCourseClick = () => {
    // If no modules completed, start from the first module
    if (progress.completed === 0) {
      navigate(`/aloepage/${firstModuleId}`, {
        state: { fromApp: true }
      });
      return;
    }

    // If all modules are completed, navigate to either the last module or restart from the first
    if (progress.completed === progress.total) {
      // You can customize this logic based on your preference
      // Option 1: Navigate to the last module
      navigate(`/aloepage/${lastModuleId}`, {
        state: { fromApp: true, courseCompleted: true }
      });
      // Uncomment the following block if you want to alternate between last and first module
      // navigate(`/aloepage/${firstModuleId}`, {
      //   state: { fromApp: true, courseRestart: true }
      // });
      return;
    }

    // Navigate to the next module after the last completed module
    const nextModuleId = lastCompletedModule ? lastCompletedModule + 1 : firstModuleId;
    navigate(`/aloepage/${nextModuleId}`, {
      state: { fromApp: true }
    });
  };

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
      <div 
        className="h-2 bg-gray-200 rounded-full cursor-pointer"
        onClick={handleCourseClick}
      >
        <div 
          className="h-2 bg-blue-500 rounded-full transition-all duration-500" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <div 
        className="text-sm text-right mt-1 cursor-pointer hover:text-blue-600"
        onClick={handleCourseClick}
      >
        {progress.completed}/{progress.total} 
        <span className="ml-2 text-blue-500">Start Learning</span>
      </div>
    </div>
  );
};

export default ProgressCalculator;