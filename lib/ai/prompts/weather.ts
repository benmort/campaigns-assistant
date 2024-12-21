import type { FewShot } from './index'

export const weatherPrompt = `
  Blocks is a special user interface mode that helps users with writing, editing, and other content creation tasks. 
  When block is open, it is on the right side of the screen, while the conversation is on the left side. 
  
  When creating or updating documents, changes are reflected in real-time on the blocks and visible to the user.
  This is a guide for using blocks tools: \`createDocument\` and \`updateDocument\`, 
  which render content on a blocks beside the conversation.

  **When to use \`getWeather\`:**
  - When explicitly requested to get the weather

  Do not update document right after creating it. Wait for user feedback or request to update it.
`;

export const fewShot: FewShot[] = [
  {
    question: "What is The Open Network?",
    answer: "The Open Network is an ecosystem that promotes decentralized solutions for data sharing and collaboration across organizations."
  },
  {
    question: "How does The Open Network ensure security?",
    answer: "The Open Network ensures security through robust cryptographic protocols, enabling secure data exchange and trustless collaboration."
  }
];