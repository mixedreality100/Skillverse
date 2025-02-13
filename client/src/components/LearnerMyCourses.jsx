import React, { useState } from "react";

const LearnerMyCourses = () => {
  const completedCourses = [
    { id: 1, title: "Course 1", image: "https://via.placeholder.com/150" },
    { id: 2, title: "Course 2", image: "https://via.placeholder.com/150" },
    { id: 3, title: "Course 3", image: "https://via.placeholder.com/150" },
  ];

 {/* Completed Courses Section */}
 return (
  <div>
 <div className="mb-12">
 <h3 className="text-3xl font-bold mb-4">Completed Courses</h3>
 <div className="flex justify-between space-x-8">
   {completedCourses.map((course) => (
     <div
       key={course.id}
       className="w-1/3 text-center border border-gray-300 rounded-lg shadow-lg p-4"
     >
       <img src={course.image} alt={course.title} className="w-full h-40 rounded-lg" />
       <p className="mt-2 text-sm font-semibold">{course.title}</p>
     </div>
   ))}
 </div>
</div>
</div>

  );
};

export default LearnerMyCourses;
