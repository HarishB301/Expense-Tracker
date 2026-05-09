import OpenAI from 'openai';

interface RawInsight {
  type?: string;
  title?: string;
  message?: string;
  action?: string;
  confidence?: number;
}

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY,

  defaultHeaders: {
    'HTTP-Referer':
      process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'X-Title': 'ExpenseTracker AI',
  },
});

export interface ExpenseRecord {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface AIInsight {
  id: string;
  type: 'warning' | 'info' | 'success' | 'tip';
  title: string;
  message: string;
  action?: string;
  confidence: number;
}

export async function generateExpenseInsights(
  expenses: ExpenseRecord[]
): Promise<AIInsight[]> {
  try {
    const expensesSummary = expenses.map((expense) => ({
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: expense.date,
    }));

    const prompt = `
Analyze the following expense data and provide 3-4 actionable financial insights.

IMPORTANT:
- ALL currency values MUST be in Indian Rupees (₹).
- NEVER use dollars ($) or USD.
- Use INR formatting like ₹500, ₹1,200, ₹25,000.

Return a JSON array with this structure:


  {
    "type": "warning|info|success|tip",
    "title": "Brief title",
    "message": "Detailed insight message with specific ₹ amounts",
    "action": "Actionable suggestion",
    "confidence": 0.8
  }


Expense Data:
${JSON.stringify(expensesSummary, null, 2)}

Focus on:
1. Spending patterns
2. Budget alerts
3. Money-saving opportunities
4. Positive reinforcement

Return ONLY valid JSON.
`;

    const completion = await openai.chat.completions.create({
      model: 'deepseek/deepseek-chat',

      messages: [
        {
          role: 'system',
          content:
            'You are an Indian financial advisor AI. Always use ₹ (Indian Rupees) instead of dollars.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],

      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.choices[0].message.content;

    if (!response) {
      throw new Error('No response from AI');
    }

    let cleanedResponse = response.trim();

    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse
        .replace(/^```json\s*/, '')
        .replace(/\s*```$/, '');
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse
        .replace(/^```\s*/, '')
        .replace(/\s*```$/, '');
    }

    const insights = JSON.parse(cleanedResponse);

    const formattedInsights = insights.map(
      (insight: RawInsight, index: number) => ({
        id: `ai-${Date.now()}-${index}`,

        type: insight.type || 'info',

        title: insight.title || 'AI Insight',

        message: insight.message || 'Analysis complete',

        action: insight.action,

        confidence: insight.confidence || 0.8,
      })
    );

    return formattedInsights;
  } catch (error) {
    console.error('❌ Error generating AI insights:', error);

    return [
      {
        id: 'fallback-1',

        type: 'info',

        title: 'AI Analysis Unavailable',

        message:
          'Unable to generate personalized insights at this time.',

        action: 'Refresh insights',

        confidence: 0.5,
      },
    ];
  }
}

export async function categorizeExpense(
  description: string
): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'deepseek/deepseek-chat',

      messages: [
        {
          role: 'system',
          content:
            'You are an expense categorization AI. Categorize expenses into one of these categories only: Food, Transportation, Entertainment, Shopping, Bills, Healthcare, Other. Respond ONLY with the category name.',
        },
        {
          role: 'user',
          content: `Categorize this expense: "${description}"`,
        },
      ],

      temperature: 0.1,
      max_tokens: 20,
    });

    const category = completion.choices[0].message.content?.trim();

    const validCategories = [
      'Food',
      'Transportation',
      'Entertainment',
      'Shopping',
      'Bills',
      'Healthcare',
      'Other',
    ];

    return validCategories.includes(category || '')
      ? category!
      : 'Other';
  } catch (error) {
    console.error('❌ Error categorizing expense:', error);

    return 'Other';
  }
}

export async function generateAIAnswer(
  question: string,
  context: ExpenseRecord[]
): Promise<string> {
  try {
    const expensesSummary = context.map((expense) => ({
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: expense.date,
    }));

    const prompt = `
Based on the following expense data, answer this question:

"${question}"

IMPORTANT:
- Use ONLY Indian Rupees (₹ / INR).
- NEVER use dollars ($).
- Mention amounts like ₹500, ₹2,000, ₹15,000.

Expense Data:
${JSON.stringify(expensesSummary, null, 2)}

Provide:
1. Direct answer
2. Concrete spending analysis
3. Actionable advice
4. Concise response (2-3 sentences)

Return ONLY plain text.
`;

    const completion = await openai.chat.completions.create({
      model: 'deepseek/deepseek-chat',

      messages: [
        {
          role: 'system',
          content:
            'You are a helpful Indian financial advisor AI. Always use Indian Rupees (₹).',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],

      temperature: 0.7,
      max_tokens: 200,
    });

    const response = completion.choices[0].message.content;

    if (!response) {
      throw new Error('No response from AI');
    }

    return response.trim();
  } catch (error) {
    console.error('❌ Error generating AI answer:', error);

    return 'Unable to generate AI response right now.';
  }
}