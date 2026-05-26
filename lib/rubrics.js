// lib/rubrics.js

export const salesRubric = {
  title: 'Sales Automation Capstone Rubric',
  total: 100,
  criteria: [
    {
      name: 'Architecture & Design',
      weight: 25,
      description: 'System design, integration approach, code organization'
    },
    {
      name: 'Implementation Quality',
      weight: 25,
      description: 'Code quality, proper error handling, clean implementation'
    },
    {
      name: 'Lead Scoring Accuracy',
      weight: 20,
      description: 'Effectiveness of lead scoring model, ranking quality'
    },
    {
      name: 'Testing & Validation',
      weight: 15,
      description: 'Test coverage, validation of assumptions, edge cases handled'
    },
    {
      name: 'Documentation',
      weight: 15,
      description: 'Code comments, README, deployment instructions'
    }
  ],
  strengths: [
    'Well-documented code with clear explanations',
    'Effective error handling and edge case management',
    'Innovative approach to lead scoring',
    'Clean, modular code architecture',
    'Comprehensive testing strategy',
    'Excellent Salesforce API integration',
    'Thoughtful email personalization logic',
    'Strong performance under load',
    'Good separation of concerns',
    'Proactive monitoring and alerting'
  ],
  improvements: [
    'Add more robust error handling',
    'Include unit tests for critical functions',
    'Improve code comments and documentation',
    'Add logging for debugging production issues',
    'Consider edge cases in lead scoring',
    'Implement rate limiting for API calls',
    'Add monitoring and alerting',
    'Improve variable naming for clarity',
    'Add input validation',
    'Consider performance optimization opportunities',
    'Add retry logic for failed API calls',
    'Implement transaction handling for data consistency'
  ]
};

export const csRubric = {
  title: 'Customer Service Automation Capstone Rubric',
  total: 100,
  criteria: [
    {
      name: 'Architecture & Design',
      weight: 25,
      description: 'System design, Zendesk integration, workflow structure'
    },
    {
      name: 'Implementation Quality',
      weight: 25,
      description: 'Code quality, error handling, ticket processing logic'
    },
    {
      name: 'Automation Rate',
      weight: 20,
      description: 'Percentage of tickets handled automatically vs escalated'
    },
    {
      name: 'Testing & Validation',
      weight: 15,
      description: 'Test coverage, response quality validation'
    },
    {
      name: 'Documentation',
      weight: 15,
      description: 'Code documentation, runbooks, escalation procedures'
    }
  ],
  strengths: [
    'Excellent ticket classification accuracy',
    'Well-designed escalation logic',
    'Clear documentation for human handoffs',
    'Effective sentiment analysis',
    'Strong response generation quality',
    'Good integration with Zendesk',
    'Thoughtful handling of edge cases',
    'Proper logging and monitoring',
    'Clean code organization',
    'Comprehensive test cases'
  ],
  improvements: [
    'Improve ticket classification accuracy',
    'Add more escalation criteria',
    'Enhance response generation prompts',
    'Add sentiment analysis for priority routing',
    'Implement quality assurance checks',
    'Add monitoring dashboards',
    'Improve error handling',
    'Add rate limiting',
    'Document escalation procedures better',
    'Include SLA tracking',
    'Add customer satisfaction tracking',
    'Implement feedback loop for continuous improvement'
  ]
};

export const getCriteria = (capstoneType) => {
  if (capstoneType === 'sales') {
    return salesRubric.criteria;
  } else if (capstoneType === 'cs') {
    return csRubric.criteria;
  }
  return [];
};

export const getRubric = (capstoneType) => {
  if (capstoneType === 'sales') {
    return salesRubric;
  } else if (capstoneType === 'cs') {
    return csRubric;
  }
  return null;
};

export const generateRubricPrompt = (capstoneType) => {
  const rubric = getRubric(capstoneType);
  if (!rubric) return '';

  const criteriaText = rubric.criteria
    .map(c => `- ${c.name} (${c.weight}%): ${c.description}`)
    .join('\n');

  const strengthsText = rubric.strengths.join(', ');
  const improvementsText = rubric.improvements.join(', ');

  return `
You are an expert evaluator for a ${capstoneType === 'sales' ? 'Sales Automation' : 'Customer Service Automation'} capstone project.

Evaluate the submitted project against these criteria:
${criteriaText}

When evaluating, consider:
- Potential strengths to look for: ${strengthsText}
- Common areas for improvement: ${improvementsText}

Provide your evaluation in JSON format with:
{
  "score": <number 0-100>,
  "breakdown": {
    "architecture": <0-25>,
    "implementation": <0-25>,
    "${capstoneType === 'sales' ? 'accuracy' : 'automation_rate'}": <0-20>,
    "testing": <0-15>,
    "documentation": <0-15>
  },
  "strengths": [<list of 2-3 strengths>],
  "improvements": [<list of 2-3 improvements>],
  "feedback": "<detailed constructive feedback>"
}
`;
};
