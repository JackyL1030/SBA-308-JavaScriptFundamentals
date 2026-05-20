// The provided course information.
const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript",
};
// The provided assignment group.
const AssignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: "Declare a Variable",
      due_at: "2023-01-25",
      points_possible: 50,
    },
    {
      id: 2,
      name: "Write a Function",
      due_at: "2023-02-27",
      points_possible: 150,
    },
    {
      id: 3,
      name: "Code the World",
      due_at: "3156-11-15",
      points_possible: 500,
    },
  ],
};
// The provided learner submission data.
const LearnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-25",
      score: 47,
    },
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-02-12",
      score: 150,
    },
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: {
      submitted_at: "2023-01-25",
      score: 400,
    },
  },
  {
    learner_id: 132,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-24",
      score: 39,
    },
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-03-07",
      score: 140,
    },
  },
];
function getLearnerData(course, ag, submissions) {
  // here, we would process this data to achieve the desired result.
  const result = [
    {
      id: 125,
      avg: 0.985, // (47 + 150) / (50 + 150)
      1: 0.94, // 47 / 50
      2: 1.0, // 150 / 150
    },
    {
      id: 132,
      avg: 0.82, // (39 + 125) / (50 + 150)
      1: 0.78, // 39 / 50
      2: 0.833, // late: (140 - 15) / 150
    },
  ];

  return result;
}
const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);

/////////////////////////////////////////

function getLearnerData(course, assignmentGroup, submissions) {
  try{
  if (course.id !== assignmentGroup.course_id) {
    throw new Error(
      "Invalid input: assignment group does not belong to this course",
    );
  }

  const now = new Date();
  const dueAssignments = assignmentGroup.assignments.filter((assignment) => {
    return new Date(assignment.due_at) <= now;
  });

  const uniqueLearners = [];

  submissions.forEach((submission) => {
    if (!uniqueLearners.includes(submission.learner_id)){
      uniqueLearners.push(submission.learner_id);
    }
  });

  let results = [];
  for (let learnerId of uniqueLearners) {
    let totalEarned = 0;
    let totalPossible = 0;
    let finalResult = {
      id: learnerId,
      avg: 0,
      assignments: {}
    };

    for(let assignment of dueAssignments){
          const submission = submissions.find(
      (s) => s.learner_id === learnerId && s.assignment_id === assignment.id,
    );
    if (!submission) continue;
    if(assignment.points_possible === 0) continue;

    const isLate = new Date(submission.submission.submitted_at) > new Date(assignment.due_at)
    let score = submission.submission.score;
    if(isLate){
      score -= 0.1 * assignment.points_possible;
    }

    function calculatePercentage(score,points){
      return score/points;
    }

    const percentage = calculatePercentage(score, assignment.points_possible);
    totalEarned += score
    totalPossible += assignment.points_possible

    finalResult.assignments[assignment.id] = percentage;
    }

    if(totalPossible === 0){
      finalResult.avg = 0;
    } else {
      finalResult.avg = (totalEarned / totalPossible);
    }
  
    results.push(finalResult);
  }

  console.log(results);
  return results;
  } catch (error){
    console.log("Error processing:")
    return [];
  }
}
